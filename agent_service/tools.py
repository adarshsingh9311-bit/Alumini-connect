import re
import uuid
import time
from typing import List, Dict, Any, Tuple
from fixtures import SEEDED_ALUMNI

# Regex PII detection for Trust & Safety layer
EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
PHONE_REGEX = r'(?:\+?91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}|\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}'

# In-memory thread-safe seminar store for live demonstration
SEMINAR_STORE: Dict[str, Dict[str, Any]] = {
    "sem-glb-101": {
        "id": "sem-glb-101",
        "title": "Masterclass: Deploying Scalable Agentic AI Systems",
        "topic": "Agentic AI & Production Microservices",
        "speaker_name": "Aarav Sharma (Google)",
        "speaker_role": "Senior Machine Learning Engineer @ Google Cloud",
        "speaker_batch": "Batch 2020 • CSE",
        "date": "Tomorrow, 05:00 PM",
        "time_slot": "05:00 PM - 06:30 PM",
        "duration": "90 Minutes",
        "total_slots": 50,
        "booked_slots": 18,
        "description": "Learn how enterprise autonomous agents are designed, deployed on distributed clouds, and secured with guardrails.",
        "target_audience": "3rd & 4th Year B.Tech (All Branches)",
        "agenda": [
            {"time": "00:00 - 00:20", "topic": "Why Multi-Agent Systems (MAS) replace single monolithic LLM prompts"},
            {"time": "00:20 - 00:50", "topic": "State orchestration with LangGraph & asynchronous task graphs"},
            {"time": "00:50 - 01:20", "topic": "Live Code Teardown: Real-time SSE streaming & Guardrails"},
            {"time": "01:20 - 01:30", "topic": "AMA & Placement Referral Advice for Google Cloud"}
        ],
        "prerequisites": [
            "Basic understanding of Python and APIs",
            "Laptop with modern browser and Terminal/IDE",
            "GL Bajaj Student ID or valid roll number"
        ],
        "meet_link": "https://meet.google.com/glb-agentx-2026",
        "whatsapp_link": "https://chat.whatsapp.com/GLB-AgentX-StudyGroup",
        "registered_attendees": [
            {"name": "Tanmay Singhal", "college_email": "tanmay.s@glbajaj.org", "branch": "CSE", "registered_at": "10:15 AM"}
        ]
    }
}

def scrub_pii(text: str) -> Tuple[str, List[str]]:
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

    capacity = max(mentor.get("capacity", 3), 1)
    load = mentor.get("current_load", 0)
    fatigue_penalty = min((load / capacity) * 100.0, 100.0)

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
    results = []
    for alm in SEEDED_ALUMNI:
        text = f"{alm['skills']} {alm['current_designation']} {alm['industry']}".lower()
        if any(s.lower() in text for s in skills) or target_role.lower() in text:
            results.append(alm)
    return results if results else SEEDED_ALUMNI[:10]

# --- Autonomous Seminar Helpers ---

def create_seminar_record(data: Dict[str, Any]) -> Dict[str, Any]:
    sem_id = "sem-glb-" + uuid.uuid4().hex[:6]
    random_code = uuid.uuid4().hex[:7]
    meet_link = f"https://meet.google.com/glb-{random_code}"
    whatsapp_link = f"https://chat.whatsapp.com/GLB-{uuid.uuid4().hex[:8]}"

    topic = data.get("topic", "Agentic Systems")
    record = {
        "id": sem_id,
        "title": data.get("title", f"Alumni Masterclass: {topic}"),
        "topic": topic,
        "speaker_name": data.get("speaker_name", "Priya Verma (Microsoft)"),
        "speaker_role": data.get("speaker_role", "SDE-II @ Microsoft"),
        "speaker_batch": data.get("speaker_batch", "Batch 2021 • IT"),
        "date": data.get("date", "This Saturday"),
        "time_slot": data.get("time_slot", "04:00 PM - 05:30 PM"),
        "duration": data.get("duration", "90 Minutes"),
        "total_slots": int(data.get("total_slots", 50)),
        "booked_slots": 0,
        "description": data.get("description", "Practical interactive workshop led by GL Bajaj alumni."),
        "target_audience": data.get("target_audience", "All B.Tech Scholars"),
        "agenda": [
            {"time": "00:00 - 00:20", "topic": f"Industry Context & Enterprise Motivation for {topic}"},
            {"time": "00:20 - 00:50", "topic": "Architecture Teardown & Engineering Constraints"},
            {"time": "00:50 - 01:20", "topic": "Hands-on Code Walkthrough & Production Patterns"},
            {"time": "01:20 - 01:30", "topic": "Campus Q&A & Off-campus Referral Tips"}
        ],
        "prerequisites": [
            "Familiarity with Modern Software Tools & IDE",
            "GL Bajaj College Email Verification"
        ],
        "meet_link": meet_link,
        "whatsapp_link": whatsapp_link,
        "registered_attendees": []
    }
    SEMINAR_STORE[sem_id] = record
    return record

