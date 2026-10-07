import React from "react";
import { Briefcase, MapPin, GraduationCap, CheckCircle2, MessageSquare } from "lucide-react";
import { formatEducation } from "../../lib/formatters";

export default function AlumniCard({ alumni, onOpenProfile, onRequestMentorship }) {
  const educationDisplay = formatEducation(alumni.branch, alumni.batch_year || alumni.graduation_year);

  return (
    <div className="bg-white rounded-2xl border border-[#E7E1D4] hover:border-[#C29B38]/60 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between group font-sans">
      <div>
        {/* Top bar: Avatar + verification */}
        <div className="flex items-start space-x-3.5">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-14 h-14 rounded-2xl object-cover border border-[#E7E1D4] shadow-xs group-hover:scale-105 transition"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-[#0C1929] text-base truncate font-serif">{alumni.full_name}</h3>
              {alumni.is_verified && (
                <span title="Roll-Number Verified Alumnus">
                  <CheckCircle2 className="w-4 h-4 text-[#C29B38] shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#8C7138] flex items-center gap-1 truncate mt-0.5">
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>{alumni.current_designation || "Alumnus"}</span>
            </p>
            <p className="text-xs text-slate-600 font-medium truncate">
              {alumni.current_company ? `at ${alumni.current_company}` : "GL Bajaj Graduate"}
            </p>
          </div>
        </div>

        {/* Academic & Location details */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs text-slate-500">
          {educationDisplay && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#0C1929] font-medium border border-[#E7E1D4]">
              <GraduationCap className="w-3 h-3 mr-1 text-[#8C7138]" />
              {educationDisplay}
            </span>
          )}
          {alumni.location && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
              <MapPin className="w-3 h-3 mr-1 text-red-500" />
              {alumni.location}
            </span>
          )}
        </div>

        {/* Bio snippet */}
        {alumni.bio && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
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
          className="flex-1 bg-[#FAF8F5] hover:bg-slate-100 text-[#0C1929] border border-[#E7E1D4] text-xs font-semibold py-2 rounded-xl transition text-center"
        >
          View Profile
        </button>
        {alumni.is_available_for_mentorship ? (
          <button
            onClick={() => onRequestMentorship(alumni)}
            className="flex-1 bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] text-xs font-bold py-2 rounded-xl transition shadow-xs text-center flex items-center justify-center space-x-1"
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
