import React, { useState } from "react";
import { INITIAL_MENTORSHIPS } from "../../lib/mockData";
import { MessageSquare, CheckCircle2, Clock, XCircle, Users, Search } from "lucide-react";

export default function AdminMentorshipPage() {
  const [mentorships] = useState(INITIAL_MENTORSHIPS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = mentorships.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      m.student_name.toLowerCase().includes(q) ||
      m.alumni_name.toLowerCase().includes(q) ||
      m.topic.toLowerCase().includes(q);
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Mentorship Activity & Supervision</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor 1-on-1 mentorship pairings, response turnaround, and student guidance topic analytics.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, mentor, or topic..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="accepted">Accepted & Active</option>
            <option value="pending">Pending</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">Active Mentorship Connections</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {filtered.length} requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Student Scholar</th>
                <th className="px-6 py-3.5">Alumnus Mentor</th>
                <th className="px-6 py-3.5">Guidance Topic</th>
                <th className="px-6 py-3.5">Date Created</th>
                <th className="px-6 py-3.5 text-right">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{m.student_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Roll: {m.student_roll} ({m.student_branch})</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-glblue-750">{m.alumni_name}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{m.topic}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        m.status === "accepted"
                          ? "bg-emerald-100 text-emerald-800"
                          : m.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
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
      </div>
    </div>
  );
}
