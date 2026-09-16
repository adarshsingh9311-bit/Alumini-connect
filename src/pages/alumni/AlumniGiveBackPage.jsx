import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { 
  HeartHandshake, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Users, 
  Briefcase, 
  Video, 
  FileCode, 
  Save 
} from "lucide-react";

export default function AlumniGiveBackPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();

  const [pledges, setPledges] = useState({
    mentorship: true,
    internships: true,
    job_referrals: true,
    webinars: false,
    project_guidance: true,
    reunion_panels: false,
    college_initiatives: true
  });

  function handleToggle(key) {
    setPledges({ ...pledges, [key]: !pledges[key] });
  }

  function handleSave(e) {
    e.preventDefault();
    addToast("Your Give Back pledges and contribution impact profile have been saved!", "success");
  }

  const activeCount = Object.values(pledges).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-glgold/30 text-glgold text-xs px-3 py-1 rounded-full font-bold uppercase mb-2">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Giving Back to Alma Mater</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Give Back to GLB</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          "Once GLB, Always GLB." Choose the areas where you would like to support juniors and elevate our college ecosystem.
        </p>
      </div>

      {/* Alumni Impact Badges Banner */}
      <div className="bg-gradient-to-r from-glblue-750 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-teal-600/30">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[10px] uppercase font-bold text-teal-200 tracking-wider">
            Your Alumni Contribution Level
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <span>GLB Gold Pillar of Excellence</span>
            <Award className="w-6 h-6 text-glgold" />
          </h2>
          <p className="text-xs text-teal-100 max-w-md leading-relaxed">
            Recognized for active student mentorship, sharing tech opportunities, and supporting GL Bajaj placement initiatives.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center w-full sm:w-auto">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-glgold">12</div>
            <div className="text-[10px] text-slate-300 font-medium">Scholars Mentored</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">4</div>
            <div className="text-[10px] text-slate-300 font-medium">Referrals Given</div>
          </div>
        </div>
      </div>

      {/* Give Back Contribution Checklist */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-slate-900 text-base">Select Your Contribution Activities</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            College administration and students will match relevant requests based on your preferences.
          </p>
        </div>

        <div className="space-y-4">
          {/* Item 1 */}
          <div
            onClick={() => handleToggle("mentorship")}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
              pledges.mentorship ? "border-glblue-750 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={pledges.mentorship}
              onChange={() => {}}
              className="mt-1 rounded text-glblue-750 focus:ring-glblue-750 cursor-pointer"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-glblue-750" />
                <span>1-on-1 Student Mentorship & Mock Interviews</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Guide pre-final and final-year scholars on technical interview preparation, system design, and coding rounds.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div
            onClick={() => handleToggle("internships")}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
              pledges.internships ? "border-glblue-750 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={pledges.internships}
              onChange={() => {}}
              className="mt-1 rounded text-glblue-750 focus:ring-glblue-750 cursor-pointer"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-glgold" />
                <span>Share Internship Openings</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Broadcast summer and winter internship requirements from your firm directly to GL Bajaj scholars.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div
            onClick={() => handleToggle("job_referrals")}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
              pledges.job_referrals ? "border-glblue-750 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={pledges.job_referrals}
              onChange={() => {}}
              className="mt-1 rounded text-glblue-750 focus:ring-glblue-750 cursor-pointer"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Provide Employee Referrals for Full-Time Roles</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Review portfolios and refer talented graduating scholars into hiring pipelines at your company.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div
            onClick={() => handleToggle("webinars")}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
              pledges.webinars ? "border-glblue-750 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={pledges.webinars}
              onChange={() => {}}
              className="mt-1 rounded text-glblue-750 focus:ring-glblue-750 cursor-pointer"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Conduct Technical Webinars & Tech Talks</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Host an interactive 45-minute virtual masterclass on cutting-edge industry tools (Cloud, AI, DevOps, VLSI).
              </p>
            </div>
          </div>

          {/* Item 5 */}
          <div
            onClick={() => handleToggle("project_guidance")}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start space-x-3.5 ${
              pledges.project_guidance ? "border-glblue-750 bg-teal-50/40" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={pledges.project_guidance}
              onChange={() => {}}
              className="mt-1 rounded text-glblue-750 focus:ring-glblue-750 cursor-pointer"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-600" />
                <span>Industry Guidance on Capstone & Hackathon Projects</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Provide architecture feedback on final-year student engineering projects.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <strong>{activeCount}</strong> of 5 give-back activities active
          </div>
          <button
            type="submit"
            className="bg-glgold hover:bg-glgold-dark text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Give Back Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
