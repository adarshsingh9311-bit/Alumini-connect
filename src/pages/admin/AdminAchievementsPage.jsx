import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/common/EmptyState";
import { Award, CheckCircle2, Trash2, Loader2 } from "lucide-react";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchAchievements() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("achievements")
          .select("*, alumni(*, profiles(*))")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setAchievements(data.map(ach => ({
            id: ach.id,
            title: ach.title,
            description: ach.description,
            date: ach.date,
            category: ach.category,
            alumni_name: ach.alumni?.profiles?.full_name || "GLB Alumnus",
            alumni_batch: ach.alumni?.graduation_year || ach.alumni?.batch_year || "",
            is_approved: ach.is_approved
          })));
        }
      } catch (err) {
        console.warn("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  async function handleDelete(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("achievements").delete().eq("id", id);
      } catch (err) {
        console.warn("Failed to delete achievement:", err);
      }
    }
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    addToast("Achievement entry removed.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Alumni Achievements & Accolades</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Review alumni milestone submissions, verified whitepapers, patents, and featured success stories.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading accolades...</p>
        </div>
      ) : achievements.length === 0 ? (
        <EmptyState
          title="No achievements submitted yet"
          message="Accolades and milestones submitted by verified alumni will appear here for administrative review."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-3xl p-6 border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0C1929]">{ach.alumni_name} {ach.alumni_batch ? `(${ach.alumni_batch})` : ""}</span>
                  <button
                    onClick={() => handleDelete(ach.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-extrabold text-[#0C1929] text-base font-serif">{ach.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E7E1D4]">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1 ${ach.is_approved ? "text-emerald-600" : "text-amber-600"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ach.is_approved ? "Verified & Published" : "Pending Review"}</span>
                </span>
                <span className="text-slate-400">{ach.date || ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
