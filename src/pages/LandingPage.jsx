import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES, COLLEGE_NAME } from "../lib/constants";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { formatEducation } from "../lib/formatters";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  MessageSquare, 
  Calendar, 
  Bell, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  X, 
  Search,
  BookOpen,
  Award
} from "lucide-react";

export default function LandingPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);

  // Live Supabase Data
  const [alumniList, setAlumniList] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    alumniCount: 0,
    departmentsCount: 12,
    mentorshipCount: 0,
    batchesConnected: "2009 - 2026"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch Verified Alumni for Featured Section
        const { data: alumData, count: totalAlum } = await supabase
          .from("alumni")
          .select("*, profiles(*)", { count: "exact" })
          .eq("is_verified", true)
          .limit(6);

        if (alumData) {
          setAlumniList(alumData.map((a) => ({
            id: a.id,
            user_id: a.user_id,
            name: a.profiles?.full_name || "GLB Alumnus",
            email: a.profiles?.email || "",
            avatar_url: a.profiles?.avatar_url || "",
            branch: a.branch,
            batch_year: a.graduation_year || a.batch_year,
            current_company: a.current_company || "",
            current_designation: a.current_designation || "",
            location: a.location || "",
            skills: Array.isArray(a.skills) ? a.skills : [],
            bio: a.bio || "",
            is_available_for_mentorship: a.is_available_for_mentorship,
            is_verified: a.is_verified
          })));
        }

        // 2. Fetch Recent Official Notices
        const { data: noticeData } = await supabase
          .from("notices")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(4);

        if (noticeData) setNotices(noticeData);

        // 3. Fetch Upcoming Events
        const { data: eventData } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (eventData) setEvents(eventData);

        // 4. Fetch Mentorship Requests Count
        const { count: mentCount } = await supabase
          .from("mentorship_requests")
          .select("*", { count: "exact", head: true });

        setStats((prev) => ({
          ...prev,
          alumniCount: totalAlum || alumData?.length || 0,
          mentorshipCount: mentCount || 0
        }));

      } catch (err) {
        console.warn("Error fetching homepage records:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  function handleSelectPortal(targetRole) {
    setAuthModalOpen(false);
    if (user && role === targetRole) {
      if (role === USER_ROLES.STUDENT) navigate("/student/dashboard");
      else if (role === USER_ROLES.ALUMNI) navigate("/alumni/dashboard");
      else if (role === USER_ROLES.ADMIN) navigate("/admin/dashboard");
    } else {
      navigate(`/login?role=${targetRole}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#202124] flex flex-col font-sans antialiased selection:bg-[#7A1F24] selection:text-white">
      
      {/* ============================================================
          1. INSTITUTIONAL TOP BAR & HEADER
      ============================================================ */}
      <div className="bg-[#5C171B] text-white py-1.5 px-4 sm:px-6 lg:px-8 text-xs border-b border-[#481115]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center space-x-2 truncate">
            <span className="font-bold text-[#B08A3E] uppercase tracking-wider">GLB Pride</span>
            <span className="text-white/40">|</span>
            <span className="text-white/90 truncate">
              Official Alumni & Mentorship Cell of <strong>G. L. Bajaj Institute of Technology & Management</strong>
            </span>
          </div>
          <div className="flex items-center space-x-3 text-white/80 shrink-0">
            <span className="font-bold text-[#B08A3E]">"Once GLB, Always GLB."</span>
            <span className="text-white/40">|</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-[#B08A3E]" />
              <span>Greater Noida, Delhi-NCR</span>
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white border-b border-[#D9DDE3] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              GL
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg tracking-wide text-[#7A1F24] leading-tight">
                GL BAJAJ
              </div>
              <div className="text-[10px] font-bold text-[#667085] tracking-widest uppercase">
                Alumni Connect & Mentorship
              </div>
            </div>
          </Link>

          {/* Institutional Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-[#202124]">
            <Link to="/" className="text-[#7A1F24] pb-1 border-b-2 border-[#7A1F24]">
              Home
            </Link>
            <a href="#about" className="text-[#667085] hover:text-[#7A1F24] transition">
              About
            </a>
            <a href="#alumni" className="text-[#667085] hover:text-[#7A1F24] transition">
              Alumni Directory
            </a>
            <a href="#mentorship" className="text-[#667085] hover:text-[#7A1F24] transition">
              Mentorship
            </a>
            <a href="#events" className="text-[#667085] hover:text-[#7A1F24] transition">
              Events
            </a>
            <a href="#notices" className="text-[#667085] hover:text-[#7A1F24] transition">
              Notices
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Portal Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <Link
              to="/register"
              className="hidden sm:inline-flex bg-white hover:bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3] text-xs font-semibold px-3.5 py-2 rounded-md transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. INSTITUTIONAL HERO SECTION
      ============================================================ */}
      <section className="bg-[#7A1F24] text-white py-14 sm:py-20 border-b border-[#5C171B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center space-x-2 bg-[#5C171B] border border-white/20 text-[#B08A3E] text-xs font-semibold px-3 py-1 rounded">
              <GraduationCap className="w-4 h-4 text-[#B08A3E]" />
              <span>G. L. Bajaj Institute of Technology & Management</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-serif leading-tight">
              Once GLB, Always GLB.
            </h1>

            <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
              The official college alumni & mentorship platform connecting current GL Bajaj scholars with verified graduates across top global corporations, research centers, and public institutions.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleSelectPortal(USER_ROLES.STUDENT)}
                className="bg-white hover:bg-[#F7F3EA] text-[#7A1F24] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-md transition shadow-xs flex items-center space-x-2 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#7A1F24]" />
                <span>Student Login</span>
              </button>

              <button
                onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
                className="bg-[#5C171B] hover:bg-[#481115] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-md transition border border-white/20 flex items-center space-x-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-[#B08A3E]" />
                <span>Alumni Login</span>
              </button>

              <a
                href="#alumni"
                className="bg-transparent hover:bg-white/10 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-md transition border border-white/20 flex items-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Explore Alumni</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          3. COLLEGE PRESENCE & VITAL STATS (Practical, Solid Borders)
      ============================================================ */}
      <section className="bg-white border-b border-[#D9DDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D9DDE3]">
            
            <div className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1F24] font-serif">
                {stats.alumniCount > 0 ? `${stats.alumniCount}+` : "Verified"}
              </div>
              <div className="text-xs font-semibold text-[#202124] uppercase tracking-wider mt-1">
                Registered Alumni
              </div>
              <p className="text-[11px] text-[#667085] mt-0.5">Database verified graduates</p>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1F24] font-serif">
                12
              </div>
              <div className="text-xs font-semibold text-[#202124] uppercase tracking-wider mt-1">
                Academic Departments
              </div>
              <p className="text-[11px] text-[#667085] mt-0.5">Engineering & Management</p>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1F24] font-serif">
                {stats.mentorshipCount > 0 ? `${stats.mentorshipCount}` : "Active"}
              </div>
              <div className="text-xs font-semibold text-[#202124] uppercase tracking-wider mt-1">
                Mentorship Sessions
              </div>
              <p className="text-[11px] text-[#667085] mt-0.5">1-on-1 Guidance Conducted</p>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1F24] font-serif">
                2009 - 2026
              </div>
              <div className="text-xs font-semibold text-[#202124] uppercase tracking-wider mt-1">
                Graduating Batches
              </div>
              <p className="text-[11px] text-[#667085] mt-0.5">Global alumni footprint</p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          4. ABOUT COLLEGE ALUMNI CELL
      ============================================================ */}
      <section id="about" className="py-14 sm:py-16 bg-[#F7F3EA] border-b border-[#D9DDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border border-[#D9DDE3] p-6 sm:p-10 shadow-xs">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center space-x-2 text-[#7A1F24] text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#7A1F24]" />
                <span>About Alumni & Mentorship Cell</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202124] font-serif">
                Connecting Generations of GL Bajaj Excellence
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                The G. L. Bajaj Alumni & Mentorship Cell is dedicated to fostering meaningful lifelong connections between the college, its alumni community, and current students. We provide a structured environment for career mentoring, placement preparation, industry-academic exchange, and institutional advancement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#D9DDE3]">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded bg-[#F7F3EA] text-[#7A1F24] flex items-center justify-center font-bold text-xs border border-[#D9DDE3]">
                  1
                </div>
                <h4 className="font-bold text-sm text-[#202124]">Verified College Identity</h4>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Every student and alumni profile is authenticated with official GL Bajaj roll numbers and college records.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded bg-[#F7F3EA] text-[#7A1F24] flex items-center justify-center font-bold text-xs border border-[#D9DDE3]">
                  2
                </div>
                <h4 className="font-bold text-sm text-[#202124]">Purposeful Mentorship</h4>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Students request direct guidance from seniors working at top tier tech, manufacturing, finance, and research firms.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded bg-[#F7F3EA] text-[#7A1F24] flex items-center justify-center font-bold text-xs border border-[#D9DDE3]">
                  3
                </div>
                <h4 className="font-bold text-sm text-[#202124]">Institutional Integrity</h4>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Strictly administered by college faculty and departmental coordinators without commercial advertising or spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. FEATURED ALUMNI DIRECTORY (Real Supabase Data Only)
      ============================================================ */}
      <section id="alumni" className="py-14 sm:py-16 bg-white border-b border-[#D9DDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D9DDE3] pb-4">
            <div>
              <div className="text-xs font-bold text-[#7A1F24] uppercase tracking-wider">
                Alumni Directory
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#202124] font-serif mt-1">
                Featured GL Bajaj Alumni
              </h2>
              <p className="text-xs text-[#667085] mt-0.5">
                Verified graduates contributing across global industries and institutions.
              </p>
            </div>

            <Link
              to="/student/alumni"
              className="text-xs font-bold text-[#7A1F24] hover:underline flex items-center space-x-1"
            >
              <span>View full directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#667085] text-xs">
              Loading alumni directory from college records...
            </div>
          ) : alumniList.length === 0 ? (
            <div className="bg-[#F7F3EA] rounded-lg border border-[#D9DDE3] p-10 text-center space-y-2">
              <Users className="w-8 h-8 text-[#667085] mx-auto" />
              <h3 className="font-bold text-sm text-[#202124]">No Alumni Profiles Published Yet</h3>
              <p className="text-xs text-[#667085] max-w-md mx-auto">
                Alumni records will appear here as graduates register and verify their accounts.
              </p>
              <button
                onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
                className="mt-3 inline-block bg-[#7A1F24] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#5C171B] transition"
              >
                Alumni Portal Sign In
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumniList.map((alum) => (
                <div
                  key={alum.id}
                  className="bg-white rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] transition p-5 flex flex-col justify-between shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      {alum.avatar_url ? (
                        <img
                          src={alum.avatar_url}
                          alt={alum.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#D9DDE3] shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#F7F3EA] text-[#7A1F24] font-bold text-base flex items-center justify-center border border-[#D9DDE3] shrink-0">
                          {alum.name[0].toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-bold text-sm text-[#202124] truncate">
                            {alum.name}
                          </h4>
                          {alum.is_verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B4A] shrink-0" />
                          )}
                        </div>
                        <div className="text-xs font-semibold text-[#7A1F24] truncate">
                          {alum.current_designation || "GLB Alumnus"}
                        </div>
                        <div className="text-xs text-[#667085] truncate">
                          {alum.current_company ? `at ${alum.current_company}` : "GL Bajaj Graduate"}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D9DDE3]/60 flex flex-wrap gap-2 text-[11px] text-[#667085]">
                      <span className="bg-[#F7F3EA] px-2 py-0.5 rounded border border-[#D9DDE3] text-[#202124] font-medium">
                        {formatEducation(alum.branch, alum.batch_year)}
                      </span>
                      {alum.location && (
                        <span className="bg-[#F7F3EA] px-2 py-0.5 rounded border border-[#D9DDE3] text-[#202124]">
                          {alum.location}
                        </span>
                      )}
                    </div>

                    {alum.bio && (
                      <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                        "{alum.bio}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#D9DDE3]/60 flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedAlumnus(alum)}
                      className="flex-1 bg-white hover:bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3] text-xs font-semibold py-2 rounded-md transition text-center cursor-pointer"
                    >
                      View Profile
                    </button>
                    {alum.is_available_for_mentorship ? (
                      <button
                        onClick={() => {
                          if (user && role === USER_ROLES.STUDENT) {
                            navigate("/student/alumni");
                          } else {
                            navigate("/login?role=student");
                          }
                        }}
                        className="flex-1 bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold py-2 rounded-md transition text-center flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Request Mentor</span>
                      </button>
                    ) : (
                      <span className="flex-1 bg-[#F7F3EA] text-[#667085] text-[11px] font-medium py-2 rounded-md text-center border border-[#D9DDE3]">
                        Mentorship Full
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          6. MENTORSHIP HIGHLIGHTS
      ============================================================ */}
      <section id="mentorship" className="py-14 sm:py-16 bg-[#F7F3EA] border-b border-[#D9DDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-bold text-[#7A1F24] uppercase tracking-wider">
              1-on-1 Student Mentorship
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202124] font-serif">
              Structured Guidance for Career Advancement
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              Connect directly with alumni mentors who have navigated the campus-to-corporate transition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-lg border border-[#D9DDE3] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-sm text-[#202124]">1. Discover & Filter</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Filter verified alumni directory by target role, technology stack, company, branch, or graduation year.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#D9DDE3] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-sm text-[#202124]">2. Submit Specific Request</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Select your focus area: Mock Interviews, Resume Critique, Competitive Coding, or Higher Education advice.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#D9DDE3] p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-sm text-[#202124]">3. Direct 1-on-1 Portal Messaging</h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                Upon mentor approval, interact securely via private portal chat to schedule calls and receive detailed feedback.
              </p>
            </div>

          </div>

          <div className="bg-[#7A1F24] rounded-lg p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-white">Are you a GL Bajaj graduate?</h3>
              <p className="text-xs text-white/80 mt-1">
                Give back to your alma mater by offering mentorship guidance to junior scholars.
              </p>
            </div>
            <button
              onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
              className="bg-white text-[#7A1F24] hover:bg-[#F7F3EA] text-xs font-bold px-5 py-2.5 rounded-md transition shadow-xs shrink-0 cursor-pointer"
            >
              Sign In as Mentor
            </button>
          </div>

        </div>
      </section>

      {/* ============================================================
          7. NOTICES & UPCOMING EVENTS (Real Supabase Records)
      ============================================================ */}
      <section className="py-14 sm:py-16 bg-white border-b border-[#D9DDE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Official College Notices */}
            <div id="notices" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#7A1F24]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wide">
                    Official College Notices
                  </h3>
                </div>
                <Link
                  to="/student/notices"
                  className="text-xs text-[#7A1F24] font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-[#667085]">
                  Loading official notices...
                </div>
              ) : notices.length === 0 ? (
                <div className="bg-[#F7F3EA] rounded-lg border border-[#D9DDE3] p-6 text-center text-xs text-[#667085]">
                  No official notices published at this time.
                </div>
              ) : (
                <div className="space-y-3">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-lg border border-[#D9DDE3] bg-[#F7F3EA] hover:bg-white transition space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#7A1F24] uppercase">
                          {n.category || "General Notice"}
                        </span>
                        <span className="text-[10px] text-[#667085]">
                          {n.created_at ? new Date(n.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-[#202124]">
                        {n.title}
                      </h4>
                      <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Upcoming Events & Webinars */}
            <div id="events" className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#D9DDE3] pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#7A1F24]" />
                  <h3 className="font-bold text-sm text-[#202124] uppercase tracking-wide">
                    Campus Events & Reunions
                  </h3>
                </div>
                <Link
                  to="/student/events"
                  className="text-xs text-[#7A1F24] font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-[#667085]">
                  Loading campus events...
                </div>
              ) : events.length === 0 ? (
                <div className="bg-[#F7F3EA] rounded-lg border border-[#D9DDE3] p-6 text-center text-xs text-[#667085]">
                  No upcoming campus events currently scheduled.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-lg border border-[#D9DDE3] bg-[#F7F3EA] hover:bg-white transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#7A1F24] uppercase">
                          {ev.category || "Alumni Meet"}
                        </span>
                        <span className="text-[10px] text-[#667085] flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{ev.date ? new Date(ev.date).toLocaleDateString() : "Upcoming"}</span>
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-[#202124]">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-[#667085] line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                      {ev.location && (
                        <div className="text-[11px] text-[#667085] flex items-center space-x-1 pt-1">
                          <MapPin className="w-3 h-3 text-[#7A1F24]" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          8. INSTITUTIONAL FOOTER
      ============================================================ */}
      <footer className="bg-[#5C171B] text-white border-t border-[#481115] text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            
            {/* Col 1: Identity & Address */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-white text-[#7A1F24] flex items-center justify-center font-bold text-base shadow-xs">
                  GL
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide text-white">
                    GL BAJAJ ALUMNI CONNECT
                  </h4>
                  <p className="text-[10px] text-[#B08A3E] font-bold uppercase tracking-wider">
                    "Once GLB, Always GLB."
                  </p>
                </div>
              </div>

              <p className="text-xs text-white/80 leading-relaxed">
                {COLLEGE_NAME}
              </p>

              <div className="space-y-1.5 text-xs text-white/70 pt-1">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B08A3E] shrink-0 mt-0.5" />
                  <span>Plot No. 2, Knowledge Park III, Greater Noida, Gautam Budh Nagar, UP 201306</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-[#B08A3E] shrink-0" />
                  <span>+91 (0120) 2323818 / 19</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-[#B08A3E] shrink-0" />
                  <span>alumni@glbitm.ac.in</span>
                </div>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#B08A3E] border-b border-white/10 pb-1.5">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <Link to="/" className="hover:text-white transition">Home</Link>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition">About Alumni Cell</a>
                </li>
                <li>
                  <a href="#alumni" className="hover:text-white transition">Alumni Directory</a>
                </li>
                <li>
                  <a href="#mentorship" className="hover:text-white transition">Mentorship Program</a>
                </li>
                <li>
                  <a href="#events" className="hover:text-white transition">Campus Events</a>
                </li>
                <li>
                  <a href="#notices" className="hover:text-white transition">Official Notices</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Three Institutional Portals */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#B08A3E] border-b border-white/10 pb-1.5">
                Three College Portals
              </h4>
              <ul className="space-y-2 text-xs text-white/80">
                <li>
                  <button
                    onClick={() => handleSelectPortal(USER_ROLES.STUDENT)}
                    className="hover:text-white transition text-left flex items-center space-x-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#B08A3E]" />
                    <span>Student Portal</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
                    className="hover:text-white transition text-left flex items-center space-x-1.5"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#B08A3E]" />
                    <span>Alumni Portal</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSelectPortal(USER_ROLES.ADMIN)}
                    className="hover:text-white transition text-left flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B08A3E]" />
                    <span>Admin Cell Portal</span>
                  </button>
                </li>
                <li className="pt-1">
                  <Link to="/register" className="text-[#B08A3E] hover:underline">
                    New Scholar / Alumni Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Institutional Links */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#B08A3E] border-b border-white/10 pb-1.5">
                Official Information
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow. Approved by AICTE, Ministry of Education, Govt. of India.
              </p>
              <div className="pt-2 text-xs text-white/80 space-y-1">
                <div>Academic Year: 2026 - 2027</div>
                <div className="text-[11px] text-white/60">Institutional Roll Number Auth Enabled</div>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
            <div>
              © 2026 G. L. Bajaj Institute of Technology & Management. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#B08A3E] font-semibold">"Once GLB, Always GLB."</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ============================================================
          SIGN IN / THREE PORTALS SELECTOR MODAL
      ============================================================ */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg border border-[#D9DDE3] max-w-md w-full p-6 text-[#202124] shadow-xl relative animate-in fade-in duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#202124] p-1 rounded-md hover:bg-[#F7F3EA]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#7A1F24] text-white flex items-center justify-center font-bold text-base mx-auto mb-2 shadow-xs">
                GL
              </div>
              <h3 className="text-lg font-bold text-[#202124] font-serif">
                Select Your College Portal
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">
                G. L. Bajaj Alumni Connect & Mentorship
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectPortal(USER_ROLES.STUDENT)}
                className="w-full text-left p-3.5 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] hover:bg-[#F7F3EA] transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-md bg-[#F7F3EA] border border-[#D9DDE3] flex items-center justify-center text-[#7A1F24]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#202124]">Student Portal</div>
                    <div className="text-[11px] text-[#667085]">Enrolled Scholars & Current Students</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085] group-hover:translate-x-1 group-hover:text-[#7A1F24] transition" />
              </button>

              <button
                onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
                className="w-full text-left p-3.5 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] hover:bg-[#F7F3EA] transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-md bg-[#F7F3EA] border border-[#D9DDE3] flex items-center justify-center text-[#7A1F24]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#202124]">Alumni Portal</div>
                    <div className="text-[11px] text-[#667085]">Graduates & Industry Mentors</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085] group-hover:translate-x-1 group-hover:text-[#7A1F24] transition" />
              </button>

              <button
                onClick={() => handleSelectPortal(USER_ROLES.ADMIN)}
                className="w-full text-left p-3.5 rounded-lg border border-[#D9DDE3] hover:border-[#7A1F24] hover:bg-[#F7F3EA] transition flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-md bg-[#F7F3EA] border border-[#D9DDE3] flex items-center justify-center text-[#7A1F24]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#202124]">Admin Cell Portal</div>
                    <div className="text-[11px] text-[#667085]">College Administration & Faculty Cell</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#667085] group-hover:translate-x-1 group-hover:text-[#7A1F24] transition" />
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-[#D9DDE3] text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#7A1F24] hover:underline"
              >
                Sign In with College Roll Number & Password
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================
          ALUMNUS PROFILE MODAL
      ============================================================ */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-lg border border-[#D9DDE3] max-w-lg w-full p-6 text-[#202124] shadow-xl relative animate-in fade-in duration-150">
            <button
              onClick={() => setSelectedAlumnus(null)}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#202124] p-1 rounded-md hover:bg-[#F7F3EA]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4 mb-4">
              {selectedAlumnus.avatar_url ? (
                <img
                  src={selectedAlumnus.avatar_url}
                  alt={selectedAlumnus.name}
                  className="w-16 h-16 rounded-lg object-cover border border-[#D9DDE3] shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#F7F3EA] text-[#7A1F24] font-bold text-xl flex items-center justify-center border border-[#D9DDE3]">
                  {selectedAlumnus.name[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-[#7A1F24] uppercase tracking-wider">
                  {formatEducation(selectedAlumnus.branch, selectedAlumnus.batch_year)}
                </div>
                <h3 className="text-lg font-bold text-[#202124] leading-tight font-serif">
                  {selectedAlumnus.name}
                </h3>
                <p className="text-xs font-semibold text-[#202124] mt-0.5">
                  {selectedAlumnus.current_designation || "Alumnus"}
                </p>
                <p className="text-xs text-[#667085]">
                  {selectedAlumnus.current_company ? `at ${selectedAlumnus.current_company}` : "GL Bajaj Graduate"}
                </p>
              </div>
            </div>

            {selectedAlumnus.bio && (
              <div className="bg-[#F7F3EA] p-3.5 rounded-md border border-[#D9DDE3] text-xs text-[#667085] leading-relaxed mb-4">
                <span className="font-bold text-[#202124] block mb-1">
                  Professional Profile
                </span>
                "{selectedAlumnus.bio}"
              </div>
            )}

            {selectedAlumnus.skills && selectedAlumnus.skills.length > 0 && (
              <div className="mb-4">
                <div className="text-[11px] font-bold text-[#202124] mb-1.5">Expertise & Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAlumnus.skills.map((s, idx) => (
                    <span key={idx} className="text-[10px] bg-[#F7F3EA] border border-[#D9DDE3] text-[#202124] px-2 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#D9DDE3] flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedAlumnus(null);
                  if (user && role === USER_ROLES.STUDENT) {
                    navigate("/student/alumni");
                  } else {
                    navigate("/login?role=student");
                  }
                }}
                className="flex-1 bg-[#7A1F24] hover:bg-[#5C171B] text-white text-xs font-semibold py-2.5 rounded-md transition text-center cursor-pointer"
              >
                Request Mentorship in Portal
              </button>
              <button
                type="button"
                onClick={() => setSelectedAlumnus(null)}
                className="bg-white hover:bg-[#F7F3EA] text-[#202124] border border-[#D9DDE3] text-xs font-semibold py-2.5 px-4 rounded-md transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
