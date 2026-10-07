import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import CareerHistoryManager from "../../components/alumni/CareerHistoryManager";
import { Briefcase, User, Save, Globe, MapPin, Loader2 } from "lucide-react";

export default function AlumniProfilePage() {
  const { profile, user, fetchUserProfile } = useAuth();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    current_company: "",
    current_designation: "",
    industry: "",
    location: "",
    skills: "",
    bio: "",
    linkedin_url: "",
    github_url: "",
    website_url: ""
  });

  const [careerHistory, setCareerHistory] = useState([]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        current_company: profile.current_company || "",
        current_designation: profile.current_designation || "",
        industry: profile.industry || "",
        location: profile.location || "",
        skills: profile.skills ? (Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills) : "",
        bio: profile.bio || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        website_url: profile.website_url || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    async function fetchCareerHistory() {
      if (!user?.id || !isSupabaseConfigured || !supabase) return;

      try {
        const { data: alumRec } = await supabase
          .from("alumni")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (alumRec) {
          const { data: chData } = await supabase
            .from("career_history")
            .select("*")
            .eq("alumni_id", alumRec.id)
            .order("start_date", { ascending: false });

          if (chData) setCareerHistory(chData);
        }
      } catch (err) {
        console.warn("Error fetching career history:", err);
      }
    }

    fetchCareerHistory();
  }, [user?.id]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // Update profiles
        await supabase
          .from("profiles")
          .update({ full_name: formData.full_name })
          .eq("id", user.id);

        const skillsArray = formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        // Update alumni
        await supabase
          .from("alumni")
          .update({
            current_company: formData.current_company,
            current_designation: formData.current_designation,
            industry: formData.industry,
            location: formData.location,
            skills: skillsArray,
            bio: formData.bio,
            linkedin_url: formData.linkedin_url,
            github_url: formData.github_url,
            website_url: formData.website_url
          })
          .eq("user_id", user.id);

        if (fetchUserProfile) await fetchUserProfile(user.id);
      }
      addToast("Alumni profile successfully saved!", "success");
    } catch (err) {
      addToast(err.message || "Failed to save profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateCareerHistory(newHistory) {
    setCareerHistory(newHistory);
    if (!user?.id || !isSupabaseConfigured || !supabase) return;

    try {
      const { data: alumRec } = await supabase
        .from("alumni")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (alumRec) {
        // Delete existing and reinsert updated list
        await supabase.from("career_history").delete().eq("alumni_id", alumRec.id);
        if (newHistory.length > 0) {
          const insertPayload = newHistory.map(item => ({
            alumni_id: alumRec.id,
            company: item.company,
            designation: item.designation,
            start_date: item.start_date,
            end_date: item.end_date,
            is_current: Boolean(item.is_current),
            description: item.description
          }));
          await supabase.from("career_history").insert(insertPayload);
        }
      }
    } catch (err) {
      console.warn("Failed to persist career history:", err);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Alumni Profile & Career Journey</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Maintain your current designation, company, skills, and employment timeline for GL Bajaj students and faculty.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <User className="w-5 h-5 text-[#8C7138]" />
            <h3 className="font-bold text-[#0C1929] text-sm uppercase tracking-wide font-serif">
              Professional Identity
            </h3>
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
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Company / Organization</label>
              <input
                type="text"
                name="current_company"
                value={formData.current_company}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft, Adobe"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Designation / Role</label>
              <input
                type="text"
                name="current_designation"
                value={formData.current_designation}
                onChange={handleChange}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Industry Domain</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Cloud Infrastructure, AI/ML, FinTech"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location / City</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, India or Seattle, USA"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn Profile URL</label>
              <input
                type="url"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Skills & Specializations</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. Kubernetes, System Design, React, AWS, Python"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bio / Advice for GLB Juniors</label>
            <textarea
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="A brief message on your journey or what topics you enjoy mentoring GL Bajaj scholars in..."
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl p-3 text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
            />
          </div>
        </div>

        {/* Career Timeline Manager */}
        <CareerHistoryManager
          careerHistory={careerHistory}
          onUpdate={handleUpdateCareerHistory}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Profile & Timeline</span>
          </button>
        </div>
      </form>
    </div>
  );
}
