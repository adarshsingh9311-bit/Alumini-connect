import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { User, GraduationCap, Save, Loader2 } from "lucide-react";

export default function StudentProfilePage() {
  const { profile, user, fetchUserProfile } = useAuth();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    roll_number: "",
    email: "",
    branch: "CSE",
    batch_year: "2025",
    skills: "",
    interests: "",
    bio: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        roll_number: profile.roll_number || "",
        email: profile.email || "",
        branch: profile.branch || "CSE",
        batch_year: profile.batch_year || "2025",
        skills: profile.skills ? (Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills) : "",
        interests: profile.interests || "",
        bio: profile.bio || ""
      });
    }
  }, [profile]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Update profile
        await supabase
          .from("profiles")
          .update({ full_name: formData.full_name })
          .eq("id", user.id);

        const skillsArray = formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        // Update student record
        await supabase
          .from("students")
          .update({
            branch: formData.branch,
            batch_year: formData.batch_year,
            skills: skillsArray,
            interests: formData.interests,
            bio: formData.bio
          })
          .eq("user_id", user.id);

        if (fetchUserProfile) await fetchUserProfile(user.id);
      }
      addToast("Student profile updated successfully!", "success");
    } catch (err) {
      addToast(err.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Student Scholar Profile</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Your verified academic record and placement interests visible to GL Bajaj alumni mentors.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E1D4] shadow-xs space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#0C1929] text-[#E5C378] font-black text-xl flex items-center justify-center shadow-xs font-serif">
            {(formData.full_name || "S")[0]}
          </div>
          <div>
            <h3 className="font-extrabold text-[#0C1929] text-lg font-serif">{formData.full_name || "Scholar"}</h3>
            <p className="text-xs text-[#8C7138] font-mono font-bold">
              {formData.roll_number ? `Roll No: ${formData.roll_number} • ` : ""}{formData.branch} (Batch {formData.batch_year})
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
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-slate-100 border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">College Roll Number</label>
            <input
              type="text"
              disabled
              value={formData.roll_number}
              className="w-full bg-slate-100 border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-500 font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Graduation Batch Year</label>
            <input
              type="text"
              name="batch_year"
              value={formData.batch_year}
              onChange={handleChange}
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
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
            placeholder="e.g. Python, React, Data Structures, Machine Learning"
            className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Career & Mentorship Interests</label>
          <textarea
            rows={3}
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="What domains, companies or guidance are you seeking from alumni?"
            className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl p-3 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
