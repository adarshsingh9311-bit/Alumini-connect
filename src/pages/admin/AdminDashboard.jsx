import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import BroadcastModal from "../../components/admin/BroadcastModal";
import EmptyState from "../../components/common/EmptyState";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  FileSpreadsheet, 
  Calendar, 
  Send, 
  Clock, 
  TrendingUp, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

export default function AdminDashboard() {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  useEffect(() => {
    async function loadAdminData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [studentsRes, alumniRes, mentorshipRes, eventsRes, achRes] = await Promise.all([
          supabase.from("students").select("*, profiles(*)"),
          supabase.from("alumni").select("*, profiles(*)"),
          supabase.from("mentorship_requests").select("*, student:profiles!student_id(full_name), alumni:profiles!alumni_id(full_name)").order("created_at", { ascending: false }).limit(6),
          supabase.from("events").select("*"),
          supabase.from("achievements").select("*").eq("is_approved", false)
        ]);

        if (studentsRes.data) setStudents(studentsRes.data);
        if (alumniRes.data) setAlumni(alumniRes.data);
        if (mentorshipRes.data) setMentorships(mentorshipRes.data);
        if (eventsRes.data) setEvents(eventsRes.data);
        if (achRes.data) setAchievements(achRes.data);

      } catch (err) {
        console.warn("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const pendingAlumni = alumni.filter((a) => !a.is_verified);
  const activeMentors = alumni.filter((a) => a.is_available_for_mentorship);

  async function handleSendBroadcast(data) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("notices").insert({
          title: data.title,
          content: data.message,
          category: data.category || "Official Broadcast",
          priority: "high",
          target_audience: data.targetAudience || "all"
        });
        addToast(`Broadcast "${data.title}" successfully published!`, "success");
        setIsBroadcastModalOpen(false);
        return;
      } catch (err) {
        console.warn("Error inserting broadcast notice:", err);
      }
    }
    addToast(`Broadcast "${data.title}" successfully sent!`, "success");
    setIsBroadcastModalOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#0C1929] via-[#1A2C42] to-[#0C1929] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-[#E7E1D4]/20">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-[#C29B38]/30 text-amber-200 text-xs px-3 py-1 rounded-full font-bold border border-[#C29B38]/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Admin Portal • G.L. Bajaj Central Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
            Alumni Relations & Ecosystem Overview
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage students, verify alumni records, supervise mentorship connections, broadcast college notices, and synchronize rosters via Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-[#C29B38] hover:bg-[#B57C34] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Wishes / Notice</span>
          </button>
          <Link
            to="/admin/import"
            className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition border border-white/20 flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Excel / CSV</span>
          </Link>
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Students</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{students.length}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Enrolled Scholars</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Alumni</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{alumni.length}</div>
          <div className="text-[10px] text-[#8C7138] font-semibold mt-0.5">Graduated Scholars</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Active Mentors</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeMentors.length}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Open for Guidance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Mentorships</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{mentorships.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Active Requests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Pending Verify</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingAlumni.length + achievements.length}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Requires Review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E7E1D4] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400">Events Active</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{events.length}</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Reunions & Meets</div>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/verification"
          className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#8C7138] transition font-serif">Verification Queue</h4>
            <p className="text-xs text-slate-500">{pendingAlumni.length} alumni & {achievements.length} achievements</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#8C7138] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/alumni"
          className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#8C7138] transition font-serif">Alumni Directory</h4>
            <p className="text-xs text-slate-500">{alumni.length} registered graduates</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0C1929] flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/students"
          className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#8C7138] transition font-serif">Student Directory</h4>
            <p className="text-xs text-slate-500">{students.length} current scholars</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/daily-thoughts"
          className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#8C7138] transition font-serif">Daily GLB Thoughts</h4>
            <p className="text-xs text-slate-500">Manage daily thoughts & quotes</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Main Grid: Mentorship Stream & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mentorship Requests Overview */}
        <div className="bg-white rounded-3xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-serif">
              <TrendingUp className="w-4 h-4 text-[#8C7138]" />
              <span>Mentorship Connections & Activity</span>
            </h3>
            <Link to="/admin/mentorship" className="text-xs font-bold text-[#8C7138] hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
              <p className="text-xs">Loading mentorship activity...</p>
            </div>
          ) : mentorships.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No mentorship requests recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {mentorships.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      {req.student?.full_name || "Student"}
                      <span className="text-[#8C7138] mx-1.5 font-bold">→</span>
                      {req.alumni?.full_name || "Mentor"}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{req.topic}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      req.status === "accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : req.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Verifications Queue Preview */}
        <div className="bg-white rounded-3xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 font-serif">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Verifications</span>
            </h3>
            <Link to="/admin/verification" className="text-xs font-bold text-[#8C7138] hover:underline flex items-center gap-1">
              <span>Open Verification Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C29B38] mb-2" />
              <p className="text-xs">Checking verification queue...</p>
            </div>
          ) : pendingAlumni.length === 0 && achievements.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              All registrations and achievements are verified! No pending items.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAlumni.slice(0, 4).map((alum) => (
                <div key={alum.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{alum.profiles?.full_name || "Alumnus"}</h5>
                    <p className="text-[11px] text-slate-600">
                      Roll No: <strong>{alum.roll_number}</strong> • {alum.branch} ({alum.graduation_year || alum.batch_year})
                    </p>
                    <p className="text-[11px] text-slate-500">{alum.current_designation} {alum.current_company ? `at ${alum.current_company}` : ""}</p>
                  </div>
                  <Link
                    to="/admin/verification"
                    className="bg-[#C29B38] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs hover:bg-[#B57C34]"
                  >
                    Verify
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSendBroadcast={handleSendBroadcast}
      />
    </div>
  );
}
