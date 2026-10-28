# GL Bajaj Alumni Connect - AgentX 2026

Multi-agent career acceleration and alumni-led seminar orchestration platform.

## Architecture

1. **Frontend**: React 19 + Vite + Tailwind CSS + Lucide Icons
2. **Agent Service**: Python FastAPI + LangGraph stateful multi-step workflow engine
3. **Database & Auth**: Supabase PostgreSQL schema with RLS + 30 seeded realistic alumni demo fixtures

## How to Run

### 1. Start the Python Agent Service (Backend)
```bash
cd agent_service
python -m pip install -r requirements.txt
python main.py
```
*Service will start at `http://127.0.0.1:8000`.*
- Health check: `http://127.0.0.1:8000/api/health`
- Seeded alumni: `http://127.0.0.1:8000/api/alumni`

### 2. Start the Frontend Application
```bash
cd glbajaj-alumni-connect
npm install
npm run dev
```
*Application runs at `http://localhost:5173`.*

## Key Features Implemented (AGENTX 2026 Blueprint)
- **Candidate Profiler**: Extracts skills from manual input and CV attachments, mapping them against role benchmarks and identifying preparation gaps.
- **Explainable Ranking**: Transparent scoring formula `Score = 0.40 * Skill + 0.30 * Relevance + 0.20 * Availability - 0.15 * Workload`.
- **Capacity-Aware Rerouting**: Excludes unavailable mentors and penalizes high workload; reroutes to the next eligible mentor when a candidate is at capacity.
- **Trust & Guardrail Layer**: Regex/pattern PII detection masking private email addresses and phone numbers.
- **Human-in-the-Loop Approval Gate**: `DRAFT -> CHECKED -> AWAITING_HUMAN_APPROVAL -> APPROVED / REJECTED`.
- **Live AI Activity Console**: Real-time event streaming of workflow decisions and agent actions.
- **Autonomous Seminar Curator & Planner (P1)**: Automatic agenda generation, prerequisite filtering, and 3-stage reminder timeline (T0, T-24h, T-1h).
- **Offline / Deterministic Fallback**: Automatic local fallback if the Python service is offline.
