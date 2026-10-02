import React, { useState, useMemo } from "react";
import { INITIAL_ALUMNI } from "../../lib/mockData";
import { BRANCH_CODES, BATCH_YEARS } from "../../lib/constants";
import AlumniCard from "../../components/student/AlumniCard";
import AlumniProfileModal from "../../components/student/AlumniProfileModal";
import MentorshipRequestModal from "../../components/student/MentorshipRequestModal";
import EmptyState from "../../components/common/EmptyState";
import { useToast } from "../../context/ToastContext";
import { Search, Filter, X, Users } from "lucide-react";

export default function StudentAlumniDirectory() {
  const [alumniList] = useState(INITIAL_ALUMNI);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [mentorsOnly, setMentorsOnly] = useState(false);

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [requestTargetAlumni, setRequestTargetAlumni] = useState(null);

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
        alum.full_name.toLowerCase().includes(q) ||
        alum.current_company.toLowerCase().includes(q) ||
        alum.current_designation.toLowerCase().includes(q) ||
        (alum.skills && alum.skills.some((s) => s.toLowerCase().includes(q)));

      const matchBranch = !selectedBranch || alum.branch === selectedBranch;
      const matchBatch = !selectedBatch || alum.batch_year === selectedBatch;
      const matchCompany = !selectedCompany || alum.current_company === selectedCompany;
      const matchLocation = !selectedLocation || alum.location?.includes(selectedLocation);
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

  function handleSubmitMentorship(requestData) {
    addToast(`Mentorship request submitted to ${requestData.alumni_name}!`, "success");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Alumni Directory & Mentors</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Search and filter verified GL Bajaj alumni by branch, batch, target company, role, skills, and city.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-teal-100 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company (Google, Microsoft), job role, or skills (React, Cloud, VLSI)..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
          />
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-glblue-750"
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
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-glblue-750"
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
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-glblue-750"
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
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-glblue-750"
          >
            <option value="">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          {/* Mentors Only Toggle */}
          <label className="flex items-center space-x-2 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={mentorsOnly}
              onChange={(e) => setMentorsOnly(e.target.checked)}
              className="rounded text-glgold focus:ring-glgold"
            />
            <span>Open for Mentorship</span>
          </label>
        </div>

        {/* Results summary & reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredAlumni.length}</strong> alumni records</span>
          {(searchQuery || selectedBranch || selectedBatch || selectedCompany || selectedLocation || mentorsOnly) && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Alumni Cards Grid */}
      {filteredAlumni.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Alumni Match Filters"
          description="Try broadening your search query or removing branch/company filters."
          actionLabel="Reset All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Modals */}
      <AlumniProfileModal
        isOpen={Boolean(selectedAlumni)}
        onClose={() => setSelectedAlumni(null)}
        alumni={selectedAlumni}
        onRequestMentorship={setRequestTargetAlumni}
      />

      <MentorshipRequestModal
        isOpen={Boolean(requestTargetAlumni)}
        onClose={() => setRequestTargetAlumni(null)}
        alumni={requestTargetAlumni}
        onSubmitRequest={handleSubmitMentorship}
      />
    </div>
  );
}
