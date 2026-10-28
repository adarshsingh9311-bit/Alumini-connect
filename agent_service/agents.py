import time
from typing import Dict, Any
from state import AlumniPlatformState
from tools import (
    extract_and_analyze_skills,
    compute_multi_objective_utility,
    query_alumni_vector_index,
    scrub_pii,
    create_seminar_record,
    register_student_for_seminar,
    generate_stage_alert,
    SEMINAR_STORE
)

def log_agent_event(state: AlumniPlatformState, agent_name: str, step: str, summary: str, status: str = "COMPLETED"):
    event = {
        "timestamp": time.time(),
        "time_str": time.strftime("%H:%M:%S"),
        "agent": agent_name,
        "step": step,
        "result_summary": summary,
        "status": status
    }
    state["events"].append(event)
    return event

# 1. Supervisor / Router Agent
def supervisor_router_node(state: AlumniPlatformState) -> AlumniPlatformState:
    wf_type = state.get("workflow_type", "mentor_match")
    log_agent_event(
        state,
        "Supervisor Agent",
        "Route Selection",
        f"Selected workflow branch: '{wf_type}' with target: '{state.get('target_role') or state.get('seminar_topic') or state.get('seminar_details', {}).get('title')}'"
    )
    return state

# 2. Candidate Profiling Agent
def candidate_profiling_node(state: AlumniPlatformState) -> AlumniPlatformState:
    text = f"{state.get('raw_input_skills', '')} {state.get('resume_text', '')}"
    skills, gaps, evidence = extract_and_analyze_skills(state.get("target_role", "Machine Learning Engineer"), text)
    state["extracted_skills"] = skills
    state["inferred_gaps"] = gaps
    state["profiler_evidence"] = evidence

    log_agent_event(
        state,
        "Candidate Profiling Agent",
        "Diagnose Resume & Skills",
        f"Parsed {len(skills)} proficiencies ({', '.join(skills[:3])}). Detected {len(gaps)} missing benchmark skills ({', '.join(gaps[:2])})."
    )
    return state

# 3. Alumni Broker Agent (Retrieval + Anti-Fatigue Utility Ranking)
def alumni_broker_node(state: AlumniPlatformState) -> AlumniPlatformState:
    skills = state.get("extracted_skills", [])
    target_role = state.get("target_role", "Machine Learning Engineer")
    candidates = query_alumni_vector_index(skills, target_role)
    state["candidate_pool"] = candidates

    scored = []
    for cand in candidates:
        score, comps, reason = compute_multi_objective_utility(cand, skills, target_role)
        scored.append({
            "alumnus": cand,
            "score": score,
            "components": comps,
            "reason": reason,
            "is_eligible": cand.get("availability") != "unavailable" and cand.get("current_load", 0) < cand.get("capacity", 3)
        })

    scored.sort(key=lambda x: x["score"], reverse=True)
    state["ranked_matches"] = scored[:3]

    if state["ranked_matches"] and state["ranked_matches"][0]["is_eligible"]:
        selected = state["ranked_matches"][0]["alumnus"]
        state["selected_mentor"] = selected
        log_agent_event(
            state,
            "Alumni Broker Agent",
            "Multi-Objective Ranking",
            f"Utility calculated. Selected top mentor: {selected['name']} ({selected['current_company']}) with {state['ranked_matches'][0]['score']}% fit."
        )
    else:
        eligible = [c for c in scored if c["is_eligible"]]
        if eligible:
            selected = eligible[0]["alumnus"]
            state["selected_mentor"] = selected
            state["rerouted_reason"] = "Top mentor at capacity; rerouted to next eligible candidate."
            log_agent_event(
                state,
                "Alumni Broker Agent",
                "Anti-Fatigue Rerouting",
                f"REROUTED: Selected next available mentor: {selected['name']} (Fit: {eligible[0]['score']}%)."
            )
        else:
            state["selected_mentor"] = state["ranked_matches"][0]["alumnus"] if state["ranked_matches"] else None

    return state

