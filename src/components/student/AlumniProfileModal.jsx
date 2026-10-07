import React from "react";
import Modal from "../common/Modal";
import { formatEducation } from "../../lib/formatters";
import { 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Globe, 
  MessageSquare 
} from "lucide-react";

export default function AlumniProfileModal({ isOpen, onClose, alumni, onRequestMentorship }) {
  if (!alumni) return null;

  const educationDisplay = formatEducation(alumni.branch, alumni.batch_year || alumni.graduation_year);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alumni Professional Profile" maxWidth="max-w-2xl">
      <div className="space-y-6 font-sans">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-[#E7E1D4]">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#C29B38] shadow-md"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
            }}
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-xl font-bold text-[#0C1929] font-serif">{alumni.full_name}</h2>
              {alumni.is_verified && (
                <span className="bg-amber-50 text-[#8C7138] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#E7E1D4] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#C29B38]" /> Roll-No Verified
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-[#8C7138]">
              {alumni.current_designation || "Alumnus"} {alumni.current_company ? `at ${alumni.current_company}` : ""}
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-3 pt-1">
              {educationDisplay && (
                <span><GraduationCap className="w-3.5 h-3.5 inline mr-1 text-[#8C7138]" /> {educationDisplay}</span>
              )}
              {alumni.location && <span><MapPin className="w-3.5 h-3.5 inline mr-1 text-red-500" /> {alumni.location}</span>}
            </p>
          </div>
        </div>

        {/* Bio */}
        {alumni.bio && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">About / Bio</h4>
            <p className="text-xs sm:text-sm text-slate-700 bg-[#FAF8F5] p-4 rounded-xl leading-relaxed border border-[#E7E1D4] italic">
              "{alumni.bio}"
            </p>
          </div>
        )}

        {/* Skills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#718096]">Technical Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-[#E7E1D4] rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-4 border-t border-[#E7E1D4] flex items-center justify-between">
          <div className="text-xs text-[#718096]">
            {alumni.is_available_for_mentorship ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Accepting mentorship inquiries
              </span>
            ) : (
              <span className="text-slate-400">Currently unavailable for new mentorship requests</span>
            )}
          </div>

          {alumni.is_available_for_mentorship && (
            <button
              onClick={() => onRequestMentorship(alumni)}
              className="bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Request 1-on-1 Guidance</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
