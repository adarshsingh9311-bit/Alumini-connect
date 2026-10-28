from typing import TypedDict, List, Dict, Any, Optional

class AlumniPlatformState(TypedDict):
    workflow_id: str
    workflow_type: str  # 'mentor_match', 'seminar_create', 'seminar_register'
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
    
    # Seminar Lifecycle (Alumni Creation & Student Registration)
    seminar_id: Optional[str]
    seminar_details: Optional[Dict[str, Any]]
    generated_assets: Optional[Dict[str, Any]]
    student_registration: Optional[Dict[str, Any]]  # name, age, year, branch, mobile, college_email
    registered_attendees: List[Dict[str, Any]]
    dispatch_queue: List[Dict[str, Any]]  # T_0, T_minus_24h, T_minus_1h payloads
    
    # Execution & Trace
    status: str
    current_status: str
    events: List[Dict[str, Any]]
    created_at: float
    updated_at: float
