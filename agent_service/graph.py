from langgraph.graph import StateGraph, END
from state import AlumniPlatformState
from agents import (
    supervisor_router_node,
    candidate_profiling_node,
    alumni_broker_node,
    outreach_synthesis_node,
    trust_guardrail_node,
    seminar_curator_node,
    seminar_registration_node,
    omnichannel_dispatcher_node
)

def route_next_agent(state: AlumniPlatformState) -> str:
    """Conditional router based on workflow type."""
    wf_type = state.get("workflow_type", "mentor_match")
    if wf_type in ("seminar_create", "seminar_curation"):
        return "seminar_curator"
    if wf_type == "seminar_register":
        return "seminar_registration"
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
    workflow.add_node("seminar_registration", seminar_registration_node)
    workflow.add_node("omnichannel_dispatcher", omnichannel_dispatcher_node)

    # Set Entry Point
    workflow.set_entry_point("supervisor")

    # Conditional Routing from Supervisor
    workflow.add_conditional_edges(
        "supervisor",
        route_next_agent,
        {
            "candidate_profiler": "candidate_profiler",
            "seminar_curator": "seminar_curator",
            "seminar_registration": "seminar_registration"
        }
    )

    # Linear Pipeline for Mentor Matching
    workflow.add_edge("candidate_profiler", "alumni_broker")
    workflow.add_edge("alumni_broker", "outreach_agent")
    workflow.add_edge("outreach_agent", "guardrail_agent")
    workflow.add_edge("guardrail_agent", END)
    
    # Linear Pipeline for Seminar Creation
    workflow.add_edge("seminar_curator", END)

    # Linear Pipeline for Seminar Registration & Multi-stage Dispatch
    workflow.add_edge("seminar_registration", "omnichannel_dispatcher")
    workflow.add_edge("omnichannel_dispatcher", END)

    return workflow.compile()

compiled_graph = build_alumni_agent_graph()
