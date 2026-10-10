import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/common/EmptyState";
import { CheckCircle2, XCircle, Award, Briefcase, Loader2 } from "lucide-react";

export default function AdminVerificationPage() {
  const { addToast } = useToast();
  const [alumniList, setAlumniList] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("alumni"); // alumni | achievements

  useEffect(() => {
    async function fetchPendingRecords() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [alumRes, achRes] = await Promise.all([
          supabase.from("alumni").select("*, profiles(*)").eq("is_verified", false),
          supabase.from("achievements").select("*, alumni(*, profiles(*))").eq("is_approved", false)
        ]);

        if (alumRes.data) {
          setAlumniList(alumRes.data.map(a => ({
            id: a.id,
            full_name: a.profiles?.full_name || "Alumnus",
            roll_number: a.roll_number,
            branch: a.branch,
            batch_year: a.graduation_year || a.batch_year,
            current_company: a.current_company,
            current_designation: a.current_designation,
            bio: a.bio,
            is_verified: a.is_verified
          })));
        }

        if (achRes.data) {
          setAchievements(achRes.data.map(ach => ({
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
        console.warn("Failed to load verification queue:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPendingRecords();
  }, []);

  async function verifyAlumni(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("alumni").update({ is_verified: true }).eq("id", id);
      } catch (err) {
        console.warn("Error updating alumni verification:", err);
      }
    }
    setAlumniList((prev) => prev.filter((a) => a.id !== id));
    addToast("Alumnus identity verified! Badge granted.", "success");
  }

  async function rejectAlumni(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("alumni").delete().eq("id", id);
      } catch (err) {
        console.warn("Error deleting rejected alumni:", err);
      }
    }
    setAlumniList((prev) => prev.filter((a) => a.id !== id));
    addToast("Alumni registration rejected.", "info");
  }

  async function verifyAchievement(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("achievements").update({ is_approved: true }).eq("id", id);
      } catch (err) {
        console.warn("Error updating achievement:", err);
      }
    }
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
    addToast("Achievement verified and published to the student showcase!", "success");
  }

  async function rejectAchievement(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("achievements").delete().eq("id", id);
      } catch (err) {
        console.warn("Error deleting rejected achievement:", err);
      }
    }
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
    addToast("Achievement submission rejected.", "info");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202124] font-serif">Verification Desk</h1>
        <p className="text-xs sm:text-sm text-[#667085] mt-1">
          Review alumni registrations against college roll numbers, and audit milestone submissions before public showcase.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-[#D9DDE3] pb-3">
        <button
          onClick={() => setActiveTab("alumni")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "alumni"
              ? "bg-[#7A1F24] text-white shadow-2xs"
              : "bg-[#F7F3EA] text-[#667085] hover:text-[#202124] border border-[#D9DDE3]"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Pending Alumni ({alumniList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("achievements")}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === "achievements"
              ? "bg-[#7A1F24] text-white shadow-2xs"
              : "bg-[#F7F3EA] text-[#667085] hover:text-[#202124] border border-[#D9DDE3]"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Pending Accolades ({achievements.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-[#667085]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7A1F24] mb-3" />
          <p className="text-sm">Loading verification queue...</p>
        </div>
      ) : activeTab === "alumni" ? (
        alumniList.length === 0 ? (
          <EmptyState
            title="No alumni pending verification"
            message="All registered alumni have been reviewed and verified."
          />
        ) : (
          <div className="space-y-4">
            {alumniList.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-xl p-5 border border-[#D9DDE3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-[#202124] font-serif">{a.full_name}</h3>
                    <span className="text-[10px] font-mono font-bold bg-[#F7F3EA] text-[#7A1F24] border border-[#D9DDE3] px-2 py-0.5 rounded">
                      Roll No: {a.roll_number}
                    </span>
                  </div>
                  <p className="text-xs text-[#667085]">
                    {a.branch} (Batch {a.batch_year}) • {a.current_designation} at {a.current_company}
                  </p>
                  {a.bio && <p className="text-[11px] text-[#667085] italic max-w-xl">"{a.bio}"</p>}
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => rejectAlumni(a.id)}
                    className="p-2 px-3 rounded-lg border border-[#B42318]/30 text-[#B42318] hover:bg-[#B42318]/10 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => verifyAlumni(a.id)}
                    className="p-2 px-4 rounded-lg bg-[#2E6B4A] hover:bg-[#235338] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Grant Access</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : achievements.length === 0 ? (
        <EmptyState
          title="No achievements pending review"
          message="All submitted accolades have been reviewed by college administration."
        />
      ) : (
        <div className="space-y-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="bg-white rounded-xl p-5 border border-[#D9DDE3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F7F3EA] text-[#7A1F24] px-2 py-0.5 rounded border border-[#D9DDE3]">
                  {ach.category || "Career Milestone"}
                </span>
                <h3 className="font-bold text-base text-[#202124] font-serif">{ach.title}</h3>
                <p className="text-xs text-[#667085] leading-relaxed max-w-xl">{ach.description}</p>
                <div className="text-[11px] text-[#667085]">
                  Submitted by: <strong>{ach.alumni_name}</strong> ({ach.alumni_batch})
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => rejectAchievement(ach.id)}
                  className="p-2 px-3 rounded-lg border border-[#B42318]/30 text-[#B42318] hover:bg-[#B42318]/10 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => verifyAchievement(ach.id)}
                  className="p-2 px-4 rounded-lg bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Publish</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
