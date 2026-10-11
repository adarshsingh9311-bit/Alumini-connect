export const APP_NAME = "GL Bajaj Alumni Connect";
export const COLLEGE_NAME = "G.L. Bajaj Institute of Technology & Management";
export const COLLEGE_LOCATION = "Greater Noida, Uttar Pradesh";

export const USER_ROLES = {
  STUDENT: "student",
  ALUMNI: "alumni",
  ADMIN: "admin"
};

export const BRANCHES = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Electronics & Communication (ECE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Artificial Intelligence & Machine Learning (AI-ML)",
  "Data Science (DS)",
  "Master of Computer Applications (MCA)",
  "Master of Business Administration (MBA)"
];

export const BRANCH_CODES = ["CSE", "IT", "ECE", "ME", "CE", "AI-ML", "DS", "MCA", "MBA"];

export const MIN_GRADUATION_YEAR = 2005;
export const MAX_GRADUATION_YEAR = 2050;

// Graduation years from 2050 descending to 2005 (covers all current, future through 2050, and alumni historical years)
export const BATCH_YEARS = Array.from(
  { length: MAX_GRADUATION_YEAR - MIN_GRADUATION_YEAR + 1 },
  (_, i) => String(MAX_GRADUATION_YEAR - i)
);

export const MENTORSHIP_TOPICS = [
  "Career Mentorship & Guidance",
  "Mock Technical Interview",
  "Resume & Portfolio Review",
  "Company Placement & Referrals",
  "Higher Studies & MS/MBA Guidance",
  "Open Source & Hackathon Mentorship",
  "Startup & Entrepreneurship"
];

export const EVENT_CATEGORIES = [
  "Reunion",
  "Webinar",
  "Academic & Advisory",
  "Workshop",
  "Guest Lecture",
  "Placement Drive"
];

export const NOTICE_TARGETS = [
  { label: "All Ecosystem (Students & Alumni)", value: "all" },
  { label: "Current Students Only", value: "students" },
  { label: "Alumni Only", value: "alumni" }
];
