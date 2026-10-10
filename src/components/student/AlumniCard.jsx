import React from "react";
import { Briefcase, MapPin, GraduationCap, CheckCircle2, MessageSquare } from "lucide-react";
import { formatEducation } from "../../lib/formatters";

export default function AlumniCard({ alumni, onOpenProfile, onRequestMentorship }) {
  const educationDisplay = formatEducation(alumni.branch, alumni.batch_year || alumni.graduation_year);

  return (
    <div className="bg-[#FFFFFF] rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition p-5 flex flex-col justify-between shadow-xs font-sans">
      <div>
        {/* Top bar: Avatar + details */}
        <div className="flex items-start space-x-3.5">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-12 h-12 rounded-lg object-cover border border-[#D9DDE3] shrink-0"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
            }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-[#202124] text-sm truncate">{alumni.full_name}</h3>
              {alumni.is_verified && (
                <span title="Roll-Number Verified Alumnus">
                  <CheckCircle2 className="w-4 h-4 text-[#2E6B4A] shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-[#7A1F24] truncate mt-0.5">
              {alumni.current_designation || "Alumnus"}
            </p>
            <p className="text-xs text-[#667085] truncate">
              {alumni.current_company ? `at ${alumni.current_company}` : "GL Bajaj Graduate"}
            </p>
          </div>
        </div>

        {/* Academic & Location details */}
        <div className="mt-3 pt-3 border-t border-[#D9DDE3]/60 flex flex-wrap gap-2 text-xs text-[#667085]">
          {educationDisplay && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F7F3EA] text-[#202124] font-medium border border-[#D9DDE3]">
              <GraduationCap className="w-3 h-3 mr-1 text-[#7A1F24]" />
              {educationDisplay}
            </span>
          )}
          {alumni.location && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3]">
              <MapPin className="w-3 h-3 mr-1 text-[#667085]" />
              {alumni.location}
            </span>
          )}
        </div>

        {/* Bio snippet */}
        {alumni.bio && (
          <p className="mt-2.5 text-xs text-[#667085] line-clamp-2 leading-relaxed">
            "{alumni.bio}"
          </p>
        )}

        {/* Skills Pills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {alumni.skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3] px-2 py-0.5 rounded"
              >
                {skill}
              </span>
            ))}
            {alumni.skills.length > 3 && (
              <span className="text-[10px] font-medium text-[#667085]">
                +{alumni.skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-[#D9DDE3]/60 flex items-center space-x-2">
        <button
          onClick={() => onOpenProfile(alumni)}
          className="flex-1 bg-[#FFFFFF] hover:bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3] text-xs font-semibold py-2 rounded-md transition text-center cursor-pointer"
        >
          View Profile
        </button>
        {alumni.is_available_for_mentorship ? (
          <button
            onClick={() => onRequestMentorship(alumni)}
            className="flex-1 bg-[#7A1F24] hover:bg-[#5C171B] text-[#FFFFFF] text-xs font-semibold py-2 rounded-md transition text-center flex items-center justify-center space-x-1 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Request Mentor</span>
          </button>
        ) : (
          <span className="flex-1 bg-[#F7F3EA] text-[#667085] text-[11px] font-medium py-2 rounded-md text-center border border-[#D9DDE3]">
            Mentorship Busy
          </span>
        )}
      </div>
    </div>
  );
}
