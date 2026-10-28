import React from "react";
import { Briefcase, MapPin, GraduationCap, Award, CheckCircle2, ArrowRight, UserCheck, Sparkles } from "lucide-react";

export default function ExplainableMatchCard({ match, onSelectForOutreach }) {
  const { alumnus, score, components, reason, is_eligible } = match;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-[#ffcc4e]/60 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 group">
      <div className="space-y-3.5">
        {/* Top Header: Avatar + Match Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={alumnus.avatar || alumnus.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
              alt={alumnus.name}
              className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-slate-900 text-sm truncate">{alumnus.name}</h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ffcc4e] shrink-0" title="Verified Alumnus" />
              </div>
              <p className="text-xs font-semibold text-[#592106] truncate">
                {alumnus.current_designation}
              </p>
              <p className="text-xs text-slate-500 font-medium truncate">
                at <strong className="text-slate-800">{alumnus.current_company}</strong>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#592106] text-[#ffcc4e] font-extrabold text-xs shadow-xs">
              <Sparkles className="w-3 h-3 text-[#ffcc4e]" />
              <span>{score}% Match</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Load: {alumnus.current_load}/{alumnus.capacity}
            </div>
          </div>
        </div>

        {/* Academic Details Tag */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#faf6eb] text-[#592106] font-medium text-[11px]">
            <GraduationCap className="w-3 h-3 mr-1 text-[#592106]" />
            {alumnus.branch} • Batch {alumnus.batch}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold capitalize">
            {alumnus.availability} for guidance
          </span>
        </div>

        {/* Transparent Score Breakdown (Blueprint Mathematical Weights) */}
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[9px]">Skill</span>
            <span className="font-bold text-slate-700">{components?.skill_fit || 0}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">Career</span>
            <span className="font-bold text-slate-700">{components?.career_relevance || 0}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">Avail</span>
            <span className="font-bold text-slate-700">{components?.availability || 0}%</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">Load</span>
            <span className="font-bold text-rose-600">-{components?.fatigue_penalty || components?.workload_penalty || 0}%</span>
          </div>
        </div>

        {/* Reason Pill */}
        <div className="p-2.5 rounded-xl bg-[#faf6eb] border border-[#ffcc4e]/30 text-[11px] text-slate-700 leading-relaxed">
          <strong className="text-[#592106]">Match Reason:</strong> {reason}
        </div>

        {/* Skills */}
        {alumnus.skills && (
          <div className="flex flex-wrap gap-1">
            {alumnus.skills.slice(0, 4).map((s, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t border-slate-100">
        <button
          onClick={() => onSelectForOutreach(alumnus)}
          disabled={!is_eligible}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
            is_eligible
              ? "bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <span>Draft Introduction</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
