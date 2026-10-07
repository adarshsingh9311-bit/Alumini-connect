import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmptyState from "../../components/common/EmptyState";
import { 
  Heart, 
  Sparkles, 
  Award, 
  Briefcase, 
  Loader2 
} from "lucide-react";

export default function GLBFamilyNetwork() {
  const [achievements, setAchievements] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNetworkData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [achRes, alumRes] = await Promise.all([
          supabase.from("achievements").select("*, alumni(*, profiles(*))").eq("is_approved", true),
          supabase.from("alumni").select("*, profiles(*)").eq("is_verified", true).limit(10)
        ]);

        if (achRes.data) setAchievements(achRes.data);
        if (alumRes.data) setAlumni(alumRes.data);
      } catch (err) {
        console.warn("Failed to load family network data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNetworkData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0C1929] via-[#1A2C42] to-[#0C1929] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-[#E7E1D4]/20">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#C29B38]/30 border border-[#C29B38]/50 text-amber-200 text-xs px-3.5 py-1 rounded-full font-bold">
            <Heart className="w-3.5 h-3.5 fill-[#E5C378] text-[#E5C378]" />
            <span>"Once GLB, Always GLB."</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif">
            GLB Family Network & Milestones
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Celebrating alumni accomplishments, verified professional advancements, and generational mentorship across the GL Bajaj community.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading GLB Family Network...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0C1929] flex items-center gap-2 font-serif">
              <Award className="w-5 h-5 text-[#C29B38]" />
              <span>Verified Alumni Milestones</span>
            </h2>

            {achievements.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border border-[#E7E1D4] text-center">
                No milestone submissions published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0C1929]">{ach.alumni?.profiles?.full_name || "GLB Alumnus"}</span>
                      <span className="text-slate-400 font-mono">{ach.date || ""}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#0C1929]">{ach.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alumni in Network */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0C1929] flex items-center gap-2 font-serif">
              <Briefcase className="w-5 h-5 text-[#8C7138]" />
              <span>Notable Community Members</span>
            </h2>

            {alumni.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border border-[#E7E1D4] text-center">
                Alumni profiles will appear here as graduates register and verify.
              </p>
            ) : (
              <div className="space-y-3">
                {alumni.map((a) => (
                  <div key={a.id} className="bg-white p-5 rounded-2xl border border-[#E7E1D4] shadow-xs flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-sm text-[#0C1929] font-serif">{a.profiles?.full_name || "Alumnus"}</h4>
                      <p className="text-xs text-[#8C7138] font-semibold">{a.current_designation} {a.current_company ? `at ${a.current_company}` : ""}</p>
                      <p className="text-[11px] text-slate-500">{a.branch} (Batch {a.graduation_year || a.batch_year})</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