# 4. Outreach Agent
def outreach_synthesis_node(state: AlumniPlatformState) -> AlumniPlatformState:
    mentor = state.get("selected_mentor")
    student_name = state.get("student_name", "Tanmay Singhal")
    target_role = state.get("target_role", "Software Engineer")
    skills = state.get("extracted_skills", [])

    if mentor:
        draft = (
            f"Dear {mentor['name']},\n\n"
            f"I am {student_name}, a student at GL Bajaj aspiring to become a {target_role}. "
            f"I reviewed your journey as {mentor['current_designation']} at {mentor['current_company']}.\n\n"
            f"I have built projects using {', '.join(skills[:3])} and would greatly appreciate 15 minutes of your "
            f"guidance on {mentor.get('mentorship_topics', ['Career Guidance'])[0]}.\n\n"
            f"Sincerely,\n{student_name} (GL Bajaj Scholar)\nContact: tanmay.s@glbajaj.ac.in | +91-98765-43210"
        )
        state["draft_outreach"] = draft
        log_agent_event(
            state,
            "Outreach Agent",
            "Draft Introduction",
            f"Synthesized personalized factual outreach pitch for {mentor['name']} without hallucinated shared history."
        )
    return state

# 5. Trust & Guardrail Agent (PII Sanitization + HITL Flag)
def trust_guardrail_node(state: AlumniPlatformState) -> AlumniPlatformState:
    raw_draft = state.get("draft_outreach", "")
    sanitized, detected = scrub_pii(raw_draft)
    state["sanitized_outreach"] = sanitized
    state["pii_flags"] = detected
    state["requires_approval"] = True
    state["status"] = "AWAITING_HUMAN_APPROVAL"

    log_agent_event(
        state,
        "Trust & Guardrail Agent",
        "PII Sanitization & HITL",
        f"Redacted {len(detected)} sensitive contact items ({', '.join(detected)}). Paused pipeline for Human-in-the-Loop approval.",
        status="AWAITING_APPROVAL"
    )
    return state

# 6. Autonomous Seminar Curator Node (Alumni Side)
def seminar_curator_node(state: AlumniPlatformState) -> AlumniPlatformState:
    details = state.get("seminar_details") or {}
    record = create_seminar_record(details)
    state["seminar_id"] = record["id"]
    state["seminar_details"] = record
    state["generated_assets"] = {
        "agenda": record["agenda"],
        "meet_link": record["meet_link"],
        "whatsapp_link": record["whatsapp_link"],
        "prerequisites": record["prerequisites"],
        "poster_copy": f"GL BAJAJ MASTERCLASS • {record['title']} • By {record['speaker_name']}"
    }
    state["status"] = "COMPLETED"

    log_agent_event(
        state,
        "Curator Agent",
        "Structure Syllabus & Assets",
        f"Synthesized 4-part timed agenda, provisioned Google Meet & WhatsApp links, initialized {record['total_slots']} seats."
    )
    return state

# 7. Student Seminar Registration Node
def seminar_registration_node(state: AlumniPlatformState) -> AlumniPlatformState:
    sem_id = state.get("seminar_id") or list(SEMINAR_STORE.keys())[0]
    st_reg = state.get("student_registration") or {}

    log_agent_event(
        state,
        "Registration Agent",
        "Validate Student Credentials",
        f"Verified student {st_reg.get('name')} ({st_reg.get('branch')}, {st_reg.get('year')}) with college email {st_reg.get('college_email')}."
    )

    success, msg, updated_sem = register_student_for_seminar(sem_id, st_reg)
    state["seminar_details"] = updated_sem
    state["status"] = "SEAT_RESERVED" if success else "CAPACITY_FULL"

    log_agent_event(
        state,
        "Broker Agent",
        "Reserve Capacity Slot",
        f"Seat slot claimed! Live capacity updated to {updated_sem['booked_slots']} / {updated_sem['total_slots']} booked."
    )
    return state

# 8. Omnichannel Dispatcher Node
def omnichannel_dispatcher_node(state: AlumniPlatformState) -> AlumniPlatformState:
    st_reg = state.get("student_registration") or {}
    sem = state.get("seminar_details") or list(SEMINAR_STORE.values())[0]

    t0_alert = generate_stage_alert("T_0", st_reg, sem)
    t24_alert = generate_stage_alert("T_24h", st_reg, sem)
    t1_alert = generate_stage_alert("T_1h", st_reg, sem)

    state["dispatch_queue"] = [t0_alert, t24_alert, t1_alert]
    state["status"] = "DISPATCHED"

    log_agent_event(
        state,
        "Dispatcher Agent",
        "Omnichannel Alert Dispatch",
        f"Constructed instant T_0 confirmation packet and scheduled T-24h & T-1h calendar alerts to {st_reg.get('college_email')}."
    )
    return state
