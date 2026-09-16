import React, { useState } from "react";
import { INITIAL_NOTICES } from "../../lib/mockData";
import Modal from "../../components/common/Modal";
import { Bell, Calendar, Tag, User, Search } from "lucide-react";

export default function StudentNoticesPage() {
  const [notices] = useState(INITIAL_NOTICES);
  const [search, setSearch] = useState("");
  const [activeNotice, setActiveNotice] = useState(null);

  const filteredNotices = notices.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Official College Notices</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
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
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750 shadow-sm"
        />
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            onClick={() => setActiveNotice(notice)}
            className="bg-white rounded-2xl p-5 border border-teal-100 hover:border-glgold/60 shadow-sm hover:shadow-md transition cursor-pointer space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-1 rounded-md border border-teal-200">
                {notice.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(notice.created_at).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-base">{notice.title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {notice.content}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-medium text-glblue-750">
                Issued by: <strong>{notice.published_by}</strong>
              </span>
              <span className="text-glgold font-bold hover:underline">Read Complete Notice →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Notice Detail Modal */}
      <Modal
        isOpen={Boolean(activeNotice)}
        onClose={() => setActiveNotice(null)}
        title="College Notice Details"
        maxWidth="max-w-xl"
      >
        {activeNotice && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-glblue-750 bg-teal-50 px-2.5 py-1 rounded">
                {activeNotice.category}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(activeNotice.created_at).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-extrabold text-slate-900 text-lg leading-snug">
              {activeNotice.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-line">
              {activeNotice.content}
            </div>

            <div className="pt-2 text-xs text-slate-500">
              Authorized Authority: <strong className="text-slate-800">{activeNotice.published_by}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
