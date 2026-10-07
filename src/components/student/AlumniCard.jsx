import React from "react";
import { Briefcase, MapPin, GraduationCap, Award, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";

export default function AlumniCard({ alumni, onOpenProfile, onRequestMentorship }) {
  return (
    <div className="bg-white rounded-2xl border border-teal-100 hover:border-glgold/50 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between group">
      <div>
        {/* Top bar: Avatar + verification */}
        <div className="flex items-start space-x-3.5">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-slate-900 text-base truncate">{alumni.full_name}</h3>
              {alumni.is_verified && (
                <span title="Roll-Number Verified Alumnus">
                  <CheckCircle2 className="w-4 h-4 text-glgold shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-glblue-750 flex items-center gap-1 truncate mt-0.5">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>{alumni.current_designation}</span>
            </p>
            <p className="text-xs text-slate-600 font-medium truncate">
              at <strong className="text-slate-800">{alumni.current_company}</strong>
            </p>
          </div>
        </div>

        {/* Academic & Location details */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 text-glblue-900 font-medium">
            <GraduationCap className="w-3 h-3 mr-1 text-glblue-750" />
            {alumni.branch} • Batch {alumni.batch_year}
          </span>
          {alumni.location && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              <MapPin className="w-3 h-3 mr-1 text-red-500" />
              {alumni.location}
            </span>
          )}
        </div>

        {/* Bio snippet */}
        {alumni.bio && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            "{alumni.bio}"
          </p>
        )}

        {/* Skills Pills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {alumni.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-[10px] font-semibold text-slate-400">
                +{alumni.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center space-x-2">
        <button
          onClick={() => onOpenProfile(alumni)}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 rounded-xl transition text-center"
        >
          View Profile
        </button>
        {alumni.is_available_for_mentorship ? (
          <button
            onClick={() => onRequestMentorship(alumni)}
            className="flex-1 bg-glgold hover:bg-glgold-dark text-white text-xs font-bold py-2 rounded-xl transition shadow-sm text-center flex items-center justify-center space-x-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Request Mentor</span>
          </button>
        ) : (
          <span className="text-[10px] font-medium text-slate-400 py-2 px-2 italic">
            Mentorship Busy
          </span>
        )}
      </div>
    </div>
  );
}
