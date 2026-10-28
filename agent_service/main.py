"""
FastAPI Microservice for Alumni Connect Multi-Agent System (AGENTX 2026).
Runs on port 8000 with CORS and Server-Sent Events (SSE) support.
"""

import asyncio
import json
import time
import uuid
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from state import AlumniPlatformState
from graph import compiled_graph
from fixtures import SEEDED_ALUMNI

app = FastAPI(title="GL Bajaj Alumni Connect Multi-Agent Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory execution store for active workflows
WORKFLOW_RUNS: Dict[str, AlumniPlatformState] = {}

class WorkflowRequest(BaseModel):
    workflow_type: Optional[str] = "mentor_match"  # 'mentor_match' or 'seminar_curation'
    target_role: Optional[str] = "Machine Learning Engineer"
    skills: Optional[str] = "Python, PyTorch, Machine Learning, SQL"
    goals: Optional[List[str]] = None
    resume_text: Optional[str] = None
    student_name: Optional[str] = "Tanmay Singhal"
    student_id: Optional[str] = "stu-glb-01"
    seminar_topic: Optional[str] = "Agentic AI in Enterprise Production"

class ApprovalRequest(BaseModel):
    decision: str  # 'APPROVE', 'REJECT', 'SIMULATE_SEND'
    edited_message: Optional[str] = None

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "alumni_connect_agent_service",
        "engine": "LangGraph StateGraph",
        "seeded_alumni_count": len(SEEDED_ALUMNI),
        "active_workflows": len(WORKFLOW_RUNS)
    }

@app.get("/api/alumni")
def get_alumni():
    return {"alumni": SEEDED_ALUMNI}

@app.post("/api/run-workflow")
def run_workflow(req: WorkflowRequest):
    """Executes the LangGraph multi-agent graph synchronously and stores state."""
    wf_id = "wf-" + uuid.uuid4().hex[:8]

    initial_state: AlumniPlatformState = {
        "workflow_id": wf_id,
        "workflow_type": req.workflow_type or "mentor_match",
        "student_id": req.student_id or "stu-glb-01",
        "student_name": req.student_name or "Tanmay Singhal",
        "target_role": req.target_role or "Machine Learning Engineer",
        "goals": req.goals or ["Off-campus referral", "Resume review", "Mock interview"],
        "raw_input_skills": req.skills or "Python, Machine Learning",
        "resume_text": req.resume_text or "",
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
        "requires_approval": False,
        "seminar_topic": req.seminar_topic or "Agentic AI",
        "seminar_plan": None,
        "status": "RUNNING",
        "events": [],
        "created_at": time.time(),
        "updated_at": time.time()
    }

    # Execute LangGraph
    final_state = compiled_graph.invoke(initial_state)
    WORKFLOW_RUNS[wf_id] = final_state
    return final_state

# Maintain backward compatibility with blueprint route
@app.post("/api/workflows/mentor-match")
def mentor_match_alias(req: WorkflowRequest):
    req.workflow_type = "mentor_match"
    return run_workflow(req)

class SeminarPlanRequest(BaseModel):
    topic: str
    duration: Optional[str] = "90 minutes"
    target_batch: Optional[str] = "3rd & 4th Year B.Tech"
    capacity: Optional[int] = 100

@app.post("/api/workflows/seminar-plan")
def create_seminar_plan(req: SeminarPlanRequest):
    wf_req = WorkflowRequest(
        workflow_type="seminar_curation",
        seminar_topic=req.topic
    )
    final_state = run_workflow(wf_req)
    plan = final_state.get("seminar_plan") or {}
    return {
        "workflow_id": final_state.get("workflow_id"),
        "topic": req.topic,
        "duration": req.duration or "90 minutes",
        "target_batch": req.target_batch or "3rd & 4th Year B.Tech",
        "capacity": req.capacity or 100,
        "agenda": [
            {"time": item.get("time", ""), "item": item.get("topic", "")}
            for item in plan.get("syllabus", [])
        ],
        "prerequisites": plan.get("prerequisites", []),
        "learning_outcomes": [
            f"Deep architectural mastery of {req.topic}",
            "Enterprise code quality and engineering best practices",
            "Live networking with GL Bajaj alumni"
        ],
        "reminders": plan.get("reminders", []),
        "calendar_ics_status": "Ready for export (.ics simulated)",
        "status": "APPROVED / READY"
    }

@app.get("/api/workflows/{workflow_id}")
def get_workflow(workflow_id: str):
    if workflow_id not in WORKFLOW_RUNS:
        raise HTTPException(status_code=404, detail="Workflow run not found")
    return WORKFLOW_RUNS[workflow_id]

@app.get("/api/workflows/{workflow_id}/events")
async def stream_workflow_events(workflow_id: str):
    """Server-Sent Events (SSE) endpoint streaming real-time agent execution events."""
    if workflow_id not in WORKFLOW_RUNS:
        raise HTTPException(status_code=404, detail="Workflow not found")

    async def sse_generator():
        last_idx = 0
        while True:
            state = WORKFLOW_RUNS.get(workflow_id)
            if not state:
                break
            events = state.get("events", [])
            while last_idx < len(events):
                event = events[last_idx]
                last_idx += 1
                yield f"data: {json.dumps(event)}\n\n"

            if state.get("status") in ("AWAITING_HUMAN_APPROVAL", "COMPLETED", "REJECTED", "SIMULATED"):
                if last_idx >= len(events):
                    yield f"data: {json.dumps({'status': state['status'], 'complete': True})}\n\n"
                    break
            await asyncio.sleep(0.4)

    return StreamingResponse(sse_generator(), media_type="text/event-stream")

@app.post("/api/workflows/{workflow_id}/approval")
def handle_approval(workflow_id: str, req: ApprovalRequest):
    if workflow_id not in WORKFLOW_RUNS:
        raise HTTPException(status_code=404, detail="Workflow not found")

    state = WORKFLOW_RUNS[workflow_id]
    if req.decision == "REJECT":
        state["status"] = "REJECTED"
        state["events"].append({
            "timestamp": time.time(),
            "time_str": time.strftime("%H:%M:%S"),
            "agent": "Supervisor / Safety Gate",
            "step": "Outreach Rejected",
            "result_summary": "Human rejected draft. Pipeline halted. Message not sent.",
            "status": "REJECTED"
        })
    else:
        state["status"] = "SIMULATED"
        if req.edited_message:
            state["sanitized_outreach"] = req.edited_message
        state["events"].append({
            "timestamp": time.time(),
            "time_str": time.strftime("%H:%M:%S"),
            "agent": "Outreach Dispatcher",
            "step": "Dispatched to Mentor",
            "result_summary": f"Approved by user. Simulated dispatch to {state.get('selected_mentor', {}).get('name', 'Mentor')}.",
            "status": "COMPLETED"
        })
    return state

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
