import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { Bell, Calendar, Search, Loader2, ArrowRight } from "lucide-react";

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeNotice, setActiveNotice] = useState(null);

  useEffect(() => {
    async function fetchNotices() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setNotices(data);
        }
      } catch (err) {
        console.warn("Failed to load notices:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title?.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q) ||
      n.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Official College Notices</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Stay updated with official communications from Dean Alumni Relations, Training & Placement Cell, and Departments.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices by keyword or department..."
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E7E1D4] rounded-xl text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38] shadow-xs"
        />
      </div>

      {/* Notices List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading college notices...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <EmptyState
          title="No notices available"
          message={
            notices.length === 0
              ? "No official college notices have been issued yet."
              : "No notices match your search term."
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNotice(notice)}
              className="bg-white rounded-2xl p-5 border border-[#E7E1D4] hover:border-[#C29B38]/60 shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#8C7138] px-2.5 py-1 rounded-md border border-[#E7E1D4]">
                  {notice.category || "General"}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.created_at ? new Date(notice.created_at).toLocaleDateString() : ""}
                </span>
              </div>

              <h3 className="font-bold text-[#0C1929] text-base font-serif">{notice.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {notice.content}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-medium text-[#0C1929]">
                  Audience: <strong>{notice.target_audience || "All"}</strong>
                </span>
                <span className="text-[#8C7138] font-bold flex items-center gap-1 hover:underline">
                  <span>Read Complete Notice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notice Detail Modal */}
      <Modal
        isOpen={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        title="College Notice Details"
        maxWidth="max-w-xl"
      >
        {activeNotice && (
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-[#8C7138] bg-amber-50 px-2.5 py-1 rounded border border-[#E7E1D4]">
                {activeNotice.category || "General"}
              </span>
              <span className="text-xs text-slate-400">
                {activeNotice.created_at ? new Date(activeNotice.created_at).toLocaleDateString() : ""}
              </span>
            </div>

            <h3 className="font-extrabold text-[#0C1929] text-lg leading-snug font-serif">
              {activeNotice.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-700 bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E1D4] leading-relaxed whitespace-pre-line">
              {activeNotice.content}
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Target Audience: <strong className="text-slate-800 capitalize">{activeNotice.target_audience || "All Students & Alumni"}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
