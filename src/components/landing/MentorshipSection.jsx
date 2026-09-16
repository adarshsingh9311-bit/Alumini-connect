import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  X,
  Send,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";

export const FEATURED_MENTORS = [
  {
    id: "m-1",
    name: "Aman Sharma",
    batch: "2018",
    branch: "Computer Science & Engg",
    company: "Google",
    role: "Staff Software Engineer",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    skills: ["System Design", "Distributed Systems", "Go", "Kubernetes"],
    mentorshipTopics: ["Off-campus Google prep", "High-level design", "SDE-II transitions"],
    availability: "Accepting 2 Mentees",
    bio: "GL Bajaj 2018 grad. Passionate about helping junior GLBians crack Tier-1 tech companies. Mentored 40+ students so far."
  },
  {
    id: "m-2",
    name: "Priya Saxena",
    batch: "2016",
    branch: "Information Technology",
    company: "PayFlow (Y Combinator '21)",
    role: "Co-Founder & CTO",
    location: "Gurugram, India",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    skills: ["Fintech", "Microservices", "Product Architecture", "Fundraising"],
    mentorshipTopics: ["Startup building", "Early engineer careers", "Fintech systems"],
    availability: "Accepting 1 Mentee",
    bio: "Co-founded PayFlow after 4 years at Microsoft. E-Cell GL Bajaj alumna. Open to advising aspiring student founders."
  },
  {
    id: "m-3",
    name: "Rohan Verma",
    batch: "2019",
    branch: "Computer Science & Engg",
    company: "Microsoft",
    role: "Senior Software Engineer",
    location: "Hyderabad, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    skills: ["Azure Cloud", "C# / .NET Core", "Algorithms", "DSA"],
    mentorshipTopics: ["DSA Mastery", "Microsoft On-Campus & Off-Campus", "Resume Polish"],
    availability: "Accepting 3 Mentees",
    bio: "Cracked Microsoft off-campus during final year. Happy to review resumes and conduct peer mock coding interviews."
  },
  {
    id: "m-4",
    name: "Ananya Iyer",
    batch: "2020",
    branch: "Electronics & Communication",
    company: "Amazon AWS",
    role: "Cloud Solutions Architect",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    skills: ["AWS", "DevOps", "Terraform", "Serverless"],
    mentorshipTopics: ["Cloud certifications", "ECE to Tech transition", "AWS Solutions Roles"],
    availability: "Accepting 2 Mentees",
    bio: "ECE batch of 2020 who transitioned into cloud architecture. Here to guide students making the branch shift into tech."
  },
  {
    id: "m-5",
    name: "Karan Singhal",
    batch: "2017",
    branch: "Computer Science & Engg",
    company: "Carnegie Mellon University",
    role: "AI Researcher / PhD Scholar",
    location: "Pittsburgh, USA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    skills: ["Generative AI", "PyTorch", "NLP", "GRE / TOEFL"],
    mentorshipTopics: ["MS/PhD in USA", "Research paper publishing", "SOP Reviews"],
    availability: "Accepting 2 Mentees",
    bio: "GLB CSE 2017 -> MS CS at CMU -> PhD. Mentoring GLB students aspiring for top US graduate programs."
  },
  {
    id: "m-6",
    name: "Shweta Pandey",
    batch: "2017",
    branch: "Civil Engineering",
    company: "Government of India",
    role: "Indian Administrative Service (IAS)",
    location: "Lucknow, India",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    skills: ["UPSC Strategy", "Public Policy", "Ethics", "Governance"],
    mentorshipTopics: ["UPSC CSE preparation alongside college", "Optional selection", "Interview prep"],
    availability: "Accepting 1 Mentee",
    bio: "Civil Engg 2017 alumna. Cleared UPSC CSE with top rank. Guiding engineering students aiming for public service."
  }
];

