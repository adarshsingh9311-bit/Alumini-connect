import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { Briefcase, MapPin, ExternalLink, Search, CheckCircle2 } from "lucide-react";

export default function StudentOpportunitiesPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [opportunities] = useState([
    {
      id: "opp-1",
      title: "Cloud Software Engineer (SDE-1)",
      company: "Google",
      location: "Bengaluru, India",
      type: "Full-Time Job",
      batch_target: "Batch 2024 & 2025",
      apply_link: "https://careers.google.com",
      description: "Hiring entry-level backend engineers for Google Cloud Core Platform. Strong proficiency in Go, C++ or Java and Data Structures required.",
      posted_by: "Rahul Sharma (Batch 2022)",
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
      posted_by: "Priya Verma (Batch 2021)",
      created_at: "2026-09-14"
    },
    {
      id: "opp-3",
      title: "Hardware Silicon Verification Engineer",
      company: "Qualcomm",
      location: "Noida, India",
      type: "Full-Time Job",
      batch_target: "Batch 2025 (ECE)",
      apply_link: "https://qualcomm.com/careers",
      description: "Role for ECE scholars with SystemVerilog, FPGA and ASIC knowledge. Referral available.",
      posted_by: "Aditya Roy (Batch 2020)",
      created_at: "2026-09-15"
    }
  ]);

  function handleRequestReferral(opp) {
    addToast(`Referral inquiry sent to ${opp.posted_by} for "${opp.title}"!`, "success");
  }

  const filtered = opportunities.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.title.toLowerCase().includes(q) ||
      o.company.toLowerCase().includes(q) ||
      o.location.toLowerCase().includes(q);
    const matchType = !typeFilter || o.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Opportunities Hub</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore job openings, internships, and employee referrals posted directly by verified GL Bajaj graduates.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role, company, or city..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          >
            <option value="">All Opportunity Types</option>
            <option value="Full-Time Job">Full-Time Jobs</option>
            <option value="Summer Internship">Summer Internships</option>
          </select>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-1 rounded">
                  {opp.type}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">{opp.created_at}</span>
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
                Target: <strong className="text-slate-800">{opp.batch_target}</strong> • Shared by <strong className="text-glblue-750">{opp.posted_by}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleRequestReferral(opp)}
                className="flex-1 bg-glblue-750 hover:bg-teal-900 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-sm text-center"
              >
                Request Referral
              </button>
              {opp.apply_link && (
                <a
                  href={opp.apply_link}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-glgold hover:bg-glgold-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1"
                >
                  <span>Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
