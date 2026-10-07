import React, { useState, useEffect, useMemo } from "react";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmptyState from "../../components/common/EmptyState";
import { GraduationCap, Search, Loader2 } from "lucide-react";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("students")
          .select("*, profiles(*)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setStudents(data.map(s => ({
            id: s.id,
            user_id: s.user_id,
            full_name: s.profiles?.full_name || "Scholar",
            email: s.profiles?.email || "",
            roll_number: s.roll_number,
            branch: s.branch,
            batch_year: s.batch_year,
            skills: Array.isArray(s.skills) ? s.skills : [],
            interests: s.interests
          })));
        }
      } catch (err) {
        console.warn("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.full_name?.toLowerCase().includes(q) ||
        s.roll_number?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q);

      const matchBranch = !branchFilter || s.branch === branchFilter;
      const matchBatch = !batchFilter || s.batch_year === batchFilter;

      return matchSearch && matchBranch && matchBatch;
    });
  }, [students, search, branchFilter, batchFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Student Directory Management</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Manage enrolled scholars, roll-number credentials, branch allocations, and academic records.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7E1D4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, roll number, or email..."
            className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#0C1929] focus:ring-2 focus:ring-[#C29B38] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:ring-2 focus:ring-[#C29B38] focus:outline-none"
          >
            <option value="">All Branches</option>
            {BRANCH_CODES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:ring-2 focus:ring-[#C29B38] focus:outline-none"
          >
            <option value="">All Batches</option>
            {BATCH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading student records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No student records available"
          message={
            students.length === 0
              ? "No student records found in the database. Use Excel/CSV import to enroll student rosters."
              : "No students match your filter criteria."
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E7E1D4] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-slate-600 font-bold uppercase tracking-wider border-b border-[#E7E1D4]">
                <tr>
                  <th className="p-4">Scholar Name</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Branch & Batch</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Key Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E1D4]">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="p-4 font-bold text-[#0C1929]">{s.full_name}</td>
                    <td className="p-4 font-mono font-bold text-[#8C7138]">{s.roll_number}</td>
                    <td className="p-4 text-slate-600">{s.branch} (Batch {s.batch_year})</td>
                    <td className="p-4 text-slate-500 font-mono">{s.email}</td>
                    <td className="p-4 text-slate-500">
                      {s.skills?.length > 0 ? s.skills.slice(0, 3).join(", ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
