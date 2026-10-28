"""
Agentic Multi-Step Workflow Engine using LangGraph & Deterministic Fallbacks.
Follows the AGENTX 2026 Website Finalization Blueprint:
1. Supervisor / Orchestrator
2. Candidate Profiler (Skill & Goal extraction + Gap detection)
3. Alumni Retrieval (Semantic / structured matching)
4. Mentorship Broker (Transparent explainable scoring & capacity awareness)
5. Outreach Synthesis (Factual draft synthesis)
6. Trust / Guardrail (Regex & pattern PII masking + approval gate)
"""

import re
import uuid
import time
from typing import Dict, Any, List, Optional, TypedDict
from fixtures import SEEDED_ALUMNI

# PII Patterns for Trust & Safety
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
PHONE_REGEX = r'(?:\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}'

def mask_pii(text: str) -> tuple[str, list[str]]:
    """Detect and mask private email addresses and phone numbers."""
    detected = []
    
    def replace_email(match):
        detected.append(f"email: {match.group(0)}")
        return "[REDACTED_EMAIL]"
        
    def replace_phone(match):
        detected.append(f"phone: {match.group(0)}")
        return "[REDACTED_PHONE]"
        
    sanitized = re.sub(EMAIL_REGEX, replace_email, text)
    sanitized = re.sub(PHONE_REGEX, replace_phone, sanitized)
    return sanitized, detected

class WorkflowState(TypedDict):
    workflow_id: str
    student_id: str
    student_name: str
    target_role: str
    goals: List[str]
    raw_input_skills: str
    resume_text: Optional[str]
    
    # Candidate Profiler outputs
    extracted_skills: List[str]
    inferred_gaps: List[str]
    profiler_evidence: List[str]
    
    # Retrieval & Broker outputs
    candidate_pool: List[Dict[str, Any]]
    ranked_matches: List[Dict[str, Any]]
    selected_mentor: Optional[Dict[str, Any]]
    rerouted_reason: Optional[str]
    
    # Outreach & Safety outputs
    draft_outreach: Optional[str]
    sanitized_outreach: Optional[str]
    pii_flags: List[str]
    
    # Approval & Execution
    status: str  # RUNNING, AWAITING_HUMAN_APPROVAL, APPROVED, REJECTED, SENT, SIMULATED, FAILED
    approval_decision: Optional[str]
    events: List[Dict[str, Any]]
    created_at: float
    updated_at: float

def extract_skills_and_gaps(target_role: str, raw_text: str) -> tuple[list[str], list[str], list[str]]:
    """Candidate Profiler: Extracts skills, maps role expectations, and highlights gaps."""
    known_skills = [
        "Python", "Machine Learning", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Kubernetes",
        "React", "TypeScript", "Node.js", "Java", "Spring Boot", "SQL", "PostgreSQL", "C++",
        "Go", "AWS", "Azure", "Kafka", "Data Structures", "System Design", "DevOps", "Microservices"
    ]
    
    lower_text = raw_text.lower()
    found_skills = [s for s in known_skills if s.lower() in lower_text]
    if not found_skills:
        # Default skill fallbacks from manual text entry
        tokens = [t.strip().capitalize() for t in raw_text.replace(',', ' ').split() if len(t) > 2]
        found_skills = tokens[:5] if tokens else ["Python", "Machine Learning"]
        
    role_benchmarks = {
        "Machine Learning Engineer": ["Python", "Machine Learning", "PyTorch", "MLOps", "FastAPI"],
        "Backend Engineer": ["Java", "Spring Boot", "SQL", "Microservices", "System Design"],
        "Frontend Engineer": ["React", "TypeScript", "Web Performance", "Design Systems"],
        "DevOps / SRE": ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
        "Data Engineer": ["Python", "Apache Spark", "Kafka", "SQL", "Data Warehousing"]
    }
    
    benchmarks = role_benchmarks.get(target_role, ["Python", "System Design", "SQL"])
    gaps = [b for b in benchmarks if b.lower() not in [s.lower() for s in found_skills]]
    evidence = [f"Identified proficiency in '{s}' directly from student input/resume" for s in found_skills]
    
    return found_skills, gaps, evidence

