import React, { useState } from "react";
import { INITIAL_ACHIEVEMENTS, INITIAL_ALUMNI } from "../../lib/mockData";
import { 
  Heart, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  Award, 
  Users, 
  Building2, 
  CheckCircle2 
} from "lucide-react";

export default function GLBFamilyNetwork() {
  const [achievements] = useState(INITIAL_ACHIEVEMENTS);
  const [alumni] = useState(INITIAL_ALUMNI);
  const [activeTab, setActiveTab] = useState("moments"); // moments | stories

  const [moments] = useState([
    {
      id: 1,
      type: "Promotion",
      recipient: "Rahul Sharma (Batch 2022, CSE)",
      event: "Promoted to Senior Software Engineer at Google Cloud!",
      message: "The college leadership congratulates Rahul on this remarkable career milestone. Inspiring all current scholars!",
      date: "2 days ago",
      badgeColor: "bg-emerald-100 text-emerald-800"
    },
    {
      id: 2,
      type: "Achievement",
      recipient: "Priya Verma (Batch 2021, IT)",
      event: "Awarded Microsoft MVP for Cloud & Generative AI Excellence",
      message: "Heartiest congratulations from the Department of Information Technology and the Alumni Cell!",
      date: "1 week ago",
      badgeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      type: "Startup Launch",
      recipient: "Abhishek Pandey (Batch 2019, ECE)",
      event: "Founded FinTech Venture 'ScalePay' and Secured $1.5M Seed Round",
      message: "Pride of GL Bajaj! True testament to entrepreneurial excellence emerging from our campus labs.",
      date: "2 weeks ago",
      badgeColor: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      type: "Birthday Greetings",
      recipient: "Shikha Rastogi (Batch 2020, CSE)",
      event: "Wishing Shikha a very Happy Birthday from your GL Bajaj Alma Mater!",
      message: "May this year bring greater heights in your engineering endeavors at Amazon.",
      date: "Today",
      badgeColor: "bg-amber-100 text-amber-800"
    }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner embodying "Once GLB, Always GLB." */}
      <div className="bg-gradient-to-r from-slate-950 via-glblue-750 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-teal-600/30 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-glgold/20 border border-glgold/50 px-4 py-1.5 rounded-full text-glgold font-bold text-xs sm:text-sm tracking-wider uppercase shadow-inner">
          <Heart className="w-4 h-4 text-glgold fill-glgold" />
          <span>The Lifelong Ecosystem</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          GLB <span className="text-glgold">Family Network</span>
        </h1>

        <p className="text-glgold font-black text-sm sm:text-lg tracking-widest uppercase">
          "Once GLB, Always GLB."
        </p>

        <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          More than an alumni directory � a living inter-generational circle connecting College Leadership, industry-veteran Alumni, active Mentors, and aspiring Students.
        </p>
      </div>

      {/* Visual Relationship Flow Diagram */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase text-glgold tracking-widest">The Circle of Lifelong Growth</span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">College • Alumni • Mentors • Students</h3>
          <p className="text-xs text-slate-500 mt-1">
            How our shared GL Bajaj foundation empowers each generation to elevate the next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-900 text-white flex items-center justify-center font-black mx-auto shadow-md">
              <Building2 className="w-6 h-6 text-glgold" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">1. Alma Mater</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Provides academic rigor, industry labs, and enduring institutional roots.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-glblue-750 text-white flex items-center justify-center font-black mx-auto shadow-md">
              <Briefcase className="w-6 h-6 text-teal-200" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">2. Alumni Force</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              15,000+ leaders across Tier-1 tech firms, global enterprises, and startups.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-glgold text-white flex items-center justify-center font-black mx-auto shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">3. Active Mentors</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Alumni volunteering 1-on-1 time for mock interviews, career direction, and guidance.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black mx-auto shadow-md">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">4. Scholars & Juniors</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Current students learning, excelling in placements, and returning as future mentors.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Moments & Alumni Stories */}
      <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("moments")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "moments"
              ? "bg-glgold text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>GLB Family Moments ({moments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("stories")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "stories"
              ? "bg-glblue-750 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Verified Alumni Stories ({achievements.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Moments */}
      {activeTab === "moments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moments.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{m.date}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{m.event}</h3>
                <div className="text-xs font-semibold text-glblue-750">{m.recipient}</div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{m.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-glgold">Issued by GL Bajaj Alma Mater</span>
                <span className="text-[11px]">Family Recognition</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 2: Verified Stories */}
      {activeTab === "stories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition space-y-4"
            >
              {ach.media_url && (
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={ach.media_url} alt={ach.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-glblue-750">{ach.alumni_name}</span>
                  <span className="text-[11px] text-slate-400">{ach.alumni_batch}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base leading-snug">{ach.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-bold">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>College Verified Story</span>
                </span>
                <span className="text-slate-400 font-normal">{ach.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
