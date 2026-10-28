import seededData from "./seededAlumni.json";

/**
 * Seeded 30 realistic GL Bajaj alumni profiles for demo & fallback testing.
 * Satisfies the AGENTX 2026 P0 requirement.
 */
export const INITIAL_ALUMNI = seededData.map((a) => ({
  id: a.id,
  user_id: `usr-${a.id}`,
  full_name: a.name,
  name: a.name,
  email: a.email,
  phone: a.phone,
  batch: a.batch,
  batch_year: a.batch,
  branch: a.branch,
  current_company: a.current_company,
  company: a.current_company,
  current_designation: a.current_designation,
  role: a.current_designation,
  designation: a.current_designation,
  industry: a.industry,
  skills: a.skills,
  mentorship_topics: a.mentorship_topics,
  availability: a.availability,
  capacity: a.capacity,
  current_load: a.current_load,
  avatar_url: a.avatar,
  avatar: a.avatar,
  image: a.avatar,
  bio: a.bio,
  is_available_for_mentorship: a.availability !== "unavailable" && a.current_load < a.capacity,
  is_verified: true
}));

export const INITIAL_STUDENTS = [
  {
    id: "stu-1",
    user_id: "usr-stu-1",
    full_name: "Tanmay Singhal",
    roll_number: "230192010055",
    branch: "CSE",
    batch_year: "2025",
    skills: ["Python", "Machine Learning", "PyTorch", "SQL", "Data Structures"],
    interests: "AI/ML Systems, Off-campus placements, Autonomous Agents"
  }
];

export const INITIAL_NOTICES = [
  {
    id: "not-1",
    title: "Google & Microsoft Alumni Guidance Session (Hybrid)",
    content: "Senior alumni from Google Cloud and Microsoft are hosting an offline AMA & resume teardown session in Audi-2 on Friday.",
    category: "Mentorship",
    published_by: "Dean Alumni Relations",
    created_at: new Date().toISOString()
  },
  {
    id: "not-2",
    title: "Placement Preparation Drive: Referral Portal Active",
    content: "Final year students can request direct referral reviews through the Alumni Connect portal.",
    category: "Career",
    published_by: "Training & Placement Cell",
    created_at: new Date().toISOString()
  }
];

export const INITIAL_EVENTS = [
  {
    id: "ev-1",
    title: "Agentic AI & Scalable Microservices Summit",
    description: "Industry panel with GL Bajaj alumni discussing autonomous workflows, LangGraph in production, and career transitions.",
    date: "2026-11-15",
    time: "02:00 PM - 04:30 PM",
    venue: "Main Auditorium / Zoom Live",
    category: "Tech Seminar",
    rsvps: ["user-stu-1"],
    created_at: new Date().toISOString()
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: "ach-1",
    alumni_name: "Aarav Sharma",
    alumni_batch: "2020",
    title: "Recognized as Tech Lead for Google Cloud LLM Systems",
    description: "Led the sub-second retrieval caching layer serving global enterprise clients.",
    date: "2026-08-10",
    is_verified: true,
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MENTORSHIPS = [];

export const INITIAL_MESSAGES = [];

export const INITIAL_IMPORT_HISTORY = [];
