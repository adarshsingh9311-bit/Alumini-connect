import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmptyState from "../../components/common/EmptyState";
import { MessageSquare, CheckCircle2, Clock, XCircle, Search, Loader2 } from "lucide-react";

export default function AdminMentorshipPage() {
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchMentorships() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mentorship_requests")
          .select("*, student:profiles!student_id(full_name, email), alumni:profiles!alumni_id(full_name, email)")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setMentorships(data.map(m => ({
            id: m.id,
            student_name: m.student?.full_name || "Scholar",
            student_email: m.student?.email || "",
            alumni_name: m.alumni?.full_name || "Mentor",
            alumni_email: m.alumni?.email || "",
            topic: m.topic || "Career Guidance",
            message: m.message,
            status: m.status,
            created_at: m.created_at
          })));
        }
      } catch (err) {
        console.warn("Error fetching mentorships:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMentorships();
  }, []);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Mentorship Activity & Supervision</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Monitor 1-on-1 mentorship pairings, response turnaround, and student guidance topic analytics.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7E1D4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, mentor, or topic..."
            className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#0C1929] focus:ring-2 focus:ring-[#C29B38] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:ring-2 focus:ring-[#C29B38] focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="accepted">Accepted & Active</option>
            <option value="pending">Pending Response</option>
            <option value="rejected">Declined</option>
          </select>
        </div>
      </div>

      {/* Mentorship Items */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading mentorship connections...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No mentorship connections found"
          message={
            mentorships.length === 0
              ? "No mentorship requests have been submitted across the platform yet."
              : "No requests match the current search filter."
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-2xl p-5 border border-[#E7E1D4] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-[#0C1929]">{m.student_name}</span>
                  <span className="text-[#8C7138] text-xs font-bold">→</span>
                  <span className="font-bold text-sm text-[#0C1929]">{m.alumni_name}</span>
                </div>
                <div className="text-xs text-[#8C7138] font-semibold">{m.topic}</div>
                <p className="text-xs text-slate-600 italic">"{m.message}"</p>
                <div className="text-[10px] text-slate-400">
                  Requested on {m.created_at ? new Date(m.created_at).toLocaleDateString() : ""}
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1 shrink-0 ${
                  m.status === "accepted"
                    ? "bg-emerald-100 text-emerald-800"
                    : m.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {m.status === "accepted" && <CheckCircle2 className="w-3 h-3" />}
                {m.status === "pending" && <Clock className="w-3 h-3" />}
                {m.status === "rejected" && <XCircle className="w-3 h-3" />}
                <span>{m.status}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
