import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Settings, Shield, Database, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [autoVerifyStudents, setAutoVerifyStudents] = useState(true);
  const [alumniSelfRegister, setAlumniSelfRegister] = useState(true);

  function handleSave(e) {
    e.preventDefault();
    addToast("Institutional ecosystem parameters updated successfully!", "success");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Ecosystem Administration Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure GL Bajaj platform security policies, academic parameters, and database synchronization rules.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="w-4 h-4 text-glblue-750" />
          <span>Institutional Policies & Identity Verification</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Academic Cycle</label>
            <input
              type="text"
              required
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">Enforce Strict Roll-Number Identity Check</div>
              <div className="text-[11px] text-slate-500">Only allow registrations where Roll Number matches pre-authorized college records.</div>
            </div>
            <input
              type="checkbox"
              checked={autoVerifyStudents}
              onChange={(e) => setAutoVerifyStudents(e.target.checked)}
              className="rounded text-glgold focus:ring-glgold cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">Allow Alumni "Request Verification" Fallback</div>
              <div className="text-[11px] text-slate-500">If historical records are not found, route registration to Admin Verification Queue.</div>
            </div>
            <input
              type="checkbox"
              checked={alumniSelfRegister}
              onChange={(e) => setAlumniSelfRegister(e.target.checked)}
              className="rounded text-glgold focus:ring-glgold cursor-pointer"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="bg-glgold hover:bg-glgold-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
