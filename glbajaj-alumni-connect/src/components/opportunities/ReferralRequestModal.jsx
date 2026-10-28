import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { 
  Send, 
  FileText, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Award,
  AlertCircle 
} from "lucide-react";

export default function ReferralRequestModal({ isOpen, onClose, opportunity }) {
  const { addToast } = useToast();
  const [resumeLink, setResumeLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [quickPitch, setQuickPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  function handleSubmitApplication(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast(
        `Referral application dispatched to ${opportunity.posted_by || "Alumnus"}! Track milestones in your Referral Pipeline.`,
        "success"
      );
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 text-slate-900 shadow-2xl relative space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/50">
              <Building2 className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Internal Referral Pipeline (ATS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Request Referral for {opportunity.company}
            </h2>
            <p className="text-xs text-slate-500">
              Role: <strong className="text-slate-800">{opportunity.title}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Google Drive PDF Resume Link (Public Viewable)
            </label>
            <input
              type="url"
              required
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              GitHub Profile / Personal Portfolio Link
            </label>
            <input
              type="url"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Quick Pitch (Why are you a fit for this specific job?)
            </label>
            <textarea
              rows={4}
              required
              value={quickPitch}
              onChange={(e) => setQuickPitch(e.target.value)}
              placeholder="Highlight 2 relevant projects, your CGPA, and tools you've deployed..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Transparent Referral Guarantee:</span>
            <span>
              Your application tracks four transparent steps: <strong>Submitted &rarr; Alum Reviewed &rarr; Pushed to HR &rarr; Interview Call</strong>. No cold email black holes.
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold shadow-md transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit to Alum for Referral"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