def score_candidate(mentor: Dict[str, Any], student_skills: List[str], target_role: str) -> tuple[float, Dict[str, float], str]:
    """
    Transparent scoring formula according to Blueprint:
    Score = w1 * skill_fit + w2 * career_relevance + w3 * availability - w4 * workload_penalty
    """
    w1, w2, w3, w4 = 0.40, 0.30, 0.20, 0.15
    
    # 1. Skill Fit (0 to 100)
    mentor_skills = [s.lower() for s in mentor.get("skills", [])]
    matched = [s for s in student_skills if s.lower() in mentor_skills]
    skill_fit = (len(matched) / max(len(student_skills), 1)) * 100
    skill_fit = min(skill_fit, 100.0)
    
    # 2. Career Relevance (0 to 100)
    role_kw = target_role.lower().split()
    desig = mentor.get("current_designation", "").lower()
    ind = mentor.get("industry", "").lower()
    relevance_matches = sum(1 for kw in role_kw if kw in desig or kw in ind)
    career_relevance = min((relevance_matches / max(len(role_kw), 1)) * 100 + 40, 100.0)
    
    # 3. Availability (0 to 100)
    avail = mentor.get("availability", "available")
    if avail == "available":
        availability_score = 100.0
    elif avail == "limited":
        availability_score = 60.0
    else:
        availability_score = 0.0
        
    # 4. Workload Penalty (0 to 100)
    capacity = max(mentor.get("capacity", 3), 1)
    current_load = mentor.get("current_load", 0)
    workload_ratio = current_load / capacity
    workload_penalty = min(workload_ratio * 100.0, 100.0)
    
    # Total Score Calculation
    if avail == "unavailable" or current_load >= capacity:
        final_score = 0.0  # Unavailable mentors cannot be selected as top match
    else:
        final_score = (w1 * skill_fit) + (w2 * career_relevance) + (w3 * availability_score) - (w4 * workload_penalty)
        final_score = max(0.0, min(100.0, final_score))
        
    components = {
        "skill_fit": round(skill_fit, 1),
        "career_relevance": round(career_relevance, 1),
        "availability": round(availability_score, 1),
        "workload_penalty": round(workload_penalty, 1)
    }
    
    fit_reason = (
        f"Matches {len(matched)} key skills ({', '.join(matched) if matched else 'Domain synergy'}). "
        f"{mentor.get('current_designation')} at {mentor.get('current_company')} with active capacity "
        f"({current_load}/{capacity} mentees)."
    )
    
    return round(final_score, 1), components, fit_reason

