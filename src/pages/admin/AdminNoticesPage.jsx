import React, { useState } from "react";
import { INITIAL_NOTICES } from "../../lib/mockData";
import { NOTICE_TARGETS } from "../../lib/constants";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import { Bell, Plus, Trash2, Calendar, Send } from "lucide-react";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: "",
    content: "",
    category: "Reunion",
    published_by: "Dean Alumni Relations",
    target_audience: "all"
  });

  function handleCreate(e) {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    const item = {
      id: "not-" + Date.now(),
      ...newNotice,
      created_at: new Date().toISOString()
    };
    setNotices([item, ...notices]);
    addToast("College notice officially published to targeted portal(s)!", "success");
    setIsModalOpen(false);
    setNewNotice({
      title: "",
      content: "",
      category: "Reunion",
      published_by: "Dean Alumni Relations",
      target_audience: "all"
    });
  }

  function handleDelete(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    addToast("Notice deleted.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">College Notices & Broadcasts</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish official announcements, mentorship drive calls, and convocations to students and alumni.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-glgold hover:bg-glgold-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Draft New Notice</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-1 rounded">
                  {n.category}
                </span>
                <span className="text-[10px] font-bold bg-amber-50 text-glgold px-2 py-0.5 rounded border border-glgold/30">
                  Target: {n.target_audience.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-slate-400 hover:text-red-600 p-1 transition"
                title="Delete notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-extrabold text-slate-900 text-base">{n.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{n.content}</p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Published by: <strong className="text-slate-700">{n.published_by}</strong></span>
              <span>{new Date(n.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Official College Notice"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Notice Category</label>
              <select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              >
                <option value="Reunion">Reunion & Alumni Meet</option>
                <option value="Mentorship">Mentorship Drive</option>
                <option value="Academic">Academic & Guest Lecture</option>
                <option value="Placements">Placements & Referrals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Audience</label>
              <select
                value={newNotice.target_audience}
                onChange={(e) => setNewNotice({ ...newNotice, target_audience: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              >
                {NOTICE_TARGETS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Authorized Issuer</label>
            <input
              type="text"
              required
              value={newNotice.published_by}
              onChange={(e) => setNewNotice({ ...newNotice, published_by: e.target.value })}
              placeholder="e.g. Dean Alumni Relations / HOD CSE"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. Registration Open for Annual Alumni Meet 2026"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Notice Content *</label>
            <textarea
              rows="4"
              required
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Write the complete announcement..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
