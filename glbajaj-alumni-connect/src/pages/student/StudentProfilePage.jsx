import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_STUDENTS } from "../../lib/mockData";
import { User, GraduationCap, Save, BookOpen, Award, FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";

export default function StudentProfilePage() {
  const { profile } = useAuth();
  const { addToast } = useToast();
  const current = profile || INITIAL_STUDENTS[0];

  const [formData, setFormData] = useState({
    full_name: current.full_name || "",
    roll_number: current.roll_number || "",
    email: current.email || "",
    branch: current.branch || "CSE",
    batch_year: current.batch_year || "2025",
    academic_info: current.academic_info || "B.Tech CSE - 7th Semester (CGPA: 8.8)",
    skills: current.skills ? (Array.isArray(current.skills) ? current.skills.join(", ") : current.skills) : "",
    interests: current.interests || "Distributed Backend Architecture, Cloud Native Dev",
    linkedin_url: current.linkedin_url || "",
    github_url: current.github_url || "",
    other_profile_url: current.other_profile_url || "",
    resume_name: current.resume_name || "Resume_GLB_Scholar.pdf"
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState(current.resume_name || "Resume_GLB_Scholar.pdf");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleCvUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("File size exceeds 5MB limit. Please upload a smaller PDF/DOCX file.", "error");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setFormData((prev) => ({ ...prev, resume_name: file.name }));
      addToast(`CV "${file.name}" uploaded successfully!`, "success");
    }
  }

  function handleSave(e) {
    e.preventDefault();
    if (!cvFileName) {
      addToast("CV / Resume is mandatory for students. Please upload your CV.", "error");
      return;
    }
    addToast("Student profile & verified CV updated successfully!", "success");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Scholar Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your verified academic record, placement interests, and mandatory CV visible to GL Bajaj alumni mentors.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#ffcc4e] text-white font-black text-xl flex items-center justify-center shadow-md">
            {(formData.full_name || "S")[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{formData.full_name || "Student Scholar"}</h3>
            <p className="text-xs text-slate-500">Roll No: {formData.roll_number} • {formData.branch} (Batch {formData.batch_year})</p>
          </div>
        </div>

        {/* Mandatory Student CV / Resume Section */}
        <div className="p-5 rounded-2xl bg-[#faf6eb] border-2 border-dashed border-[#ffcc4e] space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-black text-[#592106] uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#592106]" />
                <span>Student Curriculum Vitae (CV / Resume)</span>
                <span className="text-red-500 font-black text-sm">* (Mandatory)</span>
              </label>
              <p className="text-[11px] text-slate-600">
                Alumni mentors require your latest resume for referral screening, technical interviews, and mock reviews (PDF or DOCX, max 5MB).
              </p>
            </div>
            {cvFileName ? (
              <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Uploaded</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-red-600" />
                <span>Required</span>
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
                onChange={handleCvUpload}
                className="hidden"
              />
            </label>
            <div className="text-xs font-mono text-slate-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 flex-1 truncate w-full sm:w-auto">
              {cvFileName ? `Attached: ${cvFileName}` : "No file attached yet. Uploading a CV is required."}
            </div>
          </div>
        </div>

        {/* Social / Portfolio Links */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Professional Profile Links
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                LinkedIn Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                GitHub Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Portfolio / Other Profile URL
              </label>
              <input
                type="url"
                name="other_profile_url"
                value={formData.other_profile_url}
                onChange={handleChange}
                placeholder="https://yourportfolio.dev"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College Roll Number</label>
            <input
              type="text"
              disabled
              value={formData.roll_number}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Progress &amp; CGPA</label>
            <input
              type="text"
              name="academic_info"
              value={formData.academic_info}
              onChange={handleChange}
              placeholder="e.g. 7th Semester (CGPA: 8.8)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registered College Email</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Technical Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, Python, Docker, Data Structures"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Career Interests &amp; Guidance Target</label>
          <textarea
            rows="3"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Describe the companies, tech stacks, or guidance you are seeking from alumni..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#592106] focus:outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-black px-6 py-2.5 rounded-xl text-sm transition shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
