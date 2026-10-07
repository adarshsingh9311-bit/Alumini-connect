import React from "react";
import Modal from "../common/Modal";
import { 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Globe, 
  MessageSquare 
} from "lucide-react";

export default function AlumniProfileModal({ isOpen, onClose, alumni, onRequestMentorship }) {
  if (!alumni) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Alumni Professional Profile" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 pb-6 border-b border-slate-100">
          <img
            src={alumni.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
            alt={alumni.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-glgold shadow-md"
          />
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{alumni.full_name}</h2>
              {alumni.is_verified && (
                <span className="bg-amber-50 text-glgold text-[11px] font-bold px-2 py-0.5 rounded-full border border-glgold/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Roll-No Verified
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-glblue-750">
              {alumni.current_designation} at <strong className="text-slate-900">{alumni.current_company}</strong>
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-3 pt-1">
              <span><GraduationCap className="w-3.5 h-3.5 inline mr-1 text-glblue-750" /> {alumni.branch} (Batch {alumni.batch_year})</span>
              {alumni.location && <span><MapPin className="w-3.5 h-3.5 inline mr-1 text-red-500" /> {alumni.location}</span>}
            </p>
          </div>
        </div>

        {/* Bio */}
        {alumni.bio && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About / Bio</h4>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl leading-relaxed border border-slate-100">
              {alumni.bio}
            </p>
          </div>
        )}

        {/* Skills */}
        {alumni.skills && alumni.skills.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technical Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {alumni.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-teal-50 text-glblue-900 border border-teal-200 text-xs font-semibold px-3 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Career History Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Journey & Experience</h4>
          {alumni.career_history && alumni.career_history.length > 0 ? (
            <div className="relative border-l-2 border-teal-100 ml-3 space-y-5">
              {alumni.career_history.map((job) => (
                <div key={job.id} className="relative pl-6">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-glgold rounded-full border-2 border-white shadow-sm"></div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{job.designation}</h5>
                    <p className="text-xs font-semibold text-glblue-750">{job.company}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {job.start_date} — {job.is_current ? "Present" : job.end_date}
                    </p>
                    {job.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg">
              Current role: {alumni.current_designation} at {alumni.current_company}
            </div>
          )}
        </div>

        {/* Social Profiles */}
        <div className="flex items-center space-x-3 pt-2">
          {alumni.linkedin_url && (
            <a
              href={alumni.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <i className="fa-brands fa-linkedin text-blue-600 text-sm"></i>
              <span>LinkedIn</span>
            </a>
          )}
          {alumni.github_url && (
            <a
              href={alumni.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <i className="fa-brands fa-github text-slate-900 text-sm"></i>
              <span>GitHub</span>
            </a>
          )}
          {alumni.website_url && (
            <a
              href={alumni.website_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portfolio</span>
            </a>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>
          {alumni.is_available_for_mentorship && onRequestMentorship && (
            <button
              onClick={() => {
                onClose();
                onRequestMentorship(alumni);
              }}
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2 rounded-xl transition shadow-md flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Request Mentorship Session</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
