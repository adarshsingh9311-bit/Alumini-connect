from langgraph.graph import StateGraph, END
from state import AlumniPlatformState
from agents import (
    supervisor_router_node,
    candidate_profiling_node,
    alumni_broker_node,
    outreach_synthesis_node,
    trust_guardrail_node,
    seminar_curator_node
)

def route_next_agent(state: AlumniPlatformState) -> str:
    """Conditional router based on workflow type."""
    wf_type = state.get("workflow_type", "mentor_match")
    if wf_type == "seminar_curation":
        return "seminar_curator"
    return "candidate_profiler"

def build_alumni_agent_graph():
    """Compiles the LangGraph StateGraph connecting specialized agent nodes."""
    workflow = StateGraph(AlumniPlatformState)

    # Register Agent Nodes
    workflow.add_node("supervisor", supervisor_router_node)
    workflow.add_node("candidate_profiler", candidate_profiling_node)
    workflow.add_node("alumni_broker", alumni_broker_node)
    workflow.add_node("outreach_agent", outreach_synthesis_node)
    workflow.add_node("guardrail_agent", trust_guardrail_node)
    workflow.add_node("seminar_curator", seminar_curator_node)

    # Set Entry Point
    workflow.set_entry_point("supervisor")

    # Conditional Routing from Supervisor
    workflow.add_conditional_edges(
        "supervisor",
        route_next_agent,
        {
            "candidate_profiler": "candidate_profiler",
            "seminar_curator": "seminar_curator"
        }
    )

    # Linear Pipeline for Mentor Matching
    workflow.add_edge("candidate_profiler", "alumni_broker")
    workflow.add_edge("alumni_broker", "outreach_agent")
    workflow.add_edge("outreach_agent", "guardrail_agent")
    workflow.add_edge("guardrail_agent", END)
    workflow.add_edge("seminar_curator", END)

    return workflow.compile()

compiled_graph = build_alumni_agent_graph()
