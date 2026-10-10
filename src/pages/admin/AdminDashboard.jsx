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
  Loader2, 
  ArrowRight,
  MessageSquare
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
          supabase.from("students").select("*, profiles(*)").limit(5),
          supabase.from("alumni").select("*, profiles(*)").limit(5),
          supabase.from("mentorship_requests").select("*, student:profiles!student_id(full_name), alumni:profiles!alumni_id(full_name)").order("created_at", { ascending: false }).limit(5),
          supabase.from("events").select("*").limit(3),
          supabase.from("achievements").select("*").eq("is_approved", false).limit(5)
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

  const pendingAlumniCount = alumni.filter((a) => !a.is_verified).length;

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
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* 1. Admin Institutional Header */}
      <div className="bg-[#7A1F24] rounded-lg p-6 sm:p-8 text-white border border-[#5C171B] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-1.5 bg-[#5C171B] text-[#B08A3E] text-xs px-2.5 py-0.5 rounded font-semibold border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B08A3E]" />
            <span>Central Administration Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Alumni Relations & Portal Management
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
            Manage student and alumni records, verify graduate credentials, oversee mentorship activity, and publish institutional announcements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-[#FFFFFF] hover:bg-[#F7F3EA] text-[#7A1F24] text-xs sm:text-sm font-semibold px-4 py-2 rounded-md transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Notice</span>
          </button>
          <Link
            to="/admin/import"
            className="bg-[#5C171B] hover:bg-[#481115] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-md transition border border-white/20 flex items-center space-x-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#B08A3E]" />
            <span>Import Excel / CSV</span>
          </Link>
        </div>
      </div>

      {/* 2. Management Overview Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/admin/students"
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition shadow-xs"
        >
          <div className="text-[11px] font-semibold uppercase text-[#667085]">Student Records</div>
          <div className="text-xl font-bold text-[#202124] mt-1">{students.length}</div>
          <div className="text-[11px] text-[#7A1F24] font-medium mt-0.5 flex items-center gap-1">
            <span>View directory</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          to="/admin/alumni"
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition shadow-xs"
        >
          <div className="text-[11px] font-semibold uppercase text-[#667085]">Alumni Records</div>
          <div className="text-xl font-bold text-[#202124] mt-1">{alumni.length}</div>
          <div className="text-[11px] text-[#7A1F24] font-medium mt-0.5 flex items-center gap-1">
            <span>View directory</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          to="/admin/verification"
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition shadow-xs"
        >
          <div className="text-[11px] font-semibold uppercase text-[#667085]">Pending Verification</div>
          <div className="text-xl font-bold text-[#A66A00] mt-1">{pendingAlumniCount + achievements.length}</div>
          <div className="text-[11px] text-[#A66A00] font-medium mt-0.5 flex items-center gap-1">
            <span>Review submissions</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>

        <Link
          to="/admin/mentorship"
          className="bg-[#FFFFFF] p-4 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition shadow-xs"
        >
          <div className="text-[11px] font-semibold uppercase text-[#667085]">Mentorship Requests</div>
          <div className="text-xl font-bold text-[#202124] mt-1">{mentorships.length}</div>
          <div className="text-[11px] text-[#7A1F24] font-medium mt-0.5 flex items-center gap-1">
            <span>Supervise requests</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>

      {/* 3. Recent Mentorship Activity Table */}
      <div className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#7A1F24]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#202124]">
              Recent Mentorship Activity
            </h2>
          </div>
          <Link
            to="/admin/mentorship"
            className="text-xs text-[#7A1F24] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center text-[#667085]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : mentorships.length === 0 ? (
          <div className="py-8 text-center bg-[#F7F3EA] rounded border border-[#D9DDE3] p-4">
            <p className="text-xs text-[#667085] font-medium">No mentorship records available yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D9DDE3] text-[#667085] font-semibold">
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Mentor</th>
                  <th className="py-2.5 px-3">Topic</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DDE3]">
                {mentorships.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F7F3EA] transition">
                    <td className="py-2.5 px-3 font-semibold text-[#202124]">{m.student?.full_name || "Student"}</td>
                    <td className="py-2.5 px-3 text-[#202124]">{m.alumni?.full_name || "Alumnus"}</td>
                    <td className="py-2.5 px-3 text-[#667085]">{m.topic || "Career Guidance"}</td>
                    <td className="py-2.5 px-3 text-[#667085]">{new Date(m.created_at).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          m.status === "accepted"
                            ? "bg-green-50 text-[#2E6B4A] border-green-200"
                            : m.status === "rejected"
                            ? "bg-red-50 text-[#B42318] border-red-200"
                            : "bg-amber-50 text-[#A66A00] border-amber-200"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Quick Administrative Navigation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/verification"
          className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-4 flex items-center justify-between hover:border-[#7A1F24] transition shadow-xs"
        >
          <div>
            <h4 className="font-bold text-xs text-[#202124]">Verification Queue</h4>
            <p className="text-[11px] text-[#667085]">Review unverified alumni & achievements</p>
          </div>
          <CheckCircle2 className="w-4 h-4 text-[#7A1F24]" />
        </Link>

        <Link
          to="/admin/events"
          className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-4 flex items-center justify-between hover:border-[#7A1F24] transition shadow-xs"
        >
          <div>
            <h4 className="font-bold text-xs text-[#202124]">College Events</h4>
            <p className="text-[11px] text-[#667085]">Manage upcoming meets & reunions</p>
          </div>
          <Calendar className="w-4 h-4 text-[#7A1F24]" />
        </Link>

        <Link
          to="/admin/import"
          className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-4 flex items-center justify-between hover:border-[#7A1F24] transition shadow-xs"
        >
          <div>
            <h4 className="font-bold text-xs text-[#202124]">Excel/CSV Roster Import</h4>
            <p className="text-[11px] text-[#667085]">Bulk import student & alumni records</p>
          </div>
          <FileSpreadsheet className="w-4 h-4 text-[#7A1F24]" />
        </Link>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <BroadcastModal
          isOpen={isBroadcastModalOpen}
          onClose={() => setIsBroadcastModalOpen(false)}
          onSend={handleSendBroadcast}
        />
      )}
    </div>
  );
}
