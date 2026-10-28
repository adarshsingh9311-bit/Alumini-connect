import React from "react";
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, UserCheck } from "lucide-react";

export default function ExplainableMatchCard({ match, onSelectForOutreach }) {
  const { alumnus, score, components, reason, is_eligible } = match;

  return (
    <div
      className={`p-5 rounded-3xl border transition-all ${
        is_eligible
          ? "border-amber-200/80 bg-gradient-to-br from-white via-[#faf6eb]/30 to-amber-50/20 shadow-md hover:shadow-xl"
          : "border-slate-200 bg-slate-50 opacity-75"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <img
            src={alumnus.avatar || alumnus.image}
            alt={alumnus.name}
            className="w-13 h-13 rounded-2xl object-cover border-2 border-[#ffcc4e] shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-slate-900">{alumnus.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#ffcc4e]/20 text-[#592106] border border-[#ffcc4e]/40">
                Batch {alumnus.batch} • {alumnus.branch}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              {alumnus.current_designation} @ <span className="text-[#592106] font-bold">{alumnus.current_company}</span>
            </p>
          </div>
        </div>

        {/* Transparent Score Pill */}
        <div className="text-right">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#592106] text-[#ffcc4e] font-black text-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
            <span>{score}% Fit</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Cap: {alumnus.current_load}/{alumnus.capacity} Mentees
          </div>
        </div>
      </div>

      {/* Transparent Score Breakdown according to Blueprint formula */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-white/80 p-2.5 rounded-2xl border border-slate-200/60">
        <div>
          <span className="text-slate-400 block">Skill (w1)</span>
          <span className="font-bold text-slate-800">{components.skill_fit}%</span>
        </div>
        <div>
          <span className="text-slate-400 block">Career (w2)</span>
          <span className="font-bold text-slate-800">{components.career_relevance}%</span>
        </div>
        <div>
          <span className="text-slate-400 block">Avail (w3)</span>
          <span className="font-bold text-slate-800">{components.availability}%</span>
        </div>
        <div>
          <span className="text-slate-400 block">Load (w4)</span>
          <span className="font-bold text-rose-600">-{components.workload_penalty}%</span>
        </div>
      </div>

      {/* Explainable Fit Reason */}
      <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 leading-relaxed">
        <strong>Fit Reason:</strong> {reason}
      </div>

      {/* Skill Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {alumnus.skills.slice(0, 5).map((s, idx) => (
          <span
            key={idx}
            className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700 border border-slate-200"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Card Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="capitalize">{alumnus.availability} for guidance</span>
        </div>

        <button
          onClick={() => onSelectForOutreach(alumnus)}
          disabled={!is_eligible}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
            is_eligible
              ? "bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] shadow-sm"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Draft Introduction</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
