import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { 
  INITIAL_ALUMNI, 
  INITIAL_NOTICES, 
  INITIAL_EVENTS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_MENTORSHIPS 
} from "../../lib/mockData";
import AlumniCard from "../../components/student/AlumniCard";
import AlumniProfileModal from "../../components/student/AlumniProfileModal";
import MentorshipRequestModal from "../../components/student/MentorshipRequestModal";
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Calendar, 
  ArrowRight, 
  Award, 
  Sparkles, 
  CheckCircle2,
  GraduationCap,
  Heart,
  Briefcase,
  FileText,
  Upload,
  AlertCircle
} from "lucide-react";

export default function StudentDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [alumniList] = useState(INITIAL_ALUMNI);
  const [notices] = useState(INITIAL_NOTICES);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [achievements] = useState(INITIAL_ACHIEVEMENTS);
  const [mentorships, setMentorships] = useState(INITIAL_MENTORSHIPS);
  const [studentCv, setStudentCv] = useState(profile?.resume_name || "Resume_GLB_Scholar.pdf");

  function handleQuickCvUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("File size exceeds 5MB limit. Please upload a smaller PDF/DOCX file.", "error");
        return;
      }
      setStudentCv(file.name);
      addToast(`CV "${file.name}" uploaded successfully!`, "success");
    }
  }

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestTargetAlumni, setRequestTargetAlumni] = useState(null);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  // Family moments for student community widget
  const studentFamilyMoments = [
    {
      id: "sfm-1",
      author: "Rahul Gupta",
      batch: "CSE '21",
      company: "Microsoft",
      text: "Promoted to Senior SDE at Microsoft! Happy to mentor GLB 3rd/4th years on System Design.",
      time: "3h ago"
    },
    {
      id: "sfm-2",
      author: "Neha Mishra",
      batch: "IT '22",
      company: "CMU Scholar",
      text: "Admitted into Carnegie Mellon University MS CS. Open to reviewing US graduate SOPs for GLBians!",
      time: "1d ago"
    }
  ];

  function handleRsvp(eventId) {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const hasRsvp = ev.rsvps?.includes(user?.id || "user-stu-1");
          const nextRsvps = hasRsvp
            ? ev.rsvps.filter((id) => id !== (user?.id || "user-stu-1"))
            : [...(ev.rsvps || []), user?.id || "user-stu-1"];
          addToast(hasRsvp ? `RSVP cancelled for ${ev.title}` : `RSVP confirmed for ${ev.title}!`, "success");
          return { ...ev, rsvps: nextRsvps };
        }
        return ev;
      })
    );
  }

  function handleSubmitMentorship(requestData) {
    const newReq = {
      id: "mr-" + Date.now(),
      student_id: profile?.id || "stu-1",
      student_name: profile?.full_name || "Tanmay Singhal",
      student_roll: profile?.roll_number || "230192010055",
      student_branch: profile?.branch || "CSE",
      alumni_id: requestData.alumni_id,
      alumni_name: requestData.alumni_name,
      topic: requestData.topic,
      message: requestData.message,
      status: "pending",
      response_note: null,
      created_at: new Date().toISOString()
    };
    setMentorships((prev) => [newReq, ...prev]);
    addToast(`Mentorship request successfully sent to ${requestData.alumni_name}!`, "success");
  }

  const myRequestsCount = mentorships.filter((m) => m.student_id === (profile?.id || "stu-1")).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#592106] via-[#472510] to-[#2f1508] border-b-4 border-[#ffcc4e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#ffcc4e]/20 border border-[#ffcc4e]/40 text-[#ffcc4e] text-xs px-3 py-1 rounded-full font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Student Portal | Roll No: {profile?.roll_number || "230192010055"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white !text-white">
              {greeting}, {profile?.full_name?.split(" ")[0] || "Scholar"}!
            </h1>
            <p className="text-[#faf6eb] text-xs sm:text-sm max-w-xl leading-relaxed">
              Connect with alumni from Google, Microsoft, Amazon and 500+ top firms. Get 1-on-1 career guidance, mock interviews, and placement referrals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/alumni"
              className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
            >
              <Users className="w-4 h-4" />
              <span>Find Alumni Mentors</span>
            </Link>
            <Link
              to="/student/mentorship"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition border border-white/20 flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>My Requests ({myRequestsCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mandatory Student CV Quick Upload & Verification Banner */}
      <div className="bg-[#faf6eb] border-2 border-dashed border-[#ffcc4e] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#592106] text-[#ffcc4e] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <FileText className="w-5 h-5 text-[#ffcc4e]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-[#592106] uppercase tracking-wide">
                Student Curriculum Vitae (CV / Resume)
              </h3>
              <span className="bg-red-500/10 text-red-600 border border-red-200 text-[10px] font-black px-2 py-0.5 rounded-full">
                * Mandatory for Mentorship &amp; Referrals
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Alumni mentors screen resumes before accepting 1-on-1 mentorship requests. Upload your latest PDF or DOCX file (max 5MB).
            </p>
            <div className="mt-2 text-xs font-mono text-slate-700 flex items-center gap-2">
              <span className="font-semibold text-slate-900">Current Attached CV:</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-800 font-bold truncate max-w-xs">
                {studentCv || "No CV attached yet"}
              </span>
              {studentCv && (
                <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <label className="cursor-pointer bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5 w-full md:w-auto">
            <Upload className="w-4 h-4 text-[#ffcc4e]" />
            <span>{studentCv ? "Update / Replace CV" : "Upload Mandatory CV"}</span>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleQuickCvUpload}
              className="hidden"
            />
          </label>
          <Link
            to="/student/profile"
            className="bg-white hover:bg-slate-50 text-[#592106] border border-slate-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center justify-center shrink-0"
          >
            Manage in Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row: 4 Clickable Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/student/alumni"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
          title="Browse Available Mentors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/40 flex items-center justify-center group-hover:scale-105 transition shrink-0">
            <Users className="w-6 h-6 text-[#592106]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{alumniList.length}</div>
            <div className="text-xs text-slate-500 font-semibold group-hover:text-[#592106] transition">Available Mentors &rarr;</div>
          </div>
        </Link>

        <Link
          to="/student/mentorship"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
          title="View Mentorship Requests"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/40 flex items-center justify-center group-hover:scale-105 transition shrink-0">
            <MessageSquare className="w-6 h-6 text-[#592106]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{myRequestsCount}</div>
            <div className="text-xs text-slate-500 font-semibold group-hover:text-[#592106] transition">Mentorship Requests &rarr;</div>
          </div>
        </Link>

        <Link
          to="/student/notices"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
          title="Read College Notices"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#c87e35] border border-[#ffcc4e]/40 flex items-center justify-center group-hover:scale-105 transition shrink-0">
            <Bell className="w-6 h-6 text-[#c87e35]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{notices.length}</div>
            <div className="text-xs text-slate-500 font-semibold group-hover:text-[#592106] transition">College Notices &rarr;</div>
          </div>
        </Link>

        <Link
          to="/student/events"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 hover:border-[#ffcc4e] hover:shadow-md hover:-translate-y-0.5 transition duration-200 cursor-pointer group"
          title="View Upcoming Events"
        >
          <div className="w-12 h-12 rounded-xl bg-[#faf6eb] text-[#472510] border border-[#ffcc4e]/40 flex items-center justify-center group-hover:scale-105 transition shrink-0">
            <Calendar className="w-6 h-6 text-[#472510]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#592106] transition">{events.length}</div>
            <div className="text-xs text-slate-500 font-semibold group-hover:text-[#592106] transition">Upcoming Events &rarr;</div>
          </div>
        </Link>
      </div>

      {/* Main Content Grid: Featured Alumni & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Featured Mentors & Accolades (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ffcc4e]" />
                  <span>Recommended Mentors for You</span>
                </h2>
                <p className="text-xs text-slate-500">Verified seniors aligned with your branch and career goals</p>
              </div>
              <Link
                to="/student/alumni"
                className="text-xs font-bold text-[#592106] hover:text-[#472510] flex items-center gap-1"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alumniList.slice(0, 4).map((alumni) => (
                <AlumniCard
                  key={alumni.id}
                  alumni={alumni}
                  onOpenProfile={setSelectedAlumni}
                  onRequestMentorship={setRequestTargetAlumni}
                />
              ))}
            </div>
          </div>

          {/* Alumni Achievements Highlight */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-[#ffcc4e]" />
                <span>Alumni Accolades & Milestones</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Verified by College Admin</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#592106]">
                    <span>{ach.alumni_name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{ach.alumni_batch}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{ach.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Moments, Notices & Events */}
        <div className="space-y-6">
          
          {/* GLB Family Moments Feed Widget */}
          <div className="bg-gradient-to-br from-amber-50/60 to-teal-50/60 rounded-2xl p-5 border border-amber-200/60 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-amber-200/40 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-glgold text-[#ffcc4e]" />
                <span>GLB Family Moments</span>
              </h3>
              <span className="text-[10px] text-[#ffcc4e] font-bold">Community</span>
            </div>
            <div className="space-y-2.5">
              {studentFamilyMoments.map(m => (
                <div key={m.id} className="bg-white/90 p-3 rounded-xl border border-amber-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{m.author} ({m.batch})</span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{m.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* College Notices Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#ffcc4e]" />
                <span>College Notices</span>
              </h3>
              <Link to="/student/notices" className="text-xs font-semibold text-[#592106] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 hover:bg-[#faf6eb]/50 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#592106] bg-teal-100/60 px-2 py-0.5 rounded">
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{notice.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffcc4e]" />
                <span>Upcoming Events</span>
              </h3>
              <Link to="/student/events" className="text-xs font-semibold text-[#592106] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {events.map((ev) => {
                const isRsvp = ev.rsvps?.includes(user?.id || "user-stu-1");
                return (
                  <div key={ev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{ev.category}</span>
                      <span className="text-[11px] text-[#ffcc4e] font-bold">{ev.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{ev.title}</h4>
                    <p className="text-[11px] text-slate-500">{ev.venue} ? {ev.time}</p>
                    <button
                      onClick={() => handleRsvp(ev.id)}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 ${
                        isRsvp
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-[#592106] hover:text-white"
                      }`}
                    >
                      {isRsvp ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>RSVP Confirmed</span>
                        </>
                      ) : (
                        <span>RSVP to Attend</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Alumni Detail Modal */}
      <AlumniProfileModal
        isOpen={Boolean(selectedAlumni)}
        onClose={() => setSelectedAlumni(null)}
        alumni={selectedAlumni}
        onRequestMentorship={(alumni) => {
          setSelectedAlumni(null);
          setRequestTargetAlumni(alumni);
        }}
      />

      {/* Mentorship Request Modal */}
      <MentorshipRequestModal
        isOpen={Boolean(requestTargetAlumni)}
        onClose={() => setRequestTargetAlumni(null)}
        alumni={requestTargetAlumni}
        onSubmit={handleSubmitMentorship}
      />

    </div>
  );
}
