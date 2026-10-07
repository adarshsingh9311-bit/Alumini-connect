import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { INITIAL_STUDENTS } from "../../lib/mockData";
import { User, GraduationCap, Save, BookOpen, Award } from "lucide-react";

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
    interests: current.interests || "Distributed Backend Architecture, Cloud Native Dev"
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    addToast("Student profile updated successfully!", "success");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Student Scholar Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your verified academic record and placement interests visible to GL Bajaj alumni mentors.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-teal-100 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-glgold text-white font-black text-xl flex items-center justify-center shadow-md">
            {(formData.full_name || "S")[0]}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">{formData.full_name}</h3>
            <p className="text-xs text-glblue-750 font-mono font-bold">
              Roll No: {formData.roll_number} • {formData.branch} (Batch {formData.batch_year})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College Roll Number (Primary Identity)</label>
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
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Academic Progress & CGPA</label>
            <input
              type="text"
              name="academic_info"
              value={formData.academic_info}
              onChange={handleChange}
              placeholder="e.g. 7th Semester (CGPA: 8.8)"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College Email</label>
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
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Career Interests & Guidance Target</label>
          <textarea
            rows="3"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="Describe the companies, tech stacks, or guidance you are seeking from alumni..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="bg-glgold hover:bg-glgold-dark text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
