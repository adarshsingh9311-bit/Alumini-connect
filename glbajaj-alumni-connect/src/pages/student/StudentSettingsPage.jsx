import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Settings, Lock, Bell, Shield, Save } from "lucide-react";

export default function StudentSettingsPage() {
  const { addToast } = useToast();
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [mentorshipAlerts, setMentorshipAlerts] = useState(true);

  function handleSavePassword(e) {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      addToast("New passwords do not match.", "error");
      return;
    }
    addToast("Account password updated successfully!", "success");
    setPasswords({ current: "", newPass: "", confirm: "" });
  }

  function handleSavePreferences(e) {
    e.preventDefault();
    addToast("Notification & privacy preferences saved!", "success");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Account Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your security credentials and mentorship alert preferences.
        </p>
      </div>

      {/* Password Change Card */}
      <form onSubmit={handleSavePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-4 h-4 text-glblue-750" />
          <span>Change Password</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password</label>
            <input
              type="password"
              required
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-glblue-750 hover:bg-teal-900 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-sm"
          >
            Update Password
          </button>
        </div>
      </form>

      {/* Notifications Preferences */}
      <form onSubmit={handleSavePreferences} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
          <Bell className="w-4 h-4 text-glgold" />
          <span>Notification & Alert Preferences</span>
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">Mentorship Acceptance Alerts</div>
              <div className="text-[11px] text-slate-500">Receive instant alerts when an alumnus accepts your mentorship request.</div>
            </div>
            <input
              type="checkbox"
              checked={mentorshipAlerts}
              onChange={(e) => setMentorshipAlerts(e.target.checked)}
              className="rounded text-glgold focus:ring-glgold cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
            <div>
              <div className="text-xs font-bold text-slate-900">New Opportunities & College Broadcasts</div>
              <div className="text-[11px] text-slate-500">Get notified when new jobs, internships, or college notices are published.</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded text-glgold focus:ring-glgold cursor-pointer"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-glgold hover:bg-glgold-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
