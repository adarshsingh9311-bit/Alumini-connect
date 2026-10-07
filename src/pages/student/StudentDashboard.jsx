import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import AlumniCard from "../../components/student/AlumniCard";
import AlumniProfileModal from "../../components/student/AlumniProfileModal";
import MentorshipRequestModal from "../../components/student/MentorshipRequestModal";
import EmptyState from "../../components/common/EmptyState";
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
  Loader2
} from "lucide-react";

export default function StudentDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [alumniList, setAlumniList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestTargetAlumni, setRequestTargetAlumni] = useState(null);

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    async function loadDashboardData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Verified Alumni
        const { data: alumData } = await supabase
          .from("alumni")
          .select("*, profiles(*)")
          .eq("is_verified", true)
          .limit(8);

        if (alumData) {
          setAlumniList(alumData.map(a => ({
            id: a.id,
            user_id: a.user_id,
            full_name: a.profiles?.full_name || "GLB Alumnus",
            email: a.profiles?.email || "",
            avatar_url: a.profiles?.avatar_url || "",
            branch: a.branch,
            batch_year: a.graduation_year || a.batch_year,
            current_company: a.current_company,
            current_designation: a.current_designation,
            industry: a.industry,
            location: a.location,
            skills: Array.isArray(a.skills) ? a.skills : [],
            bio: a.bio,
            is_available_for_mentorship: a.is_available_for_mentorship,
            is_verified: a.is_verified
          })));
        }

        // 2. Fetch Notices
        const { data: noticeData } = await supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        if (noticeData) setNotices(noticeData);

        // 3. Fetch Events
        const { data: eventData } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (eventData) setEvents(eventData);

        // 4. Fetch Approved Achievements
        const { data: achData } = await supabase
          .from("achievements")
          .select("*, alumni(*, profiles(*))")
          .eq("is_approved", true)
          .limit(4);

        if (achData) setAchievements(achData);

        // 5. Fetch Student's Mentorship Requests
        if (user?.id) {
          const { data: mentorData } = await supabase
            .from("mentorship_requests")
            .select("*")
            .eq("student_id", user.id);

          if (mentorData) setMentorships(mentorData);
        }
      } catch (err) {
        console.warn("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  async function handleSubmitMentorship(requestData) {
    if (!user?.id || !isSupabaseConfigured || !supabase) {
      addToast("Mentorship submission requires a connected database session.", "error");
      return;
    }

    try {
      const targetAlumniUserId = requestData.alumni_user_id || requestData.user_id || requestData.alumni_id;
      const { data, error } = await supabase.from("mentorship_requests").insert({
        student_id: user.id,
        alumni_id: targetAlumniUserId,
        topic: requestData.topic || "Career Guidance",
        message: requestData.message,
        preferred_time: requestData.preferred_time || "Flexible",
        status: "pending"
      }).select().single();

      if (error) throw error;

      if (data) {
        setMentorships((prev) => [data, ...prev]);
      }
      addToast(`Mentorship request successfully sent to ${requestData.alumni_name || "mentor"}!`, "success");
      setRequestTargetAlumni(null);
    } catch (err) {
      addToast(err.message || "Failed to submit request.", "error");
    }
  }

  const myRequestsCount = mentorships.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0C1929] via-[#1A2C42] to-[#0C1929] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-[#E7E1D4]/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#C29B38]/30 border border-[#C29B38]/50 text-amber-200 text-xs px-3 py-1 rounded-full font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Student Portal • {profile?.roll_number ? `Roll No: ${profile.roll_number}` : (profile?.branch || "GL Bajaj")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              {greeting}, {profile?.full_name?.split(" ")[0] || "Scholar"}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Connect with verified GL Bajaj alumni across leading global organizations. Request 1-on-1 mentorship, placement insights, and career guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/alumni"
              className="bg-[#C29B38] hover:bg-[#B57C34] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition shadow-lg flex items-center space-x-1.5"
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

      {/* Metrics Row: 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#8C7138] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{alumniList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Available Mentors</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0C1929] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{myRequestsCount}</div>
            <div className="text-xs text-slate-500 font-medium">Mentorship Requests</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{notices.length}</div>
            <div className="text-xs text-slate-500 font-medium">College Notices</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{events.length}</div>
            <div className="text-xs text-slate-500 font-medium">Upcoming Events</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Featured Alumni & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Featured Mentors & Accolades (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  <Sparkles className="w-5 h-5 text-[#C29B38]" />
                  <span>Recommended Alumni Mentors</span>
                </h2>
                <p className="text-xs text-slate-500">Verified seniors aligned with your career goals</p>
              </div>
              <Link
                to="/student/alumni"
                className="text-xs font-bold text-[#8C7138] hover:underline flex items-center gap-1"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
                <p className="text-xs">Loading alumni mentors...</p>
              </div>
            ) : alumniList.length === 0 ? (
              <EmptyState
                title="No alumni profiles available yet"
                message="Verified alumni mentors will appear here as they join the GLB network."
                actionLabel="Explore Portal"
                actionLink="/student"
              />
            ) : (
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
            )}
          </div>

          {/* Alumni Achievements Highlight */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-serif">
                <Award className="w-4 h-4 text-[#C29B38]" />
                <span>Alumni Accolades & Milestones</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Verified by College Admin</span>
            </div>

            {achievements.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No alumni achievements published yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E7E1D4] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#0C1929]">
                      <span>{ach.alumni?.profiles?.full_name || "GLB Alumnus"}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{ach.date || ""}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{ach.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Notices & Events */}
        <div className="space-y-6">
          
          {/* College Notices Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-serif">
                <Bell className="w-4 h-4 text-[#C29B38]" />
                <span>College Notices</span>
              </h3>
              <Link to="/student/notices" className="text-xs font-semibold text-[#8C7138] hover:underline">
                View All
              </Link>
            </div>

            {notices.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No notices available.</p>
            ) : (
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div key={notice.id} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D4] space-y-1 hover:border-[#C29B38]/50 transition">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7138] bg-amber-50 px-2 py-0.5 rounded border border-[#E7E1D4]">
                        {notice.category || "General"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 leading-snug">{notice.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-serif">
                <Calendar className="w-4 h-4 text-[#C29B38]" />
                <span>Upcoming Events</span>
              </h3>
              <Link to="/student/events" className="text-xs font-semibold text-[#8C7138] hover:underline">
                View All
              </Link>
            </div>

            {events.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No events available.</p>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E1D4] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{ev.event_type || "Event"}</span>
                      <span className="text-[11px] text-[#8C7138] font-bold">{ev.date}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">{ev.title}</h4>
                    <p className="text-[11px] text-slate-500">{ev.location ? `${ev.location} • ` : ""}{ev.time || ""}</p>
                    {ev.registration_link && (
                      <a
                        href={ev.registration_link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 bg-[#0C1929] text-white hover:bg-[#1A2C42]"
                      >
                        <span>Register to Attend</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
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
