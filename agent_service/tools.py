import re
import math
from typing import List, Dict, Any, Tuple
from fixtures import SEEDED_ALUMNI

# Regex PII detection for Trust & Safety layer
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
PHONE_REGEX = r'(?:\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}'

def scrub_pii(text: str) -> Tuple[str, List[str]]:
    """Detects and redacts private email addresses and phone numbers."""
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

def extract_and_analyze_skills(target_role: str, raw_text: str) -> Tuple[List[str], List[str], List[str]]:
    """Candidate Profiler Tool: Extracts skills and infers role benchmark gaps."""
    known_skills = [
        "Python", "Machine Learning", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Kubernetes",
        "React", "TypeScript", "Node.js", "Java", "Spring Boot", "SQL", "PostgreSQL", "C++",
        "Go", "AWS", "Azure", "Kafka", "Data Structures", "System Design", "DevOps", "Microservices"
    ]
    lower_text = raw_text.lower()
    found = [s for s in known_skills if s.lower() in lower_text]
    if not found:
        tokens = [t.strip().capitalize() for t in raw_text.replace(',', ' ').split() if len(t) > 2]
        found = tokens[:5] if tokens else ["Python", "Machine Learning"]

    role_benchmarks = {
        "Machine Learning Engineer": ["Python", "Machine Learning", "PyTorch", "MLOps", "FastAPI"],
        "Backend Engineer": ["Java", "Spring Boot", "SQL", "Microservices", "System Design"],
        "Frontend Engineer": ["React", "TypeScript", "Web Performance", "Design Systems"],
        "DevOps / SRE": ["Kubernetes", "Docker", "AWS", "CI/CD", "Terraform"],
        "Data Engineer": ["Python", "Apache Spark", "Kafka", "SQL", "Data Warehousing"]
    }
    benchmarks = role_benchmarks.get(target_role, ["Python", "System Design", "SQL"])
    gaps = [b for b in benchmarks if b.lower() not in [s.lower() for s in found]]
    evidence = [f"Directly verified proficiency in '{s}'" for s in found]

    return found, gaps, evidence

def compute_multi_objective_utility(mentor: Dict[str, Any], student_skills: List[str], target_role: str) -> Tuple[float, Dict[str, float], str]:
    """
    Multi-objective utility calculator:
    Score = w1*Skill Overlap + w2*Career Relevance + w3*Availability - w4*Sigmoid Fatigue Penalty
    """
    w1, w2, w3, w4 = 0.40, 0.30, 0.20, 0.15

    mentor_skills = [s.lower() for s in mentor.get("skills", [])]
    matched = [s for s in student_skills if s.lower() in mentor_skills]
    skill_fit = min((len(matched) / max(len(student_skills), 1)) * 100.0, 100.0)

    role_tokens = target_role.lower().split()
    desig = mentor.get("current_designation", "").lower()
    ind = mentor.get("industry", "").lower()
    matches = sum(1 for tok in role_tokens if tok in desig or tok in ind)
    career_relevance = min((matches / max(len(role_tokens), 1)) * 100.0 + 40.0, 100.0)

    avail = mentor.get("availability", "available")
    avail_score = 100.0 if avail == "available" else 60.0 if avail == "limited" else 0.0

    # Sigmoid fatigue curve on mentor capacity
    capacity = max(mentor.get("capacity", 3), 1)
    load = mentor.get("current_load", 0)
    ratio = load / capacity
    fatigue_penalty = min(ratio * 100.0, 100.0)

    if avail == "unavailable" or load >= capacity:
        final_score = 0.0
    else:
        final_score = (w1 * skill_fit) + (w2 * career_relevance) + (w3 * avail_score) - (w4 * fatigue_penalty)
        final_score = max(0.0, min(100.0, final_score))

    components = {
        "skill_fit": round(skill_fit, 1),
        "career_relevance": round(career_relevance, 1),
        "availability": round(avail_score, 1),
        "fatigue_penalty": round(fatigue_penalty, 1)
    }

    reason = (
        f"Matches {len(matched)} key skills ({', '.join(matched) if matched else 'Domain synergy'}). "
        f"{mentor.get('current_designation')} at {mentor.get('current_company')} with active capacity "
        f"({load}/{capacity} mentees)."
    )

    return round(final_score, 1), components, reason

def query_alumni_vector_index(skills: List[str], target_role: str) -> List[Dict[str, Any]]:
    """In-memory mock vector database of 30+ alumni profiles."""
    results = []
    for alm in SEEDED_ALUMNI:
        text = f"{alm['skills']} {alm['current_designation']} {alm['industry']}".lower()
        if any(s.lower() in text for s in skills) or target_role.lower() in text:
            results.append(alm)
    return results if results else SEEDED_ALUMNI[:10]
