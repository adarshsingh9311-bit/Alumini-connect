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
        addToast(`Mentorship status updated to ${next ? "Available" : "Busy"}.`, "success");
      } catch (err) {
        console.warn("Failed to update mentorship status:", err);
      }
    }
  }

  async function handleAcceptRequest(requestId) {
    if (user?.id && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({ status: "accepted" })
          .eq("id", requestId);
      } catch (err) {
        console.warn("Error updating request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) => (m.id === requestId ? { ...m, status: "accepted" } : m))
    );
    addToast("Mentorship request accepted! Direct messaging is now enabled.", "success");
  }

  async function handleDeclineRequest(requestId) {
    if (user?.id && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("mentorship_requests")
          .update({ status: "rejected" })
          .eq("id", requestId);
      } catch (err) {
        console.warn("Error declining request:", err);
      }
    }

    setMentorships((prev) =>
      prev.map((m) =>
        m.id === requestId
          ? { ...m, status: "rejected", response_note: "Currently unavailable for this topic." }
          : m
      )
    );
    addToast("Mentorship request declined.", "info");
  }

  async function handleAchievementSubmit(achData) {
    if (user?.id && isSupabaseConfigured && supabase) {
      try {
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
  const acceptedRequests = mentorships.filter((m) => m.status === "accepted");

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. Alumni Welcome Card */}
      <div className="bg-[#7A1F24] rounded-lg p-6 sm:p-8 text-white border border-[#5C171B] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-lg bg-[#5C171B] text-white flex items-center justify-center font-bold text-xl border border-white/20 shrink-0">
            {(profile?.full_name || "A")[0].toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-[#5C171B] text-[#B08A3E] text-[11px] px-2.5 py-0.5 rounded font-semibold border border-white/10">
              <Briefcase className="w-3 h-3" />
              <span>Alumni Portal • {profile?.graduation_year ? `Batch ${profile.graduation_year}` : (profile?.branch || "GLB")}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back to GL Bajaj.
            </h1>
            <p className="text-white/80 text-xs sm:text-sm">
              {profile?.full_name || "Alumnus"}
              {profile?.current_designation ? ` • ${profile.current_designation}` : ""}
              {profile?.current_company ? ` at ${profile.current_company}` : ""}
            </p>
          </div>
        </div>

        {/* Mentorship Toggle */}
        <div className="flex items-center space-x-3 bg-[#5C171B] p-2.5 px-3.5 rounded-lg border border-white/10">
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-white/70">Mentorship Status</div>
            <div className="text-xs font-semibold text-white">
              {isAvailable ? "Available to Mentor" : "Currently Unavailable"}
            </div>
          </div>
          <button
            onClick={toggleAvailability}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
              isAvailable
                ? "bg-[#2E6B4A] text-white hover:bg-[#25573C]"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {isAvailable ? "Active" : "Paused"}
          </button>
        </div>
      </div>

      {/* 2. Daily GLB Thought */}
      <DailyThoughtCard />

      {/* 3. Pending Mentorship Requests & Connected Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Requests */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#7A1F24]" />
              <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
                Pending Mentorship Requests ({pendingRequests.length})
              </h2>
            </div>
            <Link
              to="/alumni/mentorship"
              className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center text-[#667085]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
              <p className="text-xs text-[#667085] font-medium">No pending mentorship requests at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-[#202124]">{req.student_name}</h4>
                      <p className="text-[11px] font-semibold text-[#7A1F24]">{req.topic}</p>
                    </div>
                    <span className="text-[10px] text-[#667085]">
                      {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085] bg-white p-2.5 rounded border border-[#D9DDE3] leading-relaxed">
                    "{req.message}"
                  </p>
                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="px-3 py-1.5 rounded-md border border-[#D9DDE3] bg-white hover:bg-slate-50 text-[#667085] text-xs font-semibold transition cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="px-3 py-1.5 rounded-md bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold transition cursor-pointer"
                    >
                      Accept & Mentor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Connected Students / Active Mentees */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#7A1F24]" />
              <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
                Connected Students ({acceptedRequests.length})
              </h2>
            </div>
            <Link
              to="/alumni/messages"
              className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
            >
              <span>Messages</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center text-[#667085]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : acceptedRequests.length === 0 ? (
            <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
              <p className="text-xs text-[#667085] font-medium">No connected students yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {acceptedRequests.map((req) => (
                <div key={req.id} className="p-3 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-semibold text-[#202124]">{req.student_name}</h4>
                    <p className="text-[11px] text-[#667085]">{req.topic}</p>
                  </div>
                  <Link
                    to="/alumni/messages"
                    className="px-2.5 py-1 rounded bg-[#FFFFFF] hover:bg-[#F7F3EA] text-[#7A1F24] border border-[#D9DDE3] font-semibold text-[11px] transition"
                  >
                    Open Chat
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Upcoming Events & Experience Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#7A1F24]" />
              <h2 className="text-sm font-bold text-[#202124] uppercase tracking-wide">
                Alumni Events & Reunions
              </h2>
            </div>
            <Link
              to="/alumni/events"
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
          ) : events.length === 0 ? (
            <div className="py-8 text-center bg-[#F7F3EA] rounded-md border border-[#D9DDE3] p-6">
              <p className="text-xs text-[#667085] font-medium">No upcoming alumni events scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {events.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-md border border-[#D9DDE3] bg-[#F7F3EA] space-y-1.5">
                  <div className="text-[10px] text-[#7A1F24] font-semibold uppercase">{ev.event_type || "Event"}</div>
                  <h4 className="font-bold text-xs text-[#202124]">{ev.title}</h4>
                  <div className="text-[11px] text-[#667085] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{ev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Achievement Action Card */}
        <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-[#7A1F24] mb-2">
              <Award className="w-4 h-4" />
              <h3 className="font-bold text-xs uppercase tracking-wide">Share Achievement</h3>
            </div>
            <p className="text-xs text-[#667085] leading-relaxed">
              Promoted, published a paper, or founded a startup? Submit your career milestones to the official GL Bajaj alumni spotlight.
            </p>
          </div>
          <button
            onClick={() => setIsAchievementModalOpen(true)}
            className="w-full bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold py-2.5 rounded-md transition shadow-xs cursor-pointer text-center"
          >
            Submit Milestone
          </button>
        </div>
      </div>

      {/* Achievement Submission Modal */}
      {isAchievementModalOpen && (
        <AchievementSubmitModal
          isOpen={isAchievementModalOpen}
          onClose={() => setIsAchievementModalOpen(false)}
          onSubmit={handleAchievementSubmit}
        />
      )}
    </div>
  );
}
