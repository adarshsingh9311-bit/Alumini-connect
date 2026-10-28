"""
FastAPI Server providing the Agentic Endpoints defined in the AGENTX 2026 Blueprint:
- POST /api/workflows/mentor-match
- GET  /api/workflows/{id}
- GET  /api/workflows/{id}/events (Server-Sent Events)
- POST /api/workflows/{id}/approval
- POST /api/workflows/seminar-plan
- GET  /api/health
- GET  /api/alumni (seeded profiles)
"""

import asyncio
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from workflow_engine import AgentWorkflowEngine
from fixtures import SEEDED_ALUMNI

app = FastAPI(title="Alumni Connect Agent Service", version="1.0.0")

# Enable CORS for React frontend (Vite runs on localhost:5173 / localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = AgentWorkflowEngine()

class MentorMatchRequest(BaseModel):
    target_role: str
    skills: str
    goals: Optional[List[str]] = None
    resume_text: Optional[str] = None
    student_name: Optional[str] = "Tanmay Singhal"
    student_id: Optional[str] = "stu-glb-01"

class ApprovalRequest(BaseModel):
    decision: str  # APPROVE, REJECT, SIMULATE_SEND
    edited_message: Optional[str] = None

class SeminarPlanRequest(BaseModel):
    topic: str
    duration: Optional[str] = "90 minutes"
    target_batch: Optional[str] = "3rd & 4th Year B.Tech"
    capacity: Optional[int] = 100

class ToggleAlumniAvailabilityRequest(BaseModel):
    alumni_id: str
    availability: str  # available, limited, unavailable
    current_load: Optional[int] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "agent_service",
        "active_workflows_count": len(engine.active_workflows),
        "seeded_alumni_count": len(engine.alumni_db),
        "mode": "MOCK / SIMULATED"
    }

@app.get("/api/alumni")
def get_alumni():
    return {"alumni": engine.alumni_db}

@app.post("/api/alumni/update-status")
def update_alumni_status(req: ToggleAlumniAvailabilityRequest):
    """Admin / Demo test endpoint to toggle capacity or mark top candidate unavailable to test rerouting."""
    for alm in engine.alumni_db:
        if alm["id"] == req.alumni_id:
            alm["availability"] = req.availability
            if req.current_load is not None:
                alm["current_load"] = req.current_load
            return {"success": True, "alumnus": alm}
    raise HTTPException(status_code=404, detail="Alumnus not found")

@app.post("/api/workflows/mentor-match")
def start_mentor_match(req: MentorMatchRequest):
    state = engine.start_mentor_match(req.dict())
    return state

@app.get("/api/workflows/{workflow_id}")
def get_workflow_state(workflow_id: str):
    if workflow_id not in engine.active_workflows:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return engine.active_workflows[workflow_id]

@app.get("/api/workflows/{workflow_id}/events")
async def stream_workflow_events(workflow_id: str):
    """Server-Sent Events (SSE) streaming real workflow step progress."""
    if workflow_id not in engine.active_workflows:
        raise HTTPException(status_code=404, detail="Workflow not found")

    async def event_generator():
        last_index = 0
        while True:
            state = engine.active_workflows.get(workflow_id)
            if not state:
                break
                
            events = state.get("events", [])
            while last_index < len(events):
                event_data = events[last_index]
                last_index += 1
                yield f"data: {json.dumps(event_data)}\n\n"
                
            # If reached terminal or waiting status and sent all events, stop stream
            if state["status"] in ("AWAITING_HUMAN_APPROVAL", "COMPLETED", "REJECTED", "SIMULATED", "FAILED"):
                if last_index >= len(events):
                    yield f"data: {json.dumps({'status': state['status'], 'complete': True})}\n\n"
                    break
                    
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/api/workflows/{workflow_id}/approval")
def submit_approval(workflow_id: str, req: ApprovalRequest):
    try:
        updated = engine.handle_approval(workflow_id, req.decision, req.edited_message)
        return updated
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/workflows/seminar-plan")
def create_seminar_plan(req: SeminarPlanRequest):
    plan = engine.generate_seminar_plan(
        topic=req.topic,
        duration=req.duration or "90 minutes",
        target_batch=req.target_batch or "3rd & 4th Year B.Tech",
        capacity=req.capacity or 100
    )
    return plan

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