def register_student_for_seminar(seminar_id: str, student_data: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
    if seminar_id not in SEMINAR_STORE:
        seminar_id = list(SEMINAR_STORE.keys())[0]

    sem = SEMINAR_STORE[seminar_id]
    if sem["booked_slots"] >= sem["total_slots"]:
        return False, "This masterclass has reached maximum capacity.", sem

    sem["booked_slots"] += 1
    attendee = {
        "name": student_data.get("name", "Student Scholar"),
        "age": student_data.get("age", 21),
        "year": student_data.get("year", "3rd Year"),
        "branch": student_data.get("branch", "CSE"),
        "mobile": student_data.get("mobile", "+91-98765-43210"),
        "college_email": student_data.get("college_email", "scholar@glbajaj.org"),
        "registered_at": time.strftime("%H:%M:%S")
    }
    sem["registered_attendees"].append(attendee)
    return True, "Seat slot successfully reserved!", sem

def generate_stage_alert(stage: str, student: Dict[str, Any], seminar: Dict[str, Any]) -> Dict[str, Any]:
    st_name = student.get("name", "Scholar")
    sem_title = seminar.get("title", "Alumni Masterclass")
    meet_link = seminar.get("meet_link", "https://meet.google.com/glb-agentx")
    wa_link = seminar.get("whatsapp_link", "https://chat.whatsapp.com/GLB-Masterclass")
    speaker = seminar.get("speaker_name", "Aarav Sharma")
    time_slot = seminar.get("time_slot", "05:00 PM")

    if stage == "T_0":
        subject = f"🎟️ Ticket Confirmed: {sem_title} with {speaker}"
        email_body = f"""Dear {st_name},

Congratulations! Your seat slot has been officially reserved for {sem_title}.

🗓️ Date & Time: {seminar.get('date')} ({time_slot})
🎙️ Speaker: {speaker}
🔗 Google Meet Link: {meet_link}
💬 WhatsApp Cohort: {wa_link}

Calendar Invite (.ics) has been attached to your college calendar.
Please review the session prerequisites before the workshop.

Best regards,
GL Bajaj Alumni Relations & Career Network"""

        wa_text = f"👋 Hello {st_name}! Your ticket for *{sem_title}* is confirmed. Join the WhatsApp attendee group for live Q&A: {wa_link} | Meet Link: {meet_link}"

    elif stage in ("T_minus_24h", "T_24h"):
        subject = f"📚 T-24h Preparation Reading: {sem_title}"
        email_body = f"""Dear {st_name},

Our masterclass with {speaker} starts in 24 hours!

Here is your preparation checklist:
1. Ensure Git, Python, and your code editor are updated.
2. Review the session agenda: {', '.join([a['topic'] for a in seminar.get('agenda', [])[:2]])}.
3. Test your camera and microphone ahead of the interactive breakout.

Google Meet Entry: {meet_link}

See you tomorrow!"""
        wa_text = f"⏰ *T-24h Reminder:* {sem_title} starts tomorrow at {time_slot}. Check your college email for prerequisite reading. Meet: {meet_link}"

    else:  # T-1h
        subject = f"🚨 T-1h Alert: Room Opening for {sem_title}"
        email_body = f"""Dear {st_name},

The Google Meet room for {sem_title} is opening in 60 minutes!

Click here to join directly: {meet_link}

Please keep your student ID ready and join 5 minutes early to secure your active audio slot."""
        wa_text = f"🚨 *T-1h Notice:* Room is opening soon for {sem_title}! Click to enter Google Meet: {meet_link}"

    return {
        "stage": stage,
        "recipient_email": student.get("college_email", "student@glbajaj.org"),
        "subject": subject,
        "email_html": email_body,
        "whatsapp_text": wa_text,
        "timestamp": time.strftime("%H:%M:%S")
    }
