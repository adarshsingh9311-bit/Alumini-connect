from typing import TypedDict, List, Dict, Any, Optional

class AlumniPlatformState(TypedDict):
    workflow_id: str
    workflow_type: str  # 'mentor_match' or 'seminar_curation'
    student_id: str
    student_name: str
    target_role: str
    goals: List[str]
    raw_input_skills: str
    resume_text: Optional[str]
    
    # Candidate Profiler
    extracted_skills: List[str]
    inferred_gaps: List[str]
    profiler_evidence: List[str]
    
    # Retrieval & Broker
    candidate_pool: List[Dict[str, Any]]
    ranked_matches: List[Dict[str, Any]]
    selected_mentor: Optional[Dict[str, Any]]
    rerouted_reason: Optional[str]
    
    # Outreach & Safety
    draft_outreach: Optional[str]
    sanitized_outreach: Optional[str]
    pii_flags: List[str]
    requires_approval: bool
    
    # Seminar Curator (Workflow 2)
    seminar_topic: Optional[str]
    seminar_plan: Optional[Dict[str, Any]]
    
    # Execution & Trace
    status: str  # 'RUNNING', 'AWAITING_HUMAN_APPROVAL', 'APPROVED', 'REJECTED', 'SIMULATED', 'COMPLETED', 'FAILED'
    events: List[Dict[str, Any]]
    created_at: float
    updated_at: float
