import React, { useState, useEffect, useMemo } from "react";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AlumniCard from "../../components/student/AlumniCard";
import AlumniProfileModal from "../../components/student/AlumniProfileModal";
import MentorshipRequestModal from "../../components/student/MentorshipRequestModal";
import EmptyState from "../../components/common/EmptyState";
import { Search, Filter, X, Users, Loader2 } from "lucide-react";

export default function StudentAlumniDirectory() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [mentorsOnly, setMentorsOnly] = useState(false);

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestTargetAlumni, setRequestTargetAlumni] = useState(null);

  useEffect(() => {
    async function fetchAlumni() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("alumni")
          .select("*, profiles(*)")
          .eq("is_verified", true)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setAlumniList(data.map((a) => ({
            id: a.id,
            user_id: a.user_id,
            full_name: a.profiles?.full_name || "GLB Alumnus",
            email: a.profiles?.email || "",
            avatar_url: a.profiles?.avatar_url || "",
            branch: a.branch,
            batch_year: a.graduation_year || a.batch_year,
            current_company: a.current_company || "",
            current_designation: a.current_designation || "",
            industry: a.industry || "",
            location: a.location || "",
            skills: Array.isArray(a.skills) ? a.skills : [],
            bio: a.bio || "",
            is_available_for_mentorship: a.is_available_for_mentorship,
            is_verified: a.is_verified
          })));
        }
      } catch (err) {
        console.warn("Failed to fetch alumni directory:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlumni();
  }, []);

  // Extract unique companies & locations for quick dropdowns
  const companies = useMemo(() => {
    return Array.from(new Set(alumniList.map((a) => a.current_company).filter(Boolean)));
  }, [alumniList]);

  const locations = useMemo(() => {
    return Array.from(new Set(alumniList.map((a) => a.location).filter(Boolean)));
  }, [alumniList]);

  const filteredAlumni = useMemo(() => {
    return alumniList.filter((alum) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        alum.full_name?.toLowerCase().includes(q) ||
        alum.current_company?.toLowerCase().includes(q) ||
        alum.current_designation?.toLowerCase().includes(q) ||
        (alum.skills && alum.skills.some((s) => s.toLowerCase().includes(q)));

      const matchBranch = !selectedBranch || alum.branch === selectedBranch;
      const matchBatch = !selectedBatch || alum.batch_year === selectedBatch;
      const matchCompany = !selectedCompany || alum.current_company === selectedCompany;
      const matchLocation = !selectedLocation || alum.location?.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchMentor = !mentorsOnly || alum.is_available_for_mentorship;

      return matchSearch && matchBranch && matchBatch && matchCompany && matchLocation && matchMentor;
    });
  }, [alumniList, searchQuery, selectedBranch, selectedBatch, selectedCompany, selectedLocation, mentorsOnly]);

  function resetFilters() {
    setSearchQuery("");
    setSelectedBranch("");
    setSelectedBatch("");
    setSelectedCompany("");
    setSelectedLocation("");
    setMentorsOnly(false);
  }

  async function handleSubmitMentorship(requestData) {
    if (!user?.id || !isSupabaseConfigured || !supabase) {
      addToast("Please sign in with a verified student account to request mentorship.", "error");
      return;
    }

    try {
      const targetAlumniUserId = requestData.alumni_user_id || requestData.user_id || requestData.alumni_id;
      const { error } = await supabase.from("mentorship_requests").insert({
        student_id: user.id,
        alumni_id: targetAlumniUserId,
        topic: requestData.topic || "Career Guidance",
        message: requestData.message,
        preferred_time: requestData.preferred_time || "Flexible",
        status: "pending"
      });

      if (error) throw error;
      addToast(`Mentorship request submitted to ${requestData.alumni_name || "mentor"}!`, "success");
      setRequestTargetAlumni(null);
    } catch (err) {
      addToast(err.message || "Failed to submit request.", "error");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Alumni Directory & Mentors</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Search and filter verified GL Bajaj alumni by branch, batch, target company, role, skills, and city.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E7E1D4] shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company (Google, Microsoft), job role, or skills (React, Cloud, VLSI)..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl text-xs sm:text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          />
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          >
            <option value="">All Branches</option>
            {BRANCH_CODES.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Batch Year */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          >
            <option value="">All Batch Years</option>
            {BATCH_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Company */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Location */}
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Mentors Only Toggle */}
          <label className="flex items-center space-x-2 bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-3 py-2 text-xs font-semibold text-[#0C1929] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mentorsOnly}
              onChange={(e) => setMentorsOnly(e.target.checked)}
              className="rounded text-[#C29B38] focus:ring-[#C29B38]"
            />
            <span>Open for Mentorship</span>
          </label>
        </div>

        {/* Active Filters Clear Button */}
        {(searchQuery || selectedBranch || selectedBatch || selectedCompany || selectedLocation || mentorsOnly) && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-[#718096]">
              Showing {filteredAlumni.length} of {alumniList.length} alumni
            </span>
            <button
              onClick={resetFilters}
              className="text-[#8C7138] hover:underline font-semibold flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Alumni Results Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm font-semibold text-[#0C1929]">Loading Alumni Directory...</p>
        </div>
      ) : filteredAlumni.length === 0 ? (
        <EmptyState
          title="No alumni profiles available yet"
          message={
            alumniList.length === 0
              ? "No verified alumni have registered in the database yet. Profiles will appear here as graduates join."
              : "No alumni match the selected search criteria. Try clearing some filters."
          }
          actionLabel="Clear Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAlumni.map((alum) => (
            <AlumniCard
              key={alum.id}
              alumni={alum}
              onOpenProfile={setSelectedAlumni}
              onRequestMentorship={setRequestTargetAlumni}
            />
          ))}
        </div>
      )}

      {/* Alumni Profile Detail Modal */}
      <AlumniProfileModal
        isOpen={Boolean(selectedAlumni)}
        onClose={() => setSelectedAlumni(null)}
        alumni={selectedAlumni}
        onRequestMentorship={(alumni) => {
          setSelectedAlumni(null);
          setRequestTargetAlumni(alumni);
        }}
      />

      {/* Mentorship Request Modal */}
      <MentorshipRequestModal
        isOpen={Boolean(requestTargetAlumni)}
        onClose={() => setRequestTargetAlumni(null)}
        alumni={requestTargetAlumni}
        onSubmit={handleSubmitMentorship}
      />
    </div>
  );
}
