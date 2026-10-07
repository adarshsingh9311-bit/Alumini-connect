export const INITIAL_ALUMNI = [
  {
    id: "alum-1",
    user_id: "user-alum-1",
    roll_number: "220192010001",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    branch: "CSE",
    batch_year: "2022",
    current_company: "Google",
    current_designation: "Senior Software Engineer",
    industry: "Cloud & Distributed Systems",
    location: "Bengaluru, India",
    skills: ["Go", "Kubernetes", "Distributed Systems", "GCP", "System Design"],
    bio: "Passionate about distributed systems, cloud architecture, and mentoring juniors at GL Bajaj. Happy to review resumes and conduct mock interviews.",
    is_available_for_mentorship: true,
    is_verified: true,
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    linkedin_url: "https://linkedin.com/in/rahulsharma-glb",
    github_url: "https://github.com/rahulsharma-cloud",
    website_url: "https://rahulsharma.dev",
    career_history: [
      {
        id: "c-1",
        company: "Google",
        designation: "Senior Software Engineer",
        start_date: "2024-01-01",
        end_date: null,
        is_current: true,
        description: "Working on Cloud Infrastructure reliability and distributed data pipelines."
      },
      {
        id: "c-2",
        company: "Amazon Web Services (AWS)",
        designation: "Software Development Engineer II",
        start_date: "2022-07-01",
        end_date: "2023-12-31",
        is_current: false,
        description: "Built microservices handling 50k+ QPS with high fault tolerance."
      }
    ]
  },
  {
    id: "alum-2",
    user_id: "user-alum-2",
    roll_number: "210192010042",
    full_name: "Priya Verma",
    email: "priya.verma@example.com",
    branch: "IT",
    batch_year: "2021",
    current_company: "Microsoft",
    current_designation: "Lead Cloud Solutions Architect",
    industry: "Enterprise Cloud & AI",
    location: "Hyderabad, India",
    skills: ["Azure", "Cloud Architecture", "DevOps", "OpenAI API", "Microservices"],
    bio: "Cloud enthusiast, keynote speaker, and proud GL Bajaj IT alumna. Love guiding students towards certifications and cloud careers.",
    is_available_for_mentorship: true,
    is_verified: true,
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    linkedin_url: "https://linkedin.com/in/priyaverma-cloud",
    github_url: "https://github.com/priya-azure",
    website_url: "https://priyaverma.tech",
    career_history: [
      {
        id: "c-3",
        company: "Microsoft",
        designation: "Lead Cloud Solutions Architect",
        start_date: "2023-04-01",
        end_date: null,
        is_current: true,
        description: "Designing multi-region Azure architectures and enterprise LLM integrations."
      },
      {
        id: "c-4",
        company: "Cognizant",
        designation: "Associate Cloud Engineer",
        start_date: "2021-08-01",
        end_date: "2023-03-31",
        is_current: false,
        description: "Migration of legacy on-prem services to Microsoft Azure."
      }
    ]
  },
  {
    id: "alum-3",
    user_id: "user-alum-3",
    roll_number: "200192031015",
    full_name: "Aditya Roy",
    email: "aditya.roy@example.com",
    branch: "ECE",
    batch_year: "2020",
    current_company: "Qualcomm",
    current_designation: "Staff Hardware Systems Engineer",
    industry: "Semiconductors & Embedded Systems",
    location: "Noida, India",
    skills: ["VLSI", "SystemVerilog", "Embedded C", "SoC Design", "ARM"],
    bio: "Working on next-gen Snapdragon chipset power analysis. Always eager to assist GL Bajaj ECE students targeting core electronics roles.",
    is_available_for_mentorship: false,
    is_verified: true,
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    linkedin_url: "https://linkedin.com/in/adityaroy-vlsi",
    github_url: "",
    website_url: "",
    career_history: [
      {
        id: "c-5",
        company: "Qualcomm",
        designation: "Staff Hardware Systems Engineer",
        start_date: "2022-09-01",
        end_date: null,
        is_current: true,
        description: "Silicon verification and power performance evaluation."
      }
    ]
  },
  {
    id: "alum-4",
    user_id: "user-alum-4",
    roll_number: "230192010189",
    full_name: "Sneha Patel",
    email: "sneha.patel@example.com",
    branch: "CSE",
    batch_year: "2023",
    current_company: "Uber",
    current_designation: "Product Designer",
    industry: "Ride Hailing & Logistics",
    location: "Bengaluru, India",
    skills: ["UI/UX", "Figma", "User Research", "Interaction Design", "Design Systems"],
    bio: "Design lead transitioned from engineering. Mentor for students looking to enter Product Design, UI/UX, and Design Thinking.",
    is_available_for_mentorship: true,
    is_verified: false,
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    linkedin_url: "https://linkedin.com/in/snehapatel-design",
    github_url: "",
    website_url: "https://snehadesign.portfoliobox.net",
    career_history: [
      {
        id: "c-6",
        company: "Uber",
        designation: "Product Designer",
        start_date: "2023-08-01",
        end_date: null,
        is_current: true,
        description: "Designing partner-driver onboarding experiences across APAC."
      }
    ]
  }
];