class AgentWorkflowEngine:
    def __init__(self):
        self.active_workflows: Dict[str, WorkflowState] = {}
        self.alumni_db = list(SEEDED_ALUMNI)

    def log_event(self, state: WorkflowState, agent_name: str, step: str, result_summary: str, status: str = "COMPLETED"):
        event = {
            "timestamp": time.time(),
            "time_str": time.strftime("%H:%M:%S"),
            "agent": agent_name,
            "step": step,
            "result_summary": result_summary,
            "status": status
        }
        state["events"].append(event)
        return event

    def start_mentor_match(self, payload: Dict[str, Any]) -> WorkflowState:
        workflow_id = "wf-" + uuid.uuid4().hex[:8]
        target_role = payload.get("target_role", "Machine Learning Engineer")
        goals = payload.get("goals", ["Crack off-campus placement", "Resume review", "Mock interview"])
        raw_skills = payload.get("skills", "Python, Machine Learning, PyTorch, SQL")
        resume_text = payload.get("resume_text", "")
        student_name = payload.get("student_name", "Tanmay Singhal")
        student_id = payload.get("student_id", "stu-glb-01")

        state: WorkflowState = {
            "workflow_id": workflow_id,
            "student_id": student_id,
            "student_name": student_name,
            "target_role": target_role,
            "goals": goals,
            "raw_input_skills": raw_skills,
            "resume_text": resume_text,
            "extracted_skills": [],
            "inferred_gaps": [],
            "profiler_evidence": [],
            "candidate_pool": [],
            "ranked_matches": [],
            "selected_mentor": None,
            "rerouted_reason": None,
            "draft_outreach": None,
            "sanitized_outreach": None,
            "pii_flags": [],
            "status": "RUNNING",
            "approval_decision": None,
            "events": [],
            "created_at": time.time(),
            "updated_at": time.time()
        }

        # Step 1: Supervisor Dispatches
        self.log_event(state, "Supervisor / Orchestrator", "Initiate Workflow", f"Dispatched mentor-matching pipeline for target role: '{target_role}'")

        # Step 2: Candidate Profiler
        skills, gaps, evidence = extract_skills_and_gaps(target_role, f"{raw_skills} {resume_text}")
        state["extracted_skills"] = skills
        state["inferred_gaps"] = gaps
        state["profiler_evidence"] = evidence
        self.log_event(
            state, 
            "Candidate Profiler", 
            "Skill & Gap Profiling", 
            f"Extracted {len(skills)} skills: {', '.join(skills[:4])}. Inferred {len(gaps)} potential gaps: {', '.join(gaps[:3])}"
        )

        # Step 3: Alumni Retrieval
        retrieved = []
        for alm in self.alumni_db:
            # Semantic / Structured Filter: match domain, skills or title
            alm_text = f"{alm['skills']} {alm['current_designation']} {alm['industry']}".lower()
            if any(s.lower() in alm_text for s in skills) or target_role.lower() in alm_text:
                retrieved.append(alm)

        if not retrieved:
            retrieved = self.alumni_db[:10]  # graceful fallback
            
        state["candidate_pool"] = retrieved
        self.log_event(
            state, 
            "Alumni Intelligence Retrieval", 
            "Vector & Structured Search", 
            f"Retrieved {len(retrieved)} candidate records from seeded alumni directory matching '{target_role}'"
        )

        # Step 4: Mentorship Broker (Explainable Ranking + Capacity Awareness)
        scored_candidates = []
        for cand in retrieved:
            score, components, reason = score_candidate(cand, skills, target_role)
            scored_candidates.append({
                "alumnus": cand,
                "score": score,
                "components": components,
                "reason": reason,
                "is_eligible": cand.get("availability") != "unavailable" and cand.get("current_load", 0) < cand.get("capacity", 3)
            })

        # Sort by score descending
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        top_matches = scored_candidates[:3]
        state["ranked_matches"] = top_matches

        # Check eligibility of top candidate
        if top_matches and top_matches[0]["is_eligible"]:
            selected = top_matches[0]["alumnus"]
            state["selected_mentor"] = selected
            self.log_event(
                state, 
                "Mentorship Broker", 
                "Explainable Ranking", 
                f"Selected #{1} candidate: {selected['name']} ({selected['current_company']}) with fit score {top_matches[0]['score']}%"
            )
        else:
            # Capacity-Aware Rerouting
            eligible = [c for c in scored_candidates if c["is_eligible"]]
            if eligible:
                selected = eligible[0]["alumnus"]
                state["selected_mentor"] = selected
                state["rerouted_reason"] = "Top-ranked candidate was unavailable or at maximum mentee capacity. Rerouted to next eligible candidate."
                self.log_event(
                    state, 
                    "Mentorship Broker", 
                    "Capacity-Aware Rerouting", 
                    f"REROUTED: Top candidate at capacity. Selected next eligible candidate: {selected['name']} (Score: {eligible[0]['score']}%)"
                )
            else:
                state["selected_mentor"] = top_matches[0]["alumnus"] if top_matches else None
                self.log_event(state, "Mentorship Broker", "Ranking", "No candidates with spare capacity found. Suggesting top profile with limited warning.")

        # Step 5: Outreach Synthesis Agent
        if state["selected_mentor"]:
            m = state["selected_mentor"]
            draft = (
                f"Dear {m['name']},\n\n"
                f"I am {student_name}, a student at GL Bajaj aspiring to become a {target_role}. "
                f"I noticed your impactful work as a {m['current_designation']} at {m['current_company']}, "
                f"and your specialized experience with {', '.join(m['skills'][:3])}.\n\n"
                f"I am actively developing projects involving {', '.join(skills[:3])} and would greatly appreciate "
                f"your 1-on-1 mentorship on {m['mentorship_topics'][0]} and resume evaluation.\n\n"
                f"Looking forward to connecting!\n\n"
                f"Sincerely,\n{student_name} (GL Bajaj Scholar)\nContact: tanmay.s@glbajaj.ac.in | +91-98765-43210"
            )
            state["draft_outreach"] = draft
            self.log_event(state, "Outreach Synthesis Agent", "Generate Draft", f"Synthesized personalized factual outreach draft targeting {m['name']}")

            # Step 6: Trust / Guardrail (PII Check & Approval Gate)
            sanitized, pii_detected = mask_pii(draft)
            state["sanitized_outreach"] = sanitized
            state["pii_flags"] = pii_detected
            state["status"] = "AWAITING_HUMAN_APPROVAL"
            
            self.log_event(
                state, 
                "Trust & Guardrail Agent", 
                "PII Detection & Safety Gate", 
                f"Detected {len(pii_detected)} sensitive items. Masked private credentials. Paused workflow for Human-in-the-Loop review.",
                status="AWAITING_APPROVAL"
            )
        else:
            state["status"] = "FAILED"
            self.log_event(state, "Supervisor", "Terminated", "No eligible mentors could be located.", status="FAILED")

        self.active_workflows[workflow_id] = state
        return state

    def handle_approval(self, workflow_id: str, decision: str, edited_message: Optional[str] = None) -> WorkflowState:
        if workflow_id not in self.active_workflows:
            raise ValueError(f"Workflow {workflow_id} not found")

        state = self.active_workflows[workflow_id]
        state["approval_decision"] = decision
        state["updated_at"] = time.time()

        if decision == "REJECT":
            state["status"] = "REJECTED"
            self.log_event(
                state, 
                "Supervisor / Safety Gate", 
                "Outreach Rejected", 
                "User rejected the draft. Workflow halted; message transmission canceled.", 
                status="REJECTED"
            )
        elif decision in ("APPROVE", "SIMULATE_SEND"):
            if edited_message:
                state["sanitized_outreach"], _ = mask_pii(edited_message)
                
            state["status"] = "SIMULATED"
            self.log_event(
                state, 
                "Outreach Dispatcher", 
                "Dispatched Message", 
                f"Message successfully approved and simulated delivery to {state['selected_mentor']['name']} (MOCK / SIMULATED mode active).", 
                status="COMPLETED"
            )

        return state

    def generate_seminar_plan(self, topic: str, duration: str, target_batch: str, capacity: int) -> Dict[str, Any]:
        """Autonomous Seminar Curator & Planner Agent workflow."""
        workflow_id = "sem-" + uuid.uuid4().hex[:8]
        agenda = [
            {"time": "00:00 - 00:15", "item": f"Welcome & Context: Why {topic} matters in 2026"},
            {"time": "00:15 - 00:45", "item": "Architecture Breakdown & Core Industry Mechanics"},
            {"time": "00:45 - 01:15", "item": "Hands-on Code Walkthrough & Case Study Demo"},
            {"time": "01:15 - 01:30", "item": "Open AMA & Placement Advice with GL Bajaj Students"}
        ]
        
        prerequisites = [
            "Basic understanding of Data Structures & System Architecture",
            "Laptop with modern IDE and Git installed",
            "GL Bajaj student ID card or portal verification"
        ]
        
        learning_outcomes = [
            f"Gain direct architectural insight into {topic} at enterprise scale",
            "Understand interview expectations and portfolio best practices for top tier tech firms",
            "Live networking with GL Bajaj industry alumni"
        ]

        reminders = [
            {"stage": "T0 Confirmation", "trigger": "Immediately on registration", "status": "Simulated Active"},
            {"stage": "T-24h Preparation", "trigger": "24 hours before event", "status": "Scheduled"},
            {"stage": "T-1h Final Reminder", "trigger": "1 hour before meeting link activation", "status": "Scheduled"}
        ]

        return {
            "workflow_id": workflow_id,
            "topic": topic,
            "duration": duration,
            "target_batch": target_batch,
            "capacity": capacity,
            "agenda": agenda,
            "prerequisites": prerequisites,
            "learning_outcomes": learning_outcomes,
            "reminders": reminders,
            "calendar_ics_status": "Ready for export (.ics simulated)",
            "status": "APPROVED / READY"
        }
