import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Briefcase, Trash2, CheckCircle2, MapPin, ExternalLink } from "lucide-react";

export default function AdminOpportunitiesPage() {
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = useState([
    {
      id: "opp-1",
      title: "Cloud Software Engineer (SDE-1)",
      company: "Google",
      location: "Bengaluru, India",
      type: "Full-Time Job",
      posted_by: "Rahul Sharma (Batch 2022)",
      status: "Approved",
      created_at: "2026-09-12"
    },
    {
      id: "opp-2",
      title: "Azure Cloud Solutions Intern",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Summer Internship",
      posted_by: "Priya Verma (Batch 2021)",
      status: "Approved",
      created_at: "2026-09-14"
    }
  ]);

  function handleDelete(id) {
    setOpportunities(opportunities.filter((o) => o.id !== id));
    addToast("Opportunity removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Opportunities & Placements Moderation</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, approve, and oversee job openings and referral requests posted across the GL Bajaj ecosystem.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm">Active Job & Internship Postings</h3>
          <span className="text-xs text-slate-500 font-medium">Total: {opportunities.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Opportunity Title</th>
                <th className="px-6 py-3.5">Company & Location</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Shared By</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {opportunities.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{opp.title}</td>
                  <td className="px-6 py-4 text-slate-700">{opp.company} • {opp.location}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-50 text-glblue-750 font-bold text-[10px] px-2 py-0.5 rounded-full border border-teal-200">
                      {opp.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{opp.posted_by}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(opp.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

