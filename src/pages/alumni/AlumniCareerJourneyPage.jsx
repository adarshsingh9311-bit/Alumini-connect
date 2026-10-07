import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import CareerHistoryManager from "../../components/alumni/CareerHistoryManager";
import { TrendingUp, Loader2 } from "lucide-react";

export default function AlumniCareerJourneyPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [careerHistory, setCareerHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareerHistory() {
      if (!user?.id || !isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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
        console.warn("Failed to load career history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCareerHistory();
  }, [user?.id]);

  async function handleUpdate(newHistory) {
    setCareerHistory(newHistory);
    if (!user?.id || !isSupabaseConfigured || !supabase) return;

    try {
      const { data: alumRec } = await supabase
        .from("alumni")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (alumRec) {
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
        addToast("Career timeline updated successfully!", "success");
      }
    } catch (err) {
      addToast(err.message || "Failed to sync career history.", "error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-[#E7E1D4] text-[#8C7138] text-xs px-3 py-1 rounded-full font-bold uppercase mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Professional Timeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">My Career Journey</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Chronicle your career milestones from graduation to leadership roles. Inspires juniors and informs faculty.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading career history...</p>
        </div>
      ) : (
        <CareerHistoryManager
          careerHistory={careerHistory}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
