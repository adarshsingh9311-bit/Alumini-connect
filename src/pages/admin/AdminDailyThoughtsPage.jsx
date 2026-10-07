import React, { useState, useMemo } from "react";
import { 
  Sun, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Heart, 
  Star, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  Share2,
  X,
  Check
} from "lucide-react";
import { 
  THOUGHT_CATEGORIES, 
  loadStoredThoughts, 
  saveStoredThoughts 
} from "../../lib/dailyThoughtsData";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";

export default function AdminDailyThoughtsPage() {
  const { addToast } = useToast();
  const [thoughts, setThoughts] = useState(loadStoredThoughts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // all | published | scheduled

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    quote: "",
    author: "GLB Alumni Connect",
    publish_date: new Date().toISOString().split("T")[0],
    category: "Motivation",
    featured: false
  });

  const todayIso = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    return thoughts.filter((t) => {
      const matchSearch =
        !search ||
        t.quote.toLowerCase().includes(search.toLowerCase()) ||
        t.author.toLowerCase().includes(search.toLowerCase());

      const matchCat = filterCategory === "all" || t.category === filterCategory;
      const isPublished = t.publish_date <= todayIso;
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "published" ? isPublished : !isPublished);

      return matchSearch && matchCat && matchStatus;
    });
  }, [thoughts, search, filterCategory, filterStatus, todayIso]);

  function openAddModal() {
    setEditingId(null);
    setFormData({
      quote: "",
      author: "GLB Alumni Connect",
      publish_date: new Date().toISOString().split("T")[0],
      category: "Motivation",
      featured: false
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setFormData({
      quote: item.quote,
      author: item.author,
      publish_date: item.publish_date,
      category: item.category || "Motivation",
      featured: Boolean(item.featured)
    });
    setIsModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    if (!formData.quote.trim()) {
      addToast("Quote text cannot be empty.", "error");
      return;
    }

    let updatedList;
    if (editingId) {
      updatedList = thoughts.map((t) => {
        if (t.id === editingId) {
          const isPublished = formData.publish_date <= todayIso;
          return {
            ...t,
            ...formData,
            status: isPublished ? "published" : "scheduled"
          };
        }
        return t;
      });
      addToast("Daily thought updated successfully.", "success");
    } else {
      const isPublished = formData.publish_date <= todayIso;
      const newItem = {
        id: "thought-" + Date.now(),
        ...formData,
        status: isPublished ? "published" : "scheduled",
        likes_count: 0,
        created_at: new Date().toISOString()
      };
      updatedList = [newItem, ...thoughts];
      addToast("New daily thought scheduled!", "success");
    }

    setThoughts(updatedList);
    saveStoredThoughts(updatedList);
    setIsModalOpen(false);
  }

  function handleDelete(id) {
    const updated = thoughts.filter((t) => t.id !== id);
    setThoughts(updated);
    saveStoredThoughts(updated);
    addToast("Daily thought deleted.", "info");
  }

  function handleToggleFeatured(id) {
    const updated = thoughts.map((t) =>
      t.id === id ? { ...t, featured: !t.featured } : t
    );
    setThoughts(updated);
    saveStoredThoughts(updated);
    addToast("Featured status updated.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sun className="w-6 h-6 text-[#C2853B]" />
            <span>Daily GLB Thoughts Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, schedule, and curate daily positivity and words of wisdom for the GL Bajaj alumni community.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-glgold hover:bg-glgold-dark text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Thought</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
          <div className="text-xl font-black text-slate-900">{thoughts.length}</div>
          <div className="text-xs text-slate-500 font-medium">Total Quotes</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
          <div className="text-xl font-black text-emerald-600">
            {thoughts.filter((t) => t.publish_date <= todayIso).length}
          </div>
          <div className="text-xs text-slate-500 font-medium">Published / Past</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
          <div className="text-xl font-black text-amber-600">
            {thoughts.filter((t) => t.publish_date > todayIso).length}
          </div>
          <div className="text-xs text-slate-500 font-medium">Upcoming Scheduled</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-teal-100 shadow-xs">
          <div className="text-xl font-black text-glgold">
            {thoughts.filter((t) => t.featured).length}
          </div>
          <div className="text-xs text-slate-500 font-medium">Featured Thoughts</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search thoughts or authors..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none"
          >
            <option value="all">All Categories</option>
            {THOUGHT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published / Today</option>
            <option value="scheduled">Upcoming Scheduled</option>
          </select>
        </div>
      </div>

      {/* Thoughts List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-teal-100 p-12 text-center text-slate-400 text-xs">
            No thoughts found matching your filters.
          </div>
        ) : (
          filtered.map((t) => {
            const isToday = t.publish_date === todayIso;
            const isFuture = t.publish_date > todayIso;

            return (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border p-5 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isToday
                    ? "border-[#D4AF37] ring-2 ring-amber-100/70"
                    : "border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="font-semibold text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C2853B]" />
                      <span>{t.publish_date}</span>
                    </span>

                    {isToday && (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Today's Thought
                      </span>
                    )}

                    <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      isFuture
                        ? "bg-blue-50 text-blue-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {isFuture ? "Scheduled" : "Published"}
                    </span>

                    {t.category && (
                      <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full text-[10px]">
                        {t.category}
                      </span>
                    )}

                    {t.featured && (
                      <span className="bg-amber-50 text-glgold font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-glgold text-glgold" /> Featured
                      </span>
                    )}
                  </div>

                  <p className="font-serif italic text-slate-800 text-sm leading-relaxed">
                    "{t.quote}"
                  </p>

                  <p className="text-xs font-semibold text-slate-500 font-serif">
                    — {t.author}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handleToggleFeatured(t.id)}
                    title={t.featured ? "Unmark featured" : "Mark as featured"}
                    className={`p-2 rounded-xl transition text-xs ${
                      t.featured ? "text-glgold bg-amber-50" : "text-slate-400 hover:text-glgold hover:bg-slate-50"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${t.featured ? "fill-glgold" : ""}`} />
                  </button>

                  <button
                    onClick={() => openEditModal(t)}
                    title="Edit thought"
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition text-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    title="Delete thought"
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition text-xs"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Daily Thought" : "Schedule New Daily Thought"}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Thought / Quote Content *
            </label>
            <textarea
              rows={3}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="e.g. Every new day is another opportunity to learn, grow and make a difference..."
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-1 focus:ring-glgold focus:outline-none font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Attribution / Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. GLB Alumni Connect, Dean Alumni Relations"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Publish Date *
              </label>
              <input
                type="date"
                value={formData.publish_date}
                onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-glgold focus:outline-none"
              >
                {THOUGHT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-300 text-glgold focus:ring-glgold"
                />
                <span className="font-semibold text-slate-700">Mark as Featured Thought</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-glgold hover:bg-glgold-dark text-slate-950 font-black text-xs px-5 py-2 rounded-xl transition shadow-sm"
            >
              {editingId ? "Save Changes" : "Schedule Thought"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