export default function MentorshipSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  const { role, setDemoPortal } = useAuth();
  const navigate = useNavigate();

  const filters = ["All", "Big Tech", "Startups & Cloud", "Higher Studies", "Public Service"];

  const filteredMentors = FEATURED_MENTORS.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === "Big Tech") {
      return ["Google", "Microsoft", "Amazon AWS"].includes(m.company);
    }
    if (activeFilter === "Startups & Cloud") {
      return m.company.includes("PayFlow") || m.company.includes("AWS");
    }
    if (activeFilter === "Higher Studies") {
      return m.company.includes("Carnegie");
    }
    if (activeFilter === "Public Service") {
      return m.company.includes("Government");
    }
    return true;
  });

  function handleSendRequest(e) {
    e.preventDefault();
    setRequestSuccess(true);
    setTimeout(() => {
      setRequestSuccess(false);
      setSelectedMentor(null);
      setRequestNote("");
    }, 2500);
  }

  function handleActionDirect(mentor) {
    if (!role) {
      setDemoPortal(USER_ROLES.STUDENT);
    }
    navigate("/student/mentorship");
  }

  return (
    <section id="mentorship" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Sparkles className="w-3.5 h-3.5 text-glgold" />
            <span>Mentorship at the Heart of GLB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Find Someone Who Has Walked Your Path
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Direct, personalized guidance from verified alumni who sat in the same lecture halls, cracked the same interview rounds, and are eager to pull you up.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mentor, company, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-glgold transition"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition ${
                  activeFilter === filter
                    ? "bg-glgold text-slate-950 border-glgold font-bold shadow-md shadow-glgold/20"
                    : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 hover:border-glgold/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Header with Avatar and Batch */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-glgold/40 group-hover:border-glgold transition shadow-md"
                    />
                    <div>
                      <h3 className="font-black text-base text-white group-hover:text-glgold transition">
                        {mentor.name}
                      </h3>
                      <p className="text-xs font-bold text-teal-400">
                        {mentor.role}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {mentor.company}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-glgold border border-glgold/20">
                    '{mentor.batch.slice(2)}
                  </span>
                </div>

                {/* Branch and Location */}
                <div className="space-y-1 text-xs text-slate-400 mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                    <span>{mentor.branch}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{mentor.location}</span>
                  </div>
                </div>

                {/* Mentorship Focus */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Mentorship Focus
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.mentorshipTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-white/5 text-slate-300 px-2.5 py-1 rounded-lg border border-white/10 font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Availability and CTAs */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>{mentor.availability}</span>
                  </span>
                  <span className="text-slate-400 text-[11px]">Free 1-on-1</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
                  >
                    View Journey
                  </button>
                  <button
                    onClick={() => handleActionDirect(mentor)}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-glgold to-amber-600 hover:from-glgold-light hover:to-amber-500 text-slate-950 shadow-md shadow-glgold/20 transition flex items-center justify-center space-x-1"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-glblue-750/70 to-teal-950/70 border border-teal-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Are you a GL Bajaj graduate working in industry?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Give 30 minutes a month to mentor eager juniors. Toggle your bandwidth at any time.
            </p>
          </div>
          <Link
            to="/login?portal=alumni"
            className="whitespace-nowrap bg-glgold hover:bg-glgold-dark text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition shadow-lg shadow-glgold/25"
          >
            Become a GLB Mentor
          </Link>
        </div>

      </div>

      {/* Mentor Profile / Journey Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-glgold"
              />
              <div>
                <h3 className="text-xl font-black text-white">{selectedMentor.name}</h3>
                <p className="text-teal-300 font-bold text-sm">{selectedMentor.role} @ {selectedMentor.company}</p>
                <p className="text-xs text-slate-400">Class of {selectedMentor.batch} • {selectedMentor.branch}</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5 mb-4">
              "{selectedMentor.bio}"
            </p>

            <div className="space-y-3 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider text-glgold">
                Career Journey Timeline
              </div>
              <div className="space-y-2 text-xs text-slate-300 border-l-2 border-teal-500/40 pl-3">
                <div>
                  <span className="font-bold text-white">GL Bajaj Institute:</span> Graduated in {selectedMentor.batch}
                </div>
                <div>
                  <span className="font-bold text-white">Early Milestone:</span> Core engineering projects and hackathons
                </div>
                <div>
                  <span className="font-bold text-white">Present Role:</span> {selectedMentor.role} at {selectedMentor.company}
                </div>
              </div>
            </div>

            {requestSuccess ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 p-4 rounded-2xl text-center text-sm font-semibold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Mentorship request sent to {selectedMentor.name}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Send a quick mentorship note:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Hi senior! I am a 3rd year student aspiring for a similar career path..."
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-glgold"
                  ></textarea>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-glgold to-amber-600 hover:from-glgold-light hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Mentorship Request</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleActionDirect(selectedMentor)}
                    className="px-4 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-500/30"
                  >
                    Open in Portal
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
