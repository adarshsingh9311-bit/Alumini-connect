import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import ReferralRequestModal from "../../components/opportunities/ReferralRequestModal";
import { 
  Briefcase, 
  MapPin, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Send,
  Building2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function StudentOpportunitiesPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [activeTab, setActiveTab] = useState("openings"); // 'openings' | 'my_referrals'
  const [targetReferralOpp, setTargetReferralOpp] = useState(null);

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
      has_referral_slot: true,
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
      has_referral_slot: true,
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
      has_referral_slot: true,
      created_at: "2026-09-15"
    }
  ]);

  // Active referral tracking pipeline (The Unstop / Transparent ATS model)
  const [myReferrals] = useState([
    {
      id: "ref-app-1",
      company: "Google",
      role: "Cloud Software Engineer (SDE-1)",
      alumnus: "Rahul Sharma (Google Cloud)",
      current_step: 3, // 1: Submitted, 2: Reviewed, 3: Pushed to HR, 4: Interview Call
      updated_at: "2 days ago",
      notes: "Resume meets team threshold. Forwarded to Google Cloud EMEA hiring manager."
    },
    {
      id: "ref-app-2",
      company: "Microsoft",
      role: "Azure Cloud Solutions Intern",
      alumnus: "Priya Verma (Azure)",
      current_step: 2,
      updated_at: "5 hours ago",
      notes: "Under review by alumnus. Requested GitHub portfolio update."
    }
  ]);

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Referral &amp; Opportunities Hub</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified openings and track your referral applications through a transparent, 4-stage internal ATS.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("openings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "openings" ? "bg-[#592106] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Openings ({opportunities.length})
          </button>
          <button
            onClick={() => setActiveTab("my_referrals")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === "my_referrals" ? "bg-[#592106] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>My Referral Pipeline</span>
            <span className="w-2 h-2 rounded-full bg-[#ffcc4e]" />
          </button>
        </div>
      </div>

      {activeTab === "my_referrals" ? (
        /* Transparent Referral Application Tracker (ATS View) */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span><strong>Transparent ATS:</strong> Real-time milestones directly updated by your GL Bajaj alumni sponsors.</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
              Active Applications: {myReferrals.length}
            </span>
          </div>

          <div className="space-y-4">
            {myReferrals.map((app) => (
              <div key={app.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{app.role} @ {app.company}</h3>
                    <p className="text-xs text-slate-500">Sponsored by: <strong className="text-slate-700">{app.alumnus}</strong></p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Last updated: {app.updated_at}</span>
                </div>

                {/* 4-Step Milestone Progress Bar */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { step: 1, label: "Submitted" },
                    { step: 2, label: "Alum Reviewed" },
                    { step: 3, label: "Pushed to HR Portal" },
                    { step: 4, label: "Interview Call" }
                  ].map((m) => {
                    const isDone = app.current_step >= m.step;
                    const isCurrent = app.current_step === m.step;
                    return (
                      <div key={m.step} className="space-y-2 text-center">
                        <div className={`h-2 rounded-full transition-all ${
                          isDone ? "bg-emerald-500" : "bg-slate-200"
                        }`} />
                        <div className={`text-[11px] font-bold ${
                          isCurrent ? "text-emerald-700" : isDone ? "text-slate-800" : "text-slate-400"
                        }`}>
                          {m.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Feedback Note from Alumnus */}
                {app.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <strong>Alumni Internal Note:</strong> {app.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Opportunities Grid */
        <>
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, company, or skills..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full sm:w-48 py-2 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
              >
                <option value="">All Opportunity Types</option>
                <option value="Full-Time Job">Full-Time Job</option>
                <option value="Summer Internship">Summer Internship</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#592106] bg-[#faf6eb] px-2.5 py-1 rounded-md border border-[#ffcc4e]/40">
                        {opp.type}
                      </span>
                      <h3 className="font-extrabold text-base text-slate-900 mt-2">{opp.title}</h3>
                      <p className="text-xs font-bold text-[#592106]">{opp.company}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Target: {opp.batch_target}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setTargetReferralOpp(opp)}
                    className="flex-1 py-2 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Referral</span>
                  </button>
                  <a
                    href={opp.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Referral Application Modal */}
      <ReferralRequestModal
        isOpen={Boolean(targetReferralOpp)}
        onClose={() => setTargetReferralOpp(null)}
        opportunity={targetReferralOpp}
      />

    </div>
  );
}
