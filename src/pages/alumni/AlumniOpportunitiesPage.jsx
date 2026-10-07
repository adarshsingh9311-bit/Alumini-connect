import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Modal from "../../components/common/Modal";
import { Briefcase, Plus, MapPin, ExternalLink, Trash2, Send } from "lucide-react";

export default function AlumniOpportunitiesPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();

  const [opportunities, setOpportunities] = useState([
    {
      id: "opp-1",
      title: "Cloud Software Engineer (SDE-1)",
      company: "Google",
      location: "Bengaluru, India",
      type: "Full-Time Job",
      batch_target: "Batch 2024 & 2025",
      apply_link: "https://careers.google.com",
      description: "Hiring entry-level backend engineers for Google Cloud Core Platform. Strong proficiency in Go, C++ or Java and Data Structures required.",
      posted_by: "Rahul Sharma",
      created_at: "2026-09-12"
    },
    {
      id: "opp-2",
      title: "Azure Cloud Solutions Intern",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Summer Internship",
      batch_target: "Batch 2026",
      apply_link: "https://careers.microsoft.com",
      description: "Looking for 3rd year students eager to work on cloud networking and microservice deployments.",
      posted_by: "Priya Verma",
      created_at: "2026-09-14"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: "",
    company: profile?.current_company || "Google",
    location: "Bengaluru, India",
    type: "Full-Time Job",
    batch_target: "Batch 2025 & 2026",
    apply_link: "",
    description: ""
  });

  function handleCreate(e) {
    e.preventDefault();
    if (!newOpp.title || !newOpp.company) return;
    const item = {
      id: "opp-" + Date.now(),
      ...newOpp,
      posted_by: profile?.full_name || "Alumnus Mentor",
      created_at: new Date().toISOString().split("T")[0]
    };
    setOpportunities([item, ...opportunities]);
    addToast("Opportunity successfully published to GL Bajaj scholars!", "success");
    setIsModalOpen(false);
    setNewOpp({
      title: "",
      company: profile?.current_company || "",
      location: "Bengaluru, India",
      type: "Full-Time Job",
      batch_target: "Batch 2025 & 2026",
      apply_link: "",
      description: ""
    });
  }

  function handleDelete(id) {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    addToast("Opportunity removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Share Opportunities with GLB</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            "Once GLB, Always GLB." Post full-time jobs, internships, and referral openings directly to GL Bajaj scholars.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-glgold hover:bg-glgold-dark text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Opportunity</span>
        </button>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-1 rounded">
                  {opp.type}
                </span>
                <button
                  onClick={() => handleDelete(opp.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{opp.title}</h3>
              <div className="text-xs font-bold text-glblue-750 flex items-center gap-2">
                <span>{opp.company}</span>
                <span>•</span>
                <span className="text-slate-500 font-normal flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {opp.location}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                {opp.description}
              </p>

              <div className="text-[11px] text-slate-500">
                Target: <strong className="text-slate-800">{opp.batch_target}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Posted on {opp.created_at}</span>
              {opp.apply_link && (
                <a
                  href={opp.apply_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-glgold font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Official Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post Opportunity Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Job / Internship Opening"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Opportunity Type</label>
              <select
                value={newOpp.type}
                onChange={(e) => setNewOpp({ ...newOpp, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              >
                <option value="Full-Time Job">Full-Time Job Opening</option>
                <option value="Summer Internship">Summer Internship</option>
                <option value="Winter Internship">Winter Internship</option>
                <option value="Employee Referral">Employee Referral Slot</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Target Batch</label>
              <input
                type="text"
                required
                value={newOpp.batch_target}
                onChange={(e) => setNewOpp({ ...newOpp, batch_target: e.target.value })}
                placeholder="e.g. Batch 2025 & 2026"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={newOpp.title}
                onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                placeholder="e.g. Associate Backend Engineer"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company *</label>
              <input
                type="text"
                required
                value={newOpp.company}
                onChange={(e) => setNewOpp({ ...newOpp, company: e.target.value })}
                placeholder="e.g. Google, Microsoft, Startup"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                value={newOpp.location}
                onChange={(e) => setNewOpp({ ...newOpp, location: e.target.value })}
                placeholder="e.g. Bengaluru / Remote"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Application URL / Link</label>
              <input
                type="url"
                value={newOpp.apply_link}
                onChange={(e) => setNewOpp({ ...newOpp, apply_link: e.target.value })}
                placeholder="https://careers..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Description & Requirements *</label>
            <textarea
              rows="3"
              required
              value={newOpp.description}
              onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
              placeholder="Skills, eligibility, and referral requirements..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
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
              <span>Broadcast Opening</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

