import React, { useState } from "react";
import { Plus, Trash2, Briefcase, Calendar } from "lucide-react";

export default function CareerHistoryManager({ careerHistory = [], onUpdate }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newJob, setNewJob] = useState({
    company: "",
    designation: "",
    start_date: "",
    end_date: "",
    is_current: false,
    description: ""
  });

  function handleAdd(e) {
    e.preventDefault();
    if (!newJob.company || !newJob.designation) return;
    const item = {
      id: "c-" + Date.now(),
      ...newJob
    };
    onUpdate([item, ...careerHistory]);
    setNewJob({
      company: "",
      designation: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: ""
    });
    setIsAdding(false);
  }

  function handleRemove(id) {
    onUpdate(careerHistory.filter((c) => c.id !== id));
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-glblue-750" />
            <span>Career History & Work Experience</span>
          </h3>
          <p className="text-xs text-slate-500">Showcase your professional growth from graduation to your current role.</p>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="bg-glblue-750 hover:bg-teal-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        )}
      </div>

      {/* Add New Job Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wide">Add Work Experience</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Company *</label>
              <input
                type="text"
                required
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                placeholder="e.g. Google, Microsoft, Amazon"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Designation *</label>
              <input
                type="text"
                required
                value={newJob.designation}
                onChange={(e) => setNewJob({ ...newJob, designation: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Start Date</label>
              <input
                type="date"
                value={newJob.start_date}
                onChange={(e) => setNewJob({ ...newJob, start_date: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">End Date</label>
              <input
                type="date"
                disabled={newJob.is_current}
                value={newJob.end_date}
                onChange={(e) => setNewJob({ ...newJob, end_date: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none disabled:bg-slate-100"
              />
              <label className="mt-1 flex items-center space-x-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newJob.is_current}
                  onChange={(e) => setNewJob({ ...newJob, is_current: e.target.checked, end_date: "" })}
                  className="rounded text-glgold focus:ring-glgold"
                />
                <span>I currently work here</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Key Responsibilities / Projects</label>
            <textarea
              rows="2"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              placeholder="Summary of projects, technologies, and achievements..."
              className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-4 py-1.5 rounded-lg transition shadow-sm"
            >
              Save Experience
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="space-y-3">
        {careerHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No previous jobs recorded yet. Click "Add Position" above.</p>
        ) : (
          careerHistory.map((job) => (
            <div key={job.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{job.designation}</h4>
                <p className="text-xs font-semibold text-glblue-750">{job.company}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {job.start_date || "N/A"} — {job.is_current ? "Present" : job.end_date || "N/A"}
                </p>
                {job.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{job.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(job.id)}
                className="p-1 text-slate-400 hover:text-red-600 transition"
                title="Remove position"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

