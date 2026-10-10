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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-serif">Student Scholar Profile</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Your verified academic record and placement interests visible to GL Bajaj alumni mentors.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 sm:p-8 border border-[#D9DDE3] shadow-xs space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-[#D9DDE3]">
          <div className="w-16 h-16 rounded-xl bg-[#7A1F24] text-white font-black text-xl flex items-center justify-center font-serif shadow-2xs">
            {(formData.full_name || "S")[0]}
          </div>
          <div>
            <h3 className="font-bold text-[#202124] text-lg font-serif">{formData.full_name || "Scholar"}</h3>
            <p className="text-xs text-[#7A1F24] font-mono font-bold">
              {formData.roll_number ? `Roll No: ${formData.roll_number} • ` : ""}{formData.branch} (Batch {formData.batch_year})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#202124] uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202124] uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full bg-[#F7F3EA] border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#667085] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202124] uppercase mb-1">College Roll Number</label>
            <input
              type="text"
              disabled
              value={formData.roll_number}
              className="w-full bg-[#F7F3EA] border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#667085] font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#202124] uppercase mb-1">Graduation Batch Year</label>
            <input
              type="text"
              name="batch_year"
              value={formData.batch_year}
              onChange={handleChange}
              className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202124] uppercase mb-1">Technical Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. Python, React, Data Structures, Machine Learning"
            className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#202124] uppercase mb-1">Career & Mentorship Interests</label>
          <textarea
            rows={3}
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="What domains, companies or guidance are you seeking from alumni?"
            className="w-full bg-[#F7F3EA]/30 border border-[#D9DDE3] rounded-lg p-3 text-xs sm:text-sm text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#7A1F24] focus:border-[#7A1F24]"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#D9DDE3]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#7A1F24] hover:bg-[#5C171B] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition shadow-2xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