export const INITIAL_STUDENTS = [
  {
    id: "stu-1",
    user_id: "user-stu-1",
    roll_number: "230192010055",
    full_name: "Tanmay Singhal",
    email: "tanmay.singhal@glbajaj.org",
    branch: "CSE",
    batch_year: "2025",
    academic_info: "B.Tech CSE - 7th Semester (CGPA: 8.8)",
    skills: ["React", "Node.js", "Python", "Docker", "Data Structures"],
    interests: "Distributed Backend Architecture, Cloud Native Dev",
    avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "stu-2",
    user_id: "user-stu-2",
    roll_number: "240192010112",
    full_name: "Ananya Dixit",
    email: "ananya.dixit@glbajaj.org",
    branch: "IT",
    batch_year: "2026",
    academic_info: "B.Tech IT - 5th Semester (CGPA: 9.1)",
    skills: ["Java", "Spring Boot", "SQL", "Cybersecurity"],
    interests: "Cloud Security, Big Data, Corporate Placement Prep",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
  }
];

export const INITIAL_NOTICES = [
  {
    id: "not-1",
    title: "Invitation: GL Bajaj Silver Jubilee Alumni Meet 2026",
    content: "We cordially invite all GL Bajaj alumni from batches 2005 through 2025 to our grand Silver Jubilee Reunion on the Greater Noida campus. Reconnect with faculty, share experiences with current students, and celebrate your alma mater.",
    category: "Reunion",
    published_by: "Dean Alumni Relations",
    target_audience: "all",
    created_at: "2026-09-10T10:00:00Z"
  },
  {
    id: "not-2",
    title: "Alumni-Student Mentorship Drive: Phase 2 Open",
    content: "Current 3rd and 4th year B.Tech scholars can now browse verified alumni mentors across Tier-1 tech firms and submit mentorship requests for mock interviews, placement preparation, and referral guidelines.",
    category: "Mentorship",
    published_by: "Training & Placement Cell",
    target_audience: "students",
    created_at: "2026-09-12T14:30:00Z"
  },
  {
    id: "not-3",
    title: "Call for Alumni Guest Speakers: Cloud Computing Symposium",
    content: "The Department of Computer Science & Engineering is seeking alumni with 3+ years experience in Cloud, AI, and DevOps to deliver interactive guest webinars. Express your interest via the Alumni Portal.",
    category: "Academic",
    published_by: "HOD CSE Department",
    target_audience: "alumni",
    created_at: "2026-09-14T09:15:00Z"
  }
];

