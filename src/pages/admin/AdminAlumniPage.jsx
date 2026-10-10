import React, { useState, useEffect, useMemo } from "react";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/common/EmptyState";
import { Briefcase, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function AdminAlumniPage() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // all | verified | pending

  useEffect(() => {
    async function fetchAlumni() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("alumni")
          .select("*, profiles(*)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setAlumniList(data.map(a => ({
            id: a.id,
            user_id: a.user_id,
            full_name: a.profiles?.full_name || "Alumnus",
            email: a.profiles?.email || "",
            roll_number: a.roll_number,
            branch: a.branch,
            batch_year: a.graduation_year || a.batch_year,
            current_company: a.current_company || "",
            current_designation: a.current_designation || "",
            is_verified: a.is_verified,
            is_available_for_mentorship: a.is_available_for_mentorship
          })));
        }
      } catch (err) {
        console.warn("Failed to load alumni records:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlumni();
  }, []);

  const filtered = useMemo(() => {
    return alumniList.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        a.full_name?.toLowerCase().includes(q) ||
        a.roll_number?.toLowerCase().includes(q) ||
        a.current_company?.toLowerCase().includes(q) ||
        a.current_designation?.toLowerCase().includes(q);

      const matchBranch = !branchFilter || a.branch === branchFilter;
      const matchBatch = !batchFilter || a.batch_year === batchFilter;
      const matchStatus =
        !statusFilter ||
        (statusFilter === "verified" ? a.is_verified : !a.is_verified);

      return matchSearch && matchBranch && matchBatch && matchStatus;
    });
  }, [alumniList, search, branchFilter, batchFilter, statusFilter]);

  async function toggleVerification(id) {
    const targetAlum = alumniList.find(a => a.id === id);
    if (!targetAlum) return;

    const nextState = !targetAlum.is_verified;

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("alumni")
          .update({ is_verified: nextState })
          .eq("id", id);
      } catch (err) {
        console.warn("Failed to toggle verification:", err);
      }
    }

    setAlumniList((prev) =>
      prev.map((alum) =>
        alum.id === id ? { ...alum, is_verified: nextState } : alum
      )
    );

    addToast(
      nextState
        ? `${targetAlum.full_name} verified successfully!`
        : `Verification revoked for ${targetAlum.full_name}.`,
      nextState ? "success" : "info"
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-serif">Alumni Roster & Verification</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review, audit and manage verified graduate credentials across all GL Bajaj batches and academic branches.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-[#D9DDE3] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alumni by name, roll, company, role..."
            className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-[#202124] focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs text-[#202124] focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24] focus:outline-none"
          >
            <option value="">All Branches</option>
            {BRANCH_CODES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs text-[#202124] focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24] focus:outline-none"
          >
            <option value="">All Batches</option>
            {BATCH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs text-[#202124] focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Alumni Table */}
      {loading ? (
        <div className="py-20 text-center text-[#667085]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7A1F24] mb-3" />
          <p className="text-sm">Loading alumni records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No alumni records found"
          message={
            alumniList.length === 0
              ? "No alumni records currently exist in the database. Use Excel/CSV import to upload alumni data."
              : "No alumni match your search or filter parameters."
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-[#D9DDE3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F3EA] text-[#667085] font-bold uppercase tracking-wider border-b border-[#D9DDE3]">
                <tr>
                  <th className="p-4">Alumnus Name</th>
                  <th className="p-4">Roll Number</th>
                  <th className="p-4">Branch & Batch</th>
                  <th className="p-4">Current Organization & Role</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DDE3]">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F7F3EA]/50 transition">
                    <td className="p-4 font-bold text-[#202124] font-serif">{a.full_name}</td>
                    <td className="p-4 font-mono font-bold text-[#7A1F24]">{a.roll_number || "—"}</td>
                    <td className="p-4 text-[#667085]">{a.branch} (Batch {a.batch_year})</td>
                    <td className="p-4 text-[#202124]">
                      {a.current_designation ? `${a.current_designation} at ` : ""}{a.current_company || "GLB Alumnus"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          a.is_verified
                            ? "bg-[#2E6B4A]/10 text-[#2E6B4A]"
                            : "bg-[#A66A00]/10 text-[#A66A00]"
                        }`}
                      >
                        {a.is_verified ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{a.is_verified ? "Verified" : "Pending"}</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleVerification(a.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          a.is_verified
                            ? "bg-[#B42318]/10 text-[#B42318] hover:bg-[#B42318]/20"
                            : "bg-[#2E6B4A] text-white hover:bg-[#235338]"
                        }`}
                      >
                        {a.is_verified ? "Revoke" : "Verify Badge"}
                      </button>
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
