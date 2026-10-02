import React, { useState, useMemo } from "react";
import { INITIAL_STUDENTS } from "../../lib/mockData";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { GraduationCap, Search, Filter, Mail, Phone } from "lucide-react";

export default function AdminStudentsPage() {
  const [students] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.full_name.toLowerCase().includes(q) ||
        s.roll_number.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q);

      const matchBranch = !branchFilter || s.branch === branchFilter;
      const matchBatch = !batchFilter || s.batch_year === batchFilter;

      return matchSearch && matchBranch && matchBatch;
    });
  }, [students, search, branchFilter, batchFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Directory Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage enrolled scholars, roll-number credentials, branch allocations, and academic records.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          >
            <option value="">All Branches</option>
            {BRANCH_CODES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          >
            <option value="">All Batches</option>
            {BATCH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">Enrolled Student Roster</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {filtered.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Student Name & Contact</th>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Branch & Batch</th>
                <th className="px-6 py-3.5">Academic Progress</th>
                <th className="px-6 py-3.5">Skills & Interests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{s.full_name}</div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-glblue-750" />
                      <span>{s.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-glblue-750 border border-teal-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
                      {s.roll_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-semibold mr-1">
                      {s.branch}
                    </span>
                    <span className="text-slate-600 font-medium">Batch {s.batch_year}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {s.academic_info || "B.Tech Undergrad"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {s.skills?.map((sk, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
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