export const INITIAL_EVENTS = [
  {
    id: "ev-1",
    title: "GL Bajaj Annual Alumni Meet 2026",
    description: "Grand annual get-together celebrating alumni achievements, campus developments, and departmental networking dinners.",
    date: "2026-10-15",
    time: "10:00 AM IST",
    venue: "Main Open-Air Auditorium, GL Bajaj Campus, Greater Noida",
    category: "Reunion",
    rsvps: ["user-stu-1", "user-alum-1"]
  },
  {
    id: "ev-2",
    title: "TechTalk: Enterprise AI & LLM Systems in Production",
    description: "Interactive webinar hosted by GL Bajaj alumni currently leading AI initiatives at Microsoft and Google.",
    date: "2026-10-28",
    time: "04:00 PM IST",
    venue: "Virtual (Google Meet)",
    category: "Webinar",
    rsvps: ["user-stu-1", "user-stu-2", "user-alum-2"]
  },
  {
    id: "ev-3",
    title: "Department Advisory Board & Curriculum Review Meet",
    description: "Roundtable session bringing industry leaders and senior alumni together with college faculty to update syllabi.",
    date: "2026-11-05",
    time: "02:00 PM IST",
    venue: "Executive Conference Hall, Block A",
    category: "Academic & Advisory",
    rsvps: []
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: "ach-1",
    alumni_id: "alum-1",
    alumni_name: "Rahul Sharma",
    alumni_batch: "2022 (CSE)",
    title: "Published Technical Whitepaper at Google Cloud Next 2026",
    description: "Authored an optimization framework reducing cross-datacenter message latency by 28% across distributed Kubernetes clusters.",
    date: "2026-08-20",
    is_verified: true,
    media_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ach-2",
    alumni_id: "alum-2",
    alumni_name: "Priya Verma",
    alumni_batch: "2021 (IT)",
    title: "Recognized as Microsoft MVP for Cloud Computing & AI",
    description: "Awarded the prestigious Microsoft Most Valuable Professional award for community leadership and enterprise architecture open guidance.",
    date: "2026-07-14",
    is_verified: true,
    media_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  }
];

export const INITIAL_MENTORSHIPS = [
  {
    id: "mr-1",
    student_id: "stu-1",
    student_name: "Tanmay Singhal",
    student_roll: "230192010055",
    student_branch: "CSE",
    alumni_id: "alum-1",
    alumni_name: "Rahul Sharma",
    topic: "Mock Technical Interview",
    message: "Hi Rahul bhaiya, I am preparing for upcoming SDE interviews and would love to get your feedback on System Design and Data Structures.",
    status: "accepted",
    response_note: "Glad to help! Let us connect this Saturday evening.",
    created_at: "2026-09-12T11:00:00Z"
  },
  {
    id: "mr-2",
    student_id: "stu-2",
    student_name: "Ananya Dixit",
    student_roll: "240192010112",
    student_branch: "IT",
    alumni_id: "alum-2",
    alumni_name: "Priya Verma",
    topic: "Career Mentorship & Guidance",
    message: "Hello Priya ma'am, I am in my 5th semester and keen on specializing in Cloud Solutions and Azure security architecture.",
    status: "pending",
    response_note: null,
    created_at: "2026-09-14T16:20:00Z"
  }
];

export const INITIAL_MESSAGES = [
  {
    id: "msg-1",
    mentorship_id: "mr-1",
    sender_id: "user-stu-1",
    sender_name: "Tanmay Singhal",
    content: "Hi Rahul bhaiya, thank you so much for accepting my mentorship request!",
    created_at: "2026-09-13T09:00:00Z"
  },
  {
    id: "msg-2",
    mentorship_id: "mr-1",
    sender_id: "user-alum-1",
    sender_name: "Rahul Sharma",
    content: "You are welcome Tanmay! Please share your updated resume and the specific topics you want to practice in our mock round.",
    created_at: "2026-09-13T09:15:00Z"
  }
];

export const INITIAL_IMPORT_HISTORY = [
  {
    id: "imp-1",
    filename: "GLB_Alumni_2022_CSE_Batch.xlsx",
    imported_by: "Admin Office",
    total_rows: 180,
    imported_count: 172,
    error_count: 8,
    status: "Completed with warnings",
    created_at: "2026-09-01T11:30:00Z"
  }
];
