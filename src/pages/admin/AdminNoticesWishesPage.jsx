import React, { useState, useEffect } from "react";
import { NOTICE_TARGETS } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import BroadcastModal from "../../components/admin/BroadcastModal";
import EmptyState from "../../components/common/EmptyState";
import { Bell, Plus, Trash2, Send, Loader2 } from "lucide-react";

export default function AdminNoticesWishesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    category: "Reunion",
    target_audience: "all"
  });

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

  async function handleCreateNotice(e) {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("notices")
          .insert({
            title: newNotice.title,
            content: newNotice.content,
            category: newNotice.category,
            target_audience: newNotice.target_audience
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setNotices([data, ...notices]);
      } catch (err) {
        addToast(err.message || "Failed to create notice.", "error");
        return;
      }
    } else {
      const item = {
        id: "not-" + Date.now(),
        ...newNotice,
        created_at: new Date().toISOString()
      };
      setNotices([item, ...notices]);
    }

    addToast("College notice officially published!", "success");
    setIsNoticeModalOpen(false);
    setNewNotice({
      title: "",
      content: "",
      category: "Reunion",
      target_audience: "all"
    });
  }

  async function handleSendBroadcast(data) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: inserted, error } = await supabase.from("notices").insert({
          title: data.title,
          content: data.message,
          category: data.category || "Broadcast",
          priority: "high",
          target_audience: data.targetAudience || "all"
        }).select().single();

        if (!error && inserted) {
          setNotices([inserted, ...notices]);
        }
      } catch (err) {
        console.warn("Broadcast insert error:", err);
      }
    }
    addToast(`Wishes broadcast "${data.title}" successfully published!`, "success");
    setIsBroadcastModalOpen(false);
  }

  async function handleDeleteNotice(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("notices").delete().eq("id", id);
      } catch (err) {
        console.warn("Error deleting notice:", err);
      }
    }
    setNotices(notices.filter((n) => n.id !== id));
    addToast("Notice deleted.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">College Notices & Broadcasts</h1>
          <p className="text-xs sm:text-sm text-[#718096] mt-1">
            Issue official institutional notices to students and alumni, or broadcast congratulations to the alumni stream.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-[#C29B38] hover:bg-[#B57C34] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Wishes</span>
          </button>
          <button
            onClick={() => setIsNoticeModalOpen(true)}
            className="bg-[#0C1929] hover:bg-[#1A2C42] text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Official Notice</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading notices...</p>
        </div>
      ) : notices.length === 0 ? (
        <EmptyState
          title="No notices published"
          message="Create your first official announcement or broadcast to inform GL Bajaj students and alumni."
          actionLabel="Create Notice"
          onAction={() => setIsNoticeModalOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="bg-white rounded-2xl p-5 border border-[#E7E1D4] shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#8C7138] px-2 py-0.5 rounded border border-[#E7E1D4]">
                    {n.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Audience: {n.target_audience || "All"}
                  </span>
                  <span className="text-xs text-slate-400">
                    {n.created_at ? new Date(n.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#0C1929] font-serif">{n.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{n.content}</p>
              </div>

              <button
                onClick={() => handleDeleteNotice(n.id)}
                className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-slate-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* New Notice Modal */}
      <Modal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        title="Publish Official College Notice"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4 font-sans">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. Silver Jubilee Convocation Registration Open"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              >
                <option value="Reunion">Reunion / Alumni</option>
                <option value="Placement">Placement / Training</option>
                <option value="Convocation">Convocation</option>
                <option value="Academic">Academic Notice</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Audience</label>
              <select
                value={newNotice.target_audience}
                onChange={(e) => setNewNotice({ ...newNotice, target_audience: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              >
                <option value="all">All Portals</option>
                <option value="students">Students Only</option>
                <option value="alumni">Alumni Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notice Content</label>
            <textarea
              rows={4}
              required
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Draft the complete official notice details..."
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl p-3 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNoticeModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718096] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0C1929] hover:bg-[#1A2C42] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSendBroadcast={handleSendBroadcast}
      />
    </div>
  );
}
