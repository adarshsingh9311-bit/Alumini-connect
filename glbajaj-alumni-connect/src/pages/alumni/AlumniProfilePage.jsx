
const INDUSTRY_DOMAINS = [
  "Software Engineering & Cloud Computing",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Cybersecurity & Information Defense",
  "Product Management & Strategy",
  "Semiconductors & Embedded Systems",
  "Finance & FinTech",
  "E-Commerce & Digital Supply Chain",
  "Consulting & Business Strategy",
  "Healthcare & HealthTech",
  "Automotive & Electric Mobility",
  "Aerospace & Defense Technology",
  "Education & EdTech",
  "Public Sector & Civil Services",
  "Other"
];
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_ALUMNI } from "../../lib/mockData";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import CareerHistoryManager from "../../components/alumni/CareerHistoryManager";
import { Briefcase, User, Save, Globe, MapPin, FileText, Upload, CheckCircle2 } from "lucide-react";
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
    website_url: current.website_url || "",
    cv_name: current.cv_name || ""
  });
  const [careerHistory, setCareerHistory] = useState(current.career_history || []);
    const [cvFileName, setCvFileName] = useState(current.cv_name || "");
  function handleAlumniCvUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        addToast("File size exceeds 10MB limit. Please upload a smaller file.", "error");
        return;
      }
      setCvFileName(file.name);
      setFormData((prev) => ({ ...prev, cv_name: file.name }));
      addToast(`Alumni CV "${file.name}" uploaded successfully!`, "success");
    }
  }
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
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-[#ffcc4e]" />
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase">Location / City</label>
                <button
                  type="button"
                  onClick={handleDetectLiveLocation}
                  disabled={detectingLocation}
                  className="text-[11px] font-bold text-[#592106] hover:text-[#472510] flex items-center space-x-1 transition disabled:opacity-50"
                >
                  <MapPin className={`w-3.5 h-3.5 text-[#c87e35] ${detectingLocation ? "animate-pulse" : ""}`} />
                  <span>{detectingLocation ? "Detecting GPS..." : "Add Live Location"}</span>
                </button>
              </div>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter city or click Add Live Location"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Industry / Domain
              </label>
              <select
                value={
                  selectedIndustryOption || 
                  (INDUSTRY_DOMAINS.includes(formData.industry) ? formData.industry : (formData.industry ? "Other" : ""))
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedIndustryOption(val);
                  if (val !== "Other") {
                    setFormData((prev) => ({ ...prev, industry: val }));
                  } else {
                    setFormData((prev) => ({ ...prev, industry: customIndustry || prev.industry }));
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none mb-2"
              >
                <option value="">Select your industry domain...</option>
                {INDUSTRY_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>

              {(selectedIndustryOption === "Other" || (!INDUSTRY_DOMAINS.includes(formData.industry) && formData.industry)) && (
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Specify your industry / domain manually"
                  className="w-full bg-white border-2 border-[#ffcc4e] rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  autoFocus
                />
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Technical Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. Go, Kubernetes, System Design, GCP"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
            ></textarea>
          </div>
        </div>
        {/* Social / Professional Links */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-[#ffcc4e]" />
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#592106] focus:outline-none"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#592106] focus:outline-none"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
          </div>
        </div>
                {/* Optional Alumni CV / Resume */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ffcc4e]" />
                <span>Executive CV / Professional Resume</span>
                <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Upload your latest resume or executive bio for college leadership, talent inquiries, and student mentees.
              </p>
            </div>
            {cvFileName && (
              <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Attached</span>
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <label className="w-full sm:w-auto cursor-pointer bg-[#592106] hover:bg-[#472510] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center space-x-2">
              <Upload className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Choose &amp; Upload CV</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleAlumniCvUpload}
                className="hidden"
              />
            </label>
            <div className="text-xs font-mono text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex-1 truncate w-full sm:w-auto">
              {cvFileName ? `Attached: ${cvFileName}` : "No CV attached (optional for alumni)."}
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
            className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-bold px-8 py-3 rounded-xl text-sm transition shadow-lg flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Experience</span>
          </button>
        </div>
      </form>
    </div>
  );
}
