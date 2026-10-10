import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import AlumniCard from "../../components/student/AlumniCard";
import AlumniProfileModal from "../../components/student/AlumniProfileModal";
import MentorshipRequestModal from "../../components/student/MentorshipRequestModal";
import EmptyState from "../../components/common/EmptyState";
import DailyThoughtCard from "../../components/alumni/DailyThoughtCard";
import { 
  Users, 
  MessageSquare, 
  Bell, 
  Calendar, 
  ArrowRight, 
  GraduationCap,
  Loader2,
  Clock,
  MapPin
} from "lucide-react";

export default function StudentDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  const [alumniList, setAlumniList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestTargetAlumni, setRequestTargetAlumni] = useState(null);

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
          .limit(6);

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
          .limit(4);

        if (noticeData) setNotices(noticeData);

        // 3. Fetch Events
        const { data: eventData } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (eventData) setEvents(eventData);

        // 4. Fetch Student's own Mentorship Requests
        if (user?.id) {
          const { data: mentData } = await supabase
            .from("mentorship_requests")
            .select("*, alumni(*, profiles(*))")
            .eq("student_id", user.id)
            .order("created_at", { ascending: false })
            .limit(4);

          if (mentData) setMentorships(mentData);
        }

      } catch (err) {
        console.warn("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user?.id]);

  async function handleSendMentorshipRequest(requestData) {
    if (!user?.id || !isSupabaseConfigured || !supabase) {
      addToast("Supabase is not configured.", "error");
      return;
    }

    try {
      const { data, error } = await supabase.from("mentorship_requests").insert({
        student_id: user.id,
        alumni_id: requestData.alumni_id,
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

  const firstName = profile?.full_name?.split(" ")[0] || "Student";

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. Student Institutional Welcome Card */}
      <div className="bg-[#7A1F24] rounded-lg p-6 sm:p-8 text-white border border-[#5C171B] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 bg-[#5C171B] border border-white/20 text-[#B08A3E] text-xs px-2.5 py-0.5 rounded font-semibold">
            <GraduationCap className="w-3.5 h-3.5 text-[#B08A3E]" />
            <span>Student Portal • {profile?.roll_number ? `Roll: ${profile.roll_number}` : (profile?.branch || "GL Bajaj")}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome, {firstName}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            Build connections with the GL Bajaj alumni community. Request one-on-one mentorship, career guidance, and industry insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/student/alumni"
            className="bg-[#FFFFFF] hover:bg-[#F7F3EA] text-[#7A1F24] font-semibold text-xs sm:text-sm px-4 py-2 rounded-md transition shadow-xs flex items-center space-x-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Find Alumni Mentors</span>
          </Link>
          <Link
            to="/student/mentorship"
            className="bg-[#5C171B] hover:bg-[#481115] text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-md transition border border-white/20 flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>My Mentorship ({mentorships.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Daily GLB Thought */}
      <DailyThoughtCard />

      {/* 3. My Mentorship Section & Recent Notices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My Mentorship Section */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#7A1F24]" />
              <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
                My Mentorship
              </h2>
            </div>
            <Link
              to="/student/mentorship"
              className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center text-[#667085]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : mentorships.length === 0 ? (
            <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
              <p className="text-xs text-[#667085] font-medium">No mentorship requests yet.</p>
              <Link
                to="/student/alumni"
                className="mt-3 inline-block text-xs font-semibold text-[#7A1F24] hover:underline"
              >
                Explore alumni directory to request guidance →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {mentorships.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-[#202124]">
                      {req.topic || "Career Mentorship"}
                    </div>
                    <div className="text-[11px] text-[#667085]">
                      Mentor: <strong className="text-[#202124]">{req.alumni?.profiles?.full_name || "Alumnus"}</strong> • {req.alumni?.current_company || "Graduate"}
                    </div>
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        req.status === "accepted"
                          ? "bg-green-50 text-[#2E6B4A] border-green-200"
                          : req.status === "rejected"
                          ? "bg-red-50 text-[#B42318] border-red-200"
                          : "bg-amber-50 text-[#A66A00] border-amber-200"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Notices */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-[#7A1F24]" />
              <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
                Recent Notices
              </h2>
            </div>
            <Link
              to="/student/notices"
              className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center text-[#667085]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : notices.length === 0 ? (
            <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
              <p className="text-xs text-[#667085] font-medium">No notices published yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-3 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#667085]">
                    <span className="font-semibold text-[#7A1F24]">{n.category || "Notice"}</span>
                    <span>{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-xs text-[#202124] leading-snug">{n.title}</h3>
                  <p className="text-[11px] text-[#667085] line-clamp-2 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Upcoming Events */}
      <div className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#7A1F24]" />
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
              Upcoming Events
            </h2>
          </div>
          <Link
            to="/student/events"
            className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View all events</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center text-[#667085]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
            <p className="text-xs text-[#667085] font-medium">No upcoming events scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((ev) => (
              <div key={ev.id} className="p-4 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#667085]">
                  <span className="font-semibold text-[#7A1F24] capitalize">{ev.event_type || "Event"}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ev.date}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-[#202124]">{ev.title}</h3>
                <p className="text-[11px] text-[#667085] line-clamp-2">{ev.description}</p>
                {ev.location && (
                  <p className="text-[11px] text-[#202124] flex items-center gap-1 font-medium pt-1">
                    <MapPin className="w-3 h-3 text-[#7A1F24]" />
                    {ev.location}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Alumni Recommendations */}
      <div className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#7A1F24]" />
            <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
              Alumni Recommendations
            </h2>
          </div>
          <Link
            to="/student/alumni"
            className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Explore directory</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center text-[#667085]">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : alumniList.length === 0 ? (
          <div className="py-12 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
            <p className="text-xs text-[#667085] font-medium">No verified alumni records available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alumniList.map((alumni) => (
              <AlumniCard
                key={alumni.id}
                alumni={alumni}
                onOpenProfile={(a) => setSelectedAlumni(a)}
                onRequestMentorship={(a) => setRequestTargetAlumni(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Alumni Detail Modal */}
      {selectedAlumni && (
        <AlumniProfileModal
          isOpen={Boolean(selectedAlumni)}
          onClose={() => setSelectedAlumni(null)}
          alumni={selectedAlumni}
          onRequestMentorship={(a) => {
            setSelectedAlumni(null);
            setRequestTargetAlumni(a);
          }}
        />
      )}

      {/* Mentorship Request Modal */}
      {requestTargetAlumni && (
        <MentorshipRequestModal
          isOpen={Boolean(requestTargetAlumni)}
          onClose={() => setRequestTargetAlumni(null)}
          alumni={requestTargetAlumni}
          onSubmitRequest={handleSendMentorshipRequest}
        />
      )}
    </div>
  );
}
