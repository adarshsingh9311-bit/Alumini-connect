import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_ALUMNI } from "../../lib/mockData";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import CareerHistoryManager from "../../components/alumni/CareerHistoryManager";
import { Briefcase, User, Save, Globe, MapPin } from "lucide-react";

export default function AlumniProfilePage() {
  const { profile } = useAuth();
  const { addToast } = useToast();

  const current = profile || INITIAL_ALUMNI[0];

  const [formData, setFormData] = useState({
    full_name: current.full_name || "",
    current_company: current.current_company || "",
    current_designation: current.current_designation || "",
    industry: current.industry || "",
    location: current.location || "",
    skills: current.skills ? (Array.isArray(current.skills) ? current.skills.join(", ") : current.skills) : "",
    bio: current.bio || "",
    linkedin_url: current.linkedin_url || "",
    github_url: current.github_url || "",
    website_url: current.website_url || ""
  });

  const [careerHistory, setCareerHistory] = useState(current.career_history || []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    addToast("Alumni profile & career timeline successfully saved!", "success");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Profile & Career Journey</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Maintain your current designation, company, skills, and employment timeline for GL Bajaj students and faculty.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Details */}
        <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-glgold" />
            <span>Current Role & Professional Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, India"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Current Company</label>
              <input
                type="text"
                required
                name="current_company"
                value={formData.current_company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Current Designation</label>
              <input
                type="text"
                required
                name="current_designation"
                value={formData.current_designation}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Industry / Domain</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Cloud & Distributed Systems"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Technical Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Go, Kubernetes, System Design, GCP"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Professional Bio & Guidance Offer</label>
            <textarea
              rows="3"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell students about your domain experience and how you like to guide juniors..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* Social / Professional Links */}
        <div className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-glgold" />
            <span>Social & Professional Handles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                <i className="fa-brands fa-linkedin text-blue-600 mr-1"></i> LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                <i className="fa-brands fa-github text-slate-900 mr-1"></i> GitHub URL
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                <Globe className="w-3.5 h-3.5 inline mr-1 text-teal-600" /> Personal Portfolio
              </label>
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Career Timeline Manager */}
        <CareerHistoryManager
          careerHistory={careerHistory}
          onUpdate={setCareerHistory}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-glgold hover:bg-glgold-dark text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-lg flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Experience</span>
          </button>
        </div>
      </form>
    </div>
  );
}
