import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  INITIAL_STUDENTS, 
  INITIAL_ALUMNI, 
  INITIAL_MENTORSHIPS, 
  INITIAL_NOTICES, 
  INITIAL_EVENTS, 
  INITIAL_ACHIEVEMENTS,
  INITIAL_IMPORT_HISTORY
} from "../../lib/mockData";
import { useToast } from "../../context/ToastContext";
import BroadcastModal from "../../components/admin/BroadcastModal";
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  FileSpreadsheet, 
  Bell, 
  Calendar, 
  Send, 
  Award,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const { addToast } = useToast();
  const [students] = useState(INITIAL_STUDENTS);
  const [alumni] = useState(INITIAL_ALUMNI);
  const [mentorships] = useState(INITIAL_MENTORSHIPS);
  const [notices] = useState(INITIAL_NOTICES);
  const [events] = useState(INITIAL_EVENTS);
  const [achievements] = useState(INITIAL_ACHIEVEMENTS);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const pendingAlumni = alumni.filter((a) => !a.is_verified);
  const pendingAchievements = achievements.filter((a) => !a.is_verified);
  const activeMentors = alumni.filter((a) => a.is_available_for_mentorship);

  function handleSendBroadcast(data) {
    addToast(`Broadcast "${data.title}" successfully sent to target alumni!`, "success");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-teal-900 via-glblue-750 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-teal-600/30">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-200 text-xs px-3 py-1 rounded-full font-bold border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-glgold" />
            <span>Admin Portal � G.L. Bajaj Central Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Alumni Relations & Ecosystem Overview
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage students, verify alumni records, supervise mentorship connections, broadcast college notices, and synchronize rosters via Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-glgold hover:bg-glgold-dark text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
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
        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Students</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{students.length}</div>
          <div className="text-[10px] text-teal-600 font-semibold mt-0.5">Enrolled Scholars</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Total Alumni</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{alumni.length}</div>
          <div className="text-[10px] text-glgold font-semibold mt-0.5">Graduated Scholars</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Active Mentors</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{activeMentors.length}</div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Open for Guidance</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Mentorships</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{mentorships.length}</div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">Active Requests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Pending Verify</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingAlumni.length + pendingAchievements.length}</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Requires Review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-sm">
          <div className="text-[11px] font-bold uppercase text-slate-400">Events Active</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{events.length}</div>
          <div className="text-[10px] text-purple-600 font-semibold mt-0.5">Reunions & Meets</div>
        </div>
      </div>

      {/* Quick Action Navigation Panels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/verification"
          className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:border-glgold/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-glgold transition">Verification Queue</h4>
            <p className="text-xs text-slate-500">{pendingAlumni.length} alumni & {pendingAchievements.length} achievements</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-glgold flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/alumni"
          className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:border-glgold/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-glgold transition">Alumni Directory</h4>
            <p className="text-xs text-slate-500">{alumni.length} registered graduates</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-glblue-750 flex items-center justify-center font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/students"
          className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:border-glgold/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-glgold transition">Student Directory</h4>
            <p className="text-xs text-slate-500">{students.length} current scholars</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/admin/notices"
          className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm hover:border-glgold/60 transition group flex items-center justify-between"
        >
          <div>
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-glgold transition">Publish Notices</h4>
            <p className="text-xs text-slate-500">{notices.length} active announcements</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {/* Main Grid: Mentorship Supervisions & Pending Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mentorship Activity Overview */}
        <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-glblue-750" />
              <span>Mentorship Connections & Activity</span>
            </h3>
            <span className="text-xs text-slate-400">{mentorships.length} total sessions</span>
          </div>

          <div className="space-y-3">
            {mentorships.map((req) => (
              <div key={req.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {req.student_name} <span className="text-slate-400 font-normal">({req.student_branch})</span>
                    <span className="text-glgold mx-1.5 font-bold">→</span>
                    {req.alumni_name}
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
        </div>

        {/* Pending Verifications Queue Preview */}
        <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Pending Verifications</span>
            </h3>
            <Link to="/admin/verification" className="text-xs font-bold text-glblue-750 hover:underline">
              Open Verification Desk →
            </Link>
          </div>

          {pendingAlumni.length === 0 && pendingAchievements.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              All registrations and achievements are verified! No pending items.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAlumni.map((alum) => (
                <div key={alum.id} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{alum.full_name}</h5>
                    <p className="text-[11px] text-slate-600">
                      Roll No: <strong>{alum.roll_number}</strong> � {alum.branch} ({alum.batch_year})
                    </p>
                    <p className="text-[11px] text-slate-500">{alum.current_designation} at {alum.current_company}</p>
                  </div>
                  <Link
                    to="/admin/verification"
                    className="bg-glgold text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm"
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
