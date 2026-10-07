import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import AchievementSubmitModal from "../../components/alumni/AchievementSubmitModal";
import DailyThoughtCard from "../../components/alumni/DailyThoughtCard";
import EmptyState from "../../components/common/EmptyState";
import { 
  Briefcase, 
  MessageSquare, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Users, 
  Loader2 
} from "lucide-react";

export default function AlumniDashboard() {
  const { profile, user, fetchUserProfile } = useAuth();
  const { addToast } = useToast();

  const [isAvailable, setIsAvailable] = useState(profile?.is_available_for_mentorship ?? true);
  const [mentorships, setMentorships] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  useEffect(() => {
    if (profile?.is_available_for_mentorship !== undefined) {
      setIsAvailable(profile.is_available_for_mentorship);
    }
  }, [profile]);

  useEffect(() => {
    async function loadAlumniData() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch mentorship requests directed to this alumnus
        const { data: reqData } = await supabase
          .from("mentorship_requests")
          .select("*, student:profiles!student_id(id, full_name, email, avatar_url)")
          .eq("alumni_id", user.id)
          .order("created_at", { ascending: false });

        if (reqData) {
          setMentorships(reqData.map((item) => ({
            id: item.id,
            student_id: item.student_id,
            student_name: item.student?.full_name || "GLB Student",
            topic: item.topic || "Career Guidance",
            message: item.message,
            status: item.status,
            response_note: item.response_note,
            created_at: item.created_at
          })));
        }

        // 2. Fetch upcoming events
        const { data: evData } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (evData) setEvents(evData);

      } catch (err) {
        console.warn("Failed to load alumni dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAlumniData();
  }, [user?.id]);

  async function toggleAvailability() {
    const next = !isAvailable;
    setIsAvailable(next);

    if (user?.id && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("alumni")
          .update({ is_available_for_mentorship: next })
          .eq("user_id", user.id);

        if (fetchUserProfile) await fetchUserProfile(user.id);
      } catch (err) {
        console.warn("Failed to update mentorship status:", err);
      }
    }

    addToast(next ? "You are now OPEN for student mentorship requests." : "Mentorship availability paused.", "info");
  }

  async function handleAcceptMentorship(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({
            status: "accepted",
            response_note: "Accepted! Looking forward to guiding you."
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Error accepting request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "accepted", response_note: "Accepted! Looking forward to guiding you." }
          : m
      )
    );
    addToast("Mentorship request accepted. Mentee added to chat!", "success");
  }

  async function handleRejectMentorship(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({
            status: "rejected",
            response_note: "Currently unavailable for this topic."
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Error rejecting request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "rejected", response_note: "Currently unavailable for this topic." }
          : m
      )
    );
    addToast("Mentorship request declined.", "info");
  }

  async function handleAchievementSubmit(achData) {
    if (user?.id && isSupabaseConfigured && supabase) {
      try {
        // Find alumni record id
        const { data: alumRec } = await supabase
          .from("alumni")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (alumRec) {
          await supabase.from("achievements").insert({
            alumni_id: alumRec.id,
            title: achData.title,
            description: achData.description,
            date: achData.date || new Date().toISOString().split("T")[0],
            category: achData.category || "Career",
            is_approved: false
          });
        }
      } catch (err) {
        console.warn("Error inserting achievement:", err);
      }
    }

    addToast(`Achievement "${achData.title}" submitted to Admin for verification!`, "success");
    setIsAchievementModalOpen(false);
  }

  const pendingRequests = mentorships.filter((m) => m.status === "pending");
  const activeMenteesCount = mentorships.filter((m) => m.status === "accepted").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Alumni Hero Header */}
      <div className="bg-gradient-to-r from-[#0C1929] via-[#1A2C42] to-[#0C1929] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#E7E1D4]/20">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#C29B38] text-white flex items-center justify-center font-serif font-black text-2xl border-2 border-amber-200/50 shadow-md">
            {(profile?.full_name || "A")[0]}
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-[#C29B38] text-slate-950 text-[11px] px-3 py-0.5 rounded-full font-bold">
              <Briefcase className="w-3 h-3" />
              <span>Alumni Portal • {profile?.roll_number ? `Roll No: ${profile.roll_number}` : (profile?.branch || "GL Bajaj")}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Welcome Back, {profile?.full_name || "Alumnus"}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              {profile?.graduation_year ? `Batch ${profile.graduation_year} • ` : ""}{profile?.branch || "GLB"}
              {profile?.current_designation ? ` • ${profile.current_designation}` : ""}
              {profile?.current_company ? ` at ${profile.current_company}` : ""}
            </p>
          </div>
        </div>

        {/* Mentorship Toggle & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-2 px-3 rounded-2xl flex items-center space-x-3">
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-amber-200">Mentorship Status</div>
              <div className="text-xs font-bold text-white">
                {isAvailable ? "Available to Mentor" : "Currently Unavailable"}
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                isAvailable ? "bg-emerald-500 text-white" : "bg-slate-600 text-slate-200"
              }`}
            >
              {isAvailable ? "Active" : "Paused"}
            </button>
          </div>

          <button
            onClick={() => setIsAchievementModalOpen(true)}
            className="bg-[#C29B38] hover:bg-[#B57C34] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Share Achievement</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#8C7138] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{pendingRequests.length}</div>
            <div className="text-xs text-slate-500 font-medium">Pending Inquiries</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{activeMenteesCount}</div>
            <div className="text-xs text-slate-500 font-medium">Active Mentees</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">{events.length}</div>
            <div className="text-xs text-slate-500 font-medium">Upcoming Events</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#0C1929] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {profile?.is_verified ? "Verified" : "Pending"}
            </div>
            <div className="text-xs text-slate-500 font-medium">Profile Verification</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Mentorship & Daily Thought */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* Pending Requests Queue */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E1D4] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-[#0C1929] text-lg flex items-center gap-2 font-serif">
                  <MessageSquare className="w-5 h-5 text-[#C29B38]" />
                  <span>Incoming Mentorship Inquiries</span>
                </h3>
                <p className="text-xs text-slate-500">Current students requesting 1-on-1 career guidance from you</p>
              </div>
              <Link to="/alumni/mentorship" className="text-xs font-bold text-[#8C7138] hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
                <p className="text-xs">Loading mentorship requests...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <EmptyState
                title="No mentorship requests yet"
                message="Incoming mentorship inquiries from GL Bajaj scholars will appear here."
              />
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D4] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#0C1929]">{req.student_name}</h4>
                        <p className="text-xs text-slate-500">{req.topic}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#8C7138] px-2.5 py-0.5 rounded-full border border-[#E7E1D4]">
                        Pending
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-[#E7E1D4] leading-relaxed italic">
                      "{req.message}"
                    </p>

                    <div className="flex items-center justify-end space-x-2 pt-1">
                      <button
                        onClick={() => handleRejectMentorship(req.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAcceptMentorship(req.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-xs flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Campus Events for Alumni */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E1D4] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#0C1929] flex items-center gap-2 font-serif">
                <Calendar className="w-5 h-5 text-[#C29B38]" />
                <span>Upcoming Campus Events & Reunions</span>
              </h3>
              <Link to="/alumni/events" className="text-xs font-bold text-[#8C7138] hover:underline">
                View All
              </Link>
            </div>

            {events.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No events scheduled at this moment.</p>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D4] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#8C7138] uppercase">{ev.event_type || "Event"}</span>
                      <span className="text-xs font-bold text-[#0C1929]">{ev.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#0C1929]">{ev.title}</h4>
                    <p className="text-xs text-slate-500">{ev.location ? `${ev.location} • ` : ""}{ev.time || ""}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sidebar: Daily Thought & Quick Links */}
        <div className="space-y-6">
          {/* Daily GLB Positivity & Motivation Card */}
          <DailyThoughtCard />

          {/* Quick Hub */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7E1D4] shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#0C1929] uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100 font-serif">
              Alumni Quick Actions
            </h4>
            <Link to="/alumni/career-journey" className="block py-2 px-3 rounded-xl hover:bg-[#FAF8F5] font-semibold text-slate-700 hover:text-[#0C1929] transition">
              Manage Career History & Milestones
            </Link>
            <Link to="/alumni/profile" className="block py-2 px-3 rounded-xl hover:bg-[#FAF8F5] font-semibold text-slate-700 hover:text-[#0C1929] transition">
              Update Professional Profile & Socials
            </Link>
            <Link to="/alumni/messages" className="block py-2 px-3 rounded-xl hover:bg-[#FAF8F5] font-semibold text-slate-700 hover:text-[#0C1929] transition">
              Open 1-on-1 Messages
            </Link>
          </div>

        </div>

      </div>

      <AchievementSubmitModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        onSubmit={handleAchievementSubmit}
      />
    </div>
  );
}
