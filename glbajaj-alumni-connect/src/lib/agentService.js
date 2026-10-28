/**
 * Client service connecting the React Frontend to the Python FastAPI Agent Microservice
 * with seamless deterministic client-side fallbacks if the Python backend is offline.
 */

const API_BASE_URL = import.meta.env.VITE_AGENT_API_URL || "http://127.0.0.1:8000/api";

export async function checkAgentHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error("Service unhealthy");
    return await res.json();
  } catch (err) {
    return {
      status: "offline_fallback",
      service: "client_deterministic_engine",
      mode: "LOCAL FALLBACK"
    };
  }
}

export async function runMentorMatchWorkflow(params) {
  try {
    const res = await fetch(`${API_BASE_URL}/workflows/mentor-match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to dispatch workflow to agent service");
    return await res.json();
  } catch (err) {
    console.warn("Backend agent service unreachable, invoking deterministic local fallback:", err);
    return runLocalFallbackMatch(params);
  }
}

export async function submitWorkflowApproval(workflowId, decision, editedMessage) {
  try {
    const res = await fetch(`${API_BASE_URL}/workflows/${workflowId}/approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, edited_message: editedMessage })
    });
    if (!res.ok) throw new Error("Approval submission failed");
    return await res.json();
  } catch (err) {
    return {
      workflow_id: workflowId,
      status: decision === "REJECT" ? "REJECTED" : "SIMULATED",
      approval_decision: decision,
      sanitized_outreach: editedMessage || "Approved message.",
      events: [
        {
          timestamp: Date.now() / 1000,
          time_str: new Date().toLocaleTimeString(),
          agent: "Safety Gate",
          step: "Fallback Decision Recorded",
          result_summary: `Recorded decision: ${decision} (Local simulated fallback)`,
          status: decision === "REJECT" ? "REJECTED" : "COMPLETED"
        }
      ]
    };
  }
}

export async function createSeminarPlan(params) {
  try {
    const res = await fetch(`${API_BASE_URL}/workflows/seminar-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error("Failed to generate seminar plan");
    return await res.json();
  } catch (err) {
    return generateLocalSeminarPlan(params.topic);
  }
}

// Local Deterministic Fallback if Python backend is temporarily not running
import seededAlumni from "./seededAlumni.json";

function runLocalFallbackMatch(params) {
  const { target_role = "Machine Learning Engineer", skills = "Python, PyTorch", student_name = "Tanmay Singhal" } = params;
  const userSkills = skills.split(",").map((s) => s.trim().toLowerCase());
  
  // Deterministic scoring
  const ranked = seededAlumni.map((alm) => {
    const matched = alm.skills.filter((s) => userSkills.includes(s.toLowerCase()));
    const skillScore = Math.min((matched.length / Math.max(userSkills.length, 1)) * 100, 100);
    const availScore = alm.availability === "available" ? 100 : alm.availability === "limited" ? 60 : 0;
    const loadScore = Math.min((alm.current_load / alm.capacity) * 100, 100);
    const score = alm.availability === "unavailable" ? 0 : Math.round(0.4 * skillScore + 0.3 * 85 + 0.2 * availScore - 0.15 * loadScore);
    
    return {
      alumnus: alm,
      score,
      components: {
        skill_fit: Math.round(skillScore),
        career_relevance: 85,
        availability: availScore,
        workload_penalty: Math.round(loadScore)
      },
      reason: `Matches ${matched.length} key skills. ${alm.current_designation} at ${alm.current_company} with active capacity (${alm.current_load}/${alm.capacity} mentees).`,
      is_eligible: alm.availability !== "unavailable" && alm.current_load < alm.capacity
    };
  }).sort((a, b) => b.score - a.score);

  const topMatches = ranked.slice(0, 3);
  const selected = topMatches[0].is_eligible ? topMatches[0].alumnus : ranked.find((c) => c.is_eligible)?.alumnus || topMatches[0].alumnus;

  const rawDraft = `Dear ${selected.name},\n\nI am ${student_name}, a student at GL Bajaj aspiring to become a ${target_role}. I noticed your work as ${selected.current_designation} at ${selected.current_company}.\n\nI am working on ${skills} and would value your guidance on ${selected.mentorship_topics[0]}.\n\nSincerely,\n${student_name}\nContact: tanmay.s@glbajaj.ac.in | +91-98765-43210`;
  const sanitized = rawDraft.replace(/tanmay\.s@glbajaj\.ac\.in/g, "[REDACTED_EMAIL]").replace(/\+91-98765-43210/g, "[REDACTED_PHONE]");

  return {
    workflow_id: "wf-local-" + Date.now().toString(36),
    student_name,
    target_role,
    extracted_skills: skills.split(",").map((s) => s.trim()),
    inferred_gaps: ["MLOps", "Model Deployment", "FastAPI"],
    profiler_evidence: [`Identified proficiency from student profile in ${skills}`],
    ranked_matches: topMatches,
    selected_mentor: selected,
    draft_outreach: rawDraft,
    sanitized_outreach: sanitized,
    pii_flags: ["email: tanmay.s@glbajaj.ac.in", "phone: +91-98765-43210"],
    status: "AWAITING_HUMAN_APPROVAL",
    events: [
      { timestamp: Date.now() / 1000, time_str: new Date().toLocaleTimeString(), agent: "Supervisor", step: "Local Fallback Pipeline", result_summary: `Engine dispatched target role: ${target_role}`, status: "COMPLETED" },
      { timestamp: Date.now() / 1000, time_str: new Date().toLocaleTimeString(), agent: "Candidate Profiler", step: "Extracted Skills", result_summary: `Found: ${skills}`, status: "COMPLETED" },
      { timestamp: Date.now() / 1000, time_str: new Date().toLocaleTimeString(), agent: "Mentorship Broker", step: "Explainable Scoring", result_summary: `Ranked top match: ${selected.name} (${topMatches[0].score}%)`, status: "COMPLETED" },
      { timestamp: Date.now() / 1000, time_str: new Date().toLocaleTimeString(), agent: "Trust & Safety", step: "PII Masking & Approval Gate", result_summary: "Masked private email & phone. Paused for user approval.", status: "AWAITING_APPROVAL" }
    ]
  };
}

function generateLocalSeminarPlan(topic = "Agentic AI Architecture") {
  return {
    workflow_id: "sem-local-" + Date.now().toString(36),
    topic,
    duration: "90 minutes",
    target_batch: "3rd & 4th Year B.Tech",
    capacity: 100,
    agenda: [
      { time: "00:00 - 00:15", item: `Welcome & Keynote: Evolution of ${topic}` },
      { time: "00:15 - 00:45", item: "Core Engineering Principles & Distributed Production Scale" },
      { time: "00:45 - 01:15", item: "Hands-on Code Walkthrough & Architecture Teardown" },
      { time: "01:15 - 01:30", item: "Live Q&A, Career Mentorship & Closing" }
    ],
    prerequisites: [
      "Familiarity with Modern Software Architecture & APIs",
      "Laptop with Terminal / IDE installed"
    ],
    learning_outcomes: [
      `Deep architectural mastery of ${topic}`,
      "Understanding enterprise hiring bars and off-campus preparation strategies"
    ],
    reminders: [
      { stage: "T0 Confirmation", trigger: "Immediately upon registration", status: "Simulated Active" },
      { stage: "T-24h Reminder", trigger: "24h prior to seminar", status: "Scheduled" },
      { stage: "T-1h Final Alert", trigger: "1h before session start", status: "Scheduled" }
    ],
    calendar_ics_status: "Ready for export (.ics simulated)",
    status: "APPROVED / READY"
  };
}
