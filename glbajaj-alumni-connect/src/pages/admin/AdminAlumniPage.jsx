import React, { useState, useMemo } from "react";
import { INITIAL_ALUMNI } from "../../lib/mockData";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { useToast } from "../../context/ToastContext";
import { Briefcase, Search, CheckCircle2, XCircle, ShieldCheck, Mail, MapPin } from "lucide-react";

export default function AdminAlumniPage() {
  const [alumniList, setAlumniList] = useState(INITIAL_ALUMNI);
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all | verified | pending

  const filtered = useMemo(() => {
    return alumniList.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.full_name.toLowerCase().includes(q) ||
        a.roll_number.toLowerCase().includes(q) ||
        a.current_company.toLowerCase().includes(q) ||
        a.current_designation.toLowerCase().includes(q);

      const matchBranch = !branchFilter || a.branch === branchFilter;
      const matchBatch = !batchFilter || a.batch_year === batchFilter;
      const matchStatus =
        !statusFilter ||
        (statusFilter === "verified" ? a.is_verified : !a.is_verified);

      return matchSearch && matchBranch && matchBatch && matchStatus;
    });
  }, [alumniList, search, branchFilter, batchFilter, statusFilter]);

  function toggleVerification(id) {
    setAlumniList((prev) =>
      prev.map((alum) => {
        if (alum.id === id) {
          const nextState = !alum.is_verified;
          addToast(
            nextState
              ? `${alum.full_name} (${alum.roll_number}) verified successfully!`
              : `Verification revoked for ${alum.full_name}.`,
            nextState ? "success" : "info"
          );
          return { ...alum, is_verified: nextState };
        }
        return alum;
      })
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Directory & Records</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage verified graduates, review professional placements, and oversee institutional records.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll no, company, role..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>
        </div>
      </div>

      {/* Alumni Roster Table */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">Graduated Alumni Roster</h3>
          <span className="text-xs text-slate-500 font-medium">Showing {filtered.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Alumnus Name</th>
                <th className="px-6 py-3.5">Roll Number</th>
                <th className="px-6 py-3.5">Current Placement</th>
                <th className="px-6 py-3.5">Branch & Batch</th>
                <th className="px-6 py-3.5">Mentorship</th>
                <th className="px-6 py-3.5 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((alum) => (
                <tr key={alum.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{alum.full_name}</span>
                      {alum.is_verified && <CheckCircle2 className="w-3.5 h-3.5 text-glgold shrink-0" />}
                    </div>
                    <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-glblue-750" />
                      <span>{alum.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-glblue-750 border border-teal-200 px-2.5 py-1 rounded-md font-mono text-xs font-bold">
                      {alum.roll_number}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{alum.current_designation || "Graduate"}</div>
                    <div className="text-glblue-750 font-medium">{alum.current_company || "Company N/A"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-semibold mr-1">
                      {alum.branch}
                    </span>
                    <span className="text-slate-600 font-medium">Batch {alum.batch_year}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alum.is_available_for_mentorship
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {alum.is_available_for_mentorship ? "Active Mentor" : "Paused"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleVerification(alum.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                        alum.is_verified
                          ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                          : "bg-glgold hover:bg-glgold-dark text-white"
                      }`}
                    >
                      {alum.is_verified ? "Revoke Verify" : "Verify Alumnus"}
                    </button>
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
