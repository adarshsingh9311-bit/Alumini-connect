import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../lib/constants";
import { formatEducation } from "../lib/formatters";
import { 
  X, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2
} from "lucide-react";

// Clean, authentic university landing components
import UniversityHeader from "../components/landing/UniversityHeader";
import UniversityHero from "../components/landing/UniversityHero";
import NotableAlumniSection from "../components/landing/NotableAlumniSection";
import AlumniVoicesSection from "../components/landing/AlumniVoicesSection";
import FamilyConnectionSection from "../components/landing/FamilyConnectionSection";
import UniversityMentorshipSection from "../components/landing/UniversityMentorshipSection";
import UniversityMomentsSection from "../components/landing/UniversityMomentsSection";
import UniversityEventsSection from "../components/landing/UniversityEventsSection";
import UniversityAffinityCircles from "../components/landing/UniversityAffinityCircles";
import UniversityResourcesSection from "../components/landing/UniversityResourcesSection";
import UniversityConnectBeyond from "../components/landing/UniversityConnectBeyond";
import UniversityFinalCta from "../components/landing/UniversityFinalCta";
import UniversityFooter from "../components/landing/UniversityFooter";

export default function LandingPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectMessage, setConnectMessage] = useState("");

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

  function handleSendConnect(e) {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setSelectedAlumnus(null);
      setConnectMessage("");
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2B3442] flex flex-col font-sans selection:bg-[#C29B38]/20 selection:text-[#0C1929]">
      
      {/* 1. Header: Top Information Bar & Baseline-Aligned Navigation */}
      <UniversityHeader onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* 2. Hero: Authentic GL Bajaj Campus Photograph with Natural Navy Overlay */}
      <UniversityHero />

      {/* 3. Notable GLB Alumni Showcase & Carousel */}
      <NotableAlumniSection onSelectAlumnus={(alumnus) => setSelectedAlumnus(alumnus)} />

      {/* 4. Voices From Our GLB Family: Verified Reflections */}
      <AlumniVoicesSection />

      {/* 5. The GLB Family Connection: Visual College -> Alumni -> Mentors -> Students Pipeline */}
      <FamilyConnectionSection />

      {/* 6. Mentorship Section: 1-on-1 Guidance */}
      <UniversityMentorshipSection onSelectMentor={(mentor) => setSelectedAlumnus(mentor)} />

      {/* 7. GLB Family Moments: Community Celebrations Wall */}
      <UniversityMomentsSection />

      {/* 8. Events Calendar */}
      <UniversityEventsSection />

      {/* 9. Affinity Circles & Regional Chapters */}
      <UniversityAffinityCircles />

      {/* 10. GLB Alumni Resources & Institutional Privileges */}
      <UniversityResourcesSection />

      {/* 11. Stay Connected Beyond GLB: Official Socials & Newsletter */}
      <UniversityConnectBeyond />

      {/* 12. Final Reconnect Call to Action */}
      <UniversityFinalCta />

      {/* 13. Institutional University Footer */}
      <UniversityFooter onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* ============================================================
          SIGN IN / THREE PORTALS SELECTOR MODAL
      ============================================================ */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1929]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E7E1D4] max-w-md w-full p-6 text-[#2B3442] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-[#718096] hover:text-[#0C1929] p-1 rounded-lg hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#0C1929] text-[#E5C378] flex items-center justify-center font-serif font-bold text-base mx-auto mb-2">
                GL
              </div>
              <h3 className="text-lg font-bold text-[#0C1929] font-serif">
                Sign In to Portal
              </h3>
              <p className="text-xs text-[#718096] mt-0.5">
                GL Bajaj Alumni Connect Platform
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSelectPortal(USER_ROLES.STUDENT)}
                className="w-full text-left p-3.5 rounded-xl border border-[#E7E1D4] hover:border-[#C29B38] hover:bg-[#FAF8F5] transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-[#8C7138]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0C1929]">Student Portal</div>
                    <div className="text-[11px] text-[#718096]">Scholars & Current Students</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0AEC0] group-hover:translate-x-1 group-hover:text-[#8C7138] transition" />
              </button>

              <button
                onClick={() => handleSelectPortal(USER_ROLES.ALUMNI)}
                className="w-full text-left p-3.5 rounded-xl border border-[#E7E1D4] hover:border-[#C29B38] hover:bg-[#FAF8F5] transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-[#0C1929]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0C1929]">Alumni Portal</div>
                    <div className="text-[11px] text-[#718096]">Graduates & Industry Mentors</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0AEC0] group-hover:translate-x-1 group-hover:text-[#8C7138] transition" />
              </button>

              <button
                onClick={() => handleSelectPortal(USER_ROLES.ADMIN)}
                className="w-full text-left p-3.5 rounded-xl border border-[#E7E1D4] hover:border-[#C29B38] hover:bg-[#FAF8F5] transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-[#4A5568]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0C1929]">Admin Cell Portal</div>
                    <div className="text-[11px] text-[#718096]">College Faculty & Alumni Cell</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#A0AEC0] group-hover:translate-x-1 group-hover:text-[#8C7138] transition" />
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-[#E7E1D4] text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#8C7138] hover:underline"
              >
                Sign In with College Roll Number & Password
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================
          ALUMNUS PROFILE & CONNECT MODAL
      ============================================================ */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1929]/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E7E1D4] max-w-lg w-full p-6 sm:p-7 text-[#2B3442] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAlumnus(null)}
              className="absolute top-4 right-4 text-[#718096] hover:text-[#0C1929] p-1 rounded-lg hover:bg-[#FAF8F5]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start space-x-4 mb-5">
              <img
                src={selectedAlumnus.image || selectedAlumnus.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                alt={selectedAlumnus.name || selectedAlumnus.full_name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";
                }}
                className="w-16 h-16 rounded-xl object-cover object-top border border-[#E7E1D4] shadow-xs"
              />
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-[#8C7138] uppercase tracking-wider font-serif">
                  {formatEducation(selectedAlumnus.branch, selectedAlumnus.batch || selectedAlumnus.graduation_year)}
                </div>
                <h3 className="text-xl font-bold text-[#0C1929] leading-tight font-serif">
                  {selectedAlumnus.name || selectedAlumnus.full_name}
                </h3>
                <p className="text-xs font-semibold text-[#2B3442] mt-0.5">
                  {selectedAlumnus.designation || selectedAlumnus.current_designation || selectedAlumnus.role}
                </p>
                <p className="text-xs text-[#718096] font-medium">
                  {selectedAlumnus.organization || selectedAlumnus.current_company || selectedAlumnus.company}
                </p>
              </div>
            </div>

            {/* Journey Note */}
            {selectedAlumnus.journey || selectedAlumnus.bio ? (
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7E1D4] text-xs leading-relaxed text-[#4A5568] mb-5">
                <span className="font-semibold text-[#0C1929] block mb-1">
                  Academic & Professional Journey
                </span>
                {selectedAlumnus.journey || selectedAlumnus.bio}
              </div>
            ) : null}

            {/* Connect Form */}
            {connectSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Connection request dispatched to {selectedAlumnus.name || selectedAlumnus.full_name}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendConnect} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0C1929] mb-1">
                    Send a connection note:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Hello senior! I am a GL Bajaj student and would value your perspective on..."
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    required
                    className="w-full bg-white border border-[#E7E1D4] rounded-lg p-2.5 text-xs text-[#0C1929] placeholder-[#A0AEC0] focus:outline-none focus:border-[#B58A38]"
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] text-xs font-semibold py-2.5 px-4 rounded-lg transition text-center shadow-xs"
                  >
                    Send Connection Request
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (user) {
                        navigate("/student/messages");
                      } else {
                        navigate("/login?role=student");
                      }
                    }}
                    className="bg-[#FAF8F5] hover:bg-white text-[#0C1929] border border-[#E7E1D4] text-xs font-semibold py-2.5 px-3 rounded-lg transition"
                  >
                    Open in Portal
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
