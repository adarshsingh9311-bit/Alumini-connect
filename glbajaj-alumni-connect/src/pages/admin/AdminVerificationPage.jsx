import React, { useState } from "react";
import { INITIAL_ALUMNI, INITIAL_ACHIEVEMENTS } from "../../lib/mockData";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, XCircle, Award, Briefcase, ShieldCheck, GraduationCap } from "lucide-react";

export default function AdminVerificationPage() {
  const { addToast } = useToast();
  const [alumniList, setAlumniList] = useState(INITIAL_ALUMNI);
  const [achievements, setAchievements] = useState(INITIAL_ACHIEVEMENTS);
  const [activeTab, setActiveTab] = useState("alumni"); // alumni | achievements

  const pendingAlumni = alumniList.filter((a) => !a.is_verified);
  const pendingAchievements = achievements.filter((ach) => !ach.is_verified);

  function verifyAlumni(id) {
    setAlumniList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_verified: true } : a))
    );
    addToast("Alumnus identity and roll number verified! Badge granted.", "success");
  }

  function rejectAlumni(id) {
    setAlumniList((prev) => prev.filter((a) => a.id !== id));
    addToast("Alumni registration rejected due to record mismatch.", "info");
  }

  function verifyAchievement(id) {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, is_verified: true } : ach))
    );
    addToast("Achievement verified and published to the student showcase!", "success");
  }

  function rejectAchievement(id) {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
    addToast("Achievement submission rejected.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Verification Desk</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review alumni registrations against college roll numbers, and audit milestone submissions before public showcase.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("alumni")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "alumni"
              ? "bg-glblue-750 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Alumni Registrations ({pendingAlumni.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "achievements"
              ? "bg-glgold text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievements Queue ({pendingAchievements.length})</span>
        </button>
      </div>

      {/* Tab 1: Alumni Verification */}
      {activeTab === "alumni" && (
        <div className="space-y-4">
          {pendingAlumni.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-teal-100 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-base">All Alumni Records Verified</h3>
              <p className="text-xs text-slate-400 mt-1">No pending registrations waiting in the queue.</p>
            </div>
          ) : (
            pendingAlumni.map((alum) => (
              <div
                key={alum.id}
                className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 text-base">{alum.full_name}</h4>
                    <span className="bg-teal-50 text-glblue-750 font-mono text-xs font-bold px-2.5 py-0.5 rounded border border-teal-200">
                      Roll: {alum.roll_number}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {alum.branch} Department • Graduated Batch {alum.batch_year}
                  </p>
                  <p className="text-xs text-slate-500">
                    Current: <strong className="text-slate-800">{alum.current_designation}</strong> at <strong className="text-slate-800">{alum.current_company}</strong> ({alum.location})
                  </p>
                  <div className="text-[11px] text-slate-400">Email: {alum.email}</div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={() => rejectAlumni(alum.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition"
                  >
                    Reject Record
                  </button>
                  <button
                    onClick={() => verifyAlumni(alum.id)}
                    className="flex-1 md:flex-none bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-sm flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Verify</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Achievements Verification */}
      {activeTab === "achievements" && (
        <div className="space-y-4">
          {pendingAchievements.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-teal-100 text-center text-slate-500 text-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-base">All Achievements Audited</h3>
              <p className="text-xs text-slate-400 mt-1">No pending accolades requiring approval.</p>
            </div>
          ) : (
            pendingAchievements.map((ach) => (
              <div
                key={ach.id}
                className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-slate-900 text-base">{ach.title}</h4>
                    <span className="text-xs text-slate-400">({ach.date})</span>
                  </div>
                  <p className="text-xs font-semibold text-glblue-750">
                    Submitted by: {ach.alumni_name} ({ach.alumni_batch})
                  </p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl max-w-xl">
                    "{ach.description}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={() => rejectAchievement(ach.id)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => verifyAchievement(ach.id)}
                    className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-sm flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Feature</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
