import React from "react";
import { BarChart3, TrendingUp, Users, Briefcase, Award, GraduationCap } from "lucide-react";

export default function AdminAnalyticsPage() {
  const topCompanies = [
    { name: "Google", count: 18, pct: "92%" },
    { name: "Microsoft", count: 24, pct: "86%" },
    { name: "Amazon Web Services", count: 31, pct: "78%" },
    { name: "Qualcomm", count: 14, pct: "64%" },
    { name: "TCS & Infosys", count: 120, pct: "100%" }
  ];

  const branchDistribution = [
    { branch: "Computer Science & Engineering (CSE)", count: 540, pct: "88%" },
    { branch: "Information Technology (IT)", count: 280, pct: "82%" },
    { branch: "Electronics & Communication (ECE)", count: 210, pct: "75%" },
    { branch: "Mechanical Engineering (ME)", count: 160, pct: "60%" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Ecosystem Analytics & Health</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed metrics tracking placement trajectories, alumni mentorship participation, and departmental engagement.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Total Alumni Tracked</div>
          <div className="text-3xl font-black text-slate-900">15,420</div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% YoY growth
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Mentors</div>
          <div className="text-3xl font-black text-glgold">385</div>
          <div className="text-[10px] text-glblue-750 font-bold">1-on-1 Guidance Ready</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Mentorship Match Rate</div>
          <div className="text-3xl font-black text-emerald-600">94.2%</div>
          <div className="text-[10px] text-slate-500 font-semibold">Accepted within 48h</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-teal-100 shadow-sm space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Verified Records</div>
          <div className="text-3xl font-black text-slate-900">100%</div>
          <div className="text-[10px] text-teal-600 font-bold">Roll-Number Linked</div>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Top Hiring Companies */}
        <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Briefcase className="w-4 h-4 text-glgold" />
            <span>Top Tier-1 Alumni Recruiters</span>
          </h3>

          <div className="space-y-3">
            {topCompanies.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>{c.name}</span>
                  <span className="text-glblue-750">{c.count} Alumni</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-glgold rounded-full" style={{ width: c.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch-wise Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <GraduationCap className="w-4 h-4 text-glblue-750" />
            <span>Branch-wise Alumni Distribution</span>
          </h3>

          <div className="space-y-3">
            {branchDistribution.map((b) => (
              <div key={b.branch} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span className="truncate max-w-[240px]">{b.branch}</span>
                  <span className="text-teal-700">{b.count} scholars</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-glblue-750 rounded-full" style={{ width: b.pct }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
