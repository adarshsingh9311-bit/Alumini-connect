import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../lib/constants";
import { 
  X, 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  ExternalLink 
} from "lucide-react";

// Clean, authentic university landing components
import UniversityHeader from "../components/landing/UniversityHeader";
import UniversityHero from "../components/landing/UniversityHero";
import NotableAlumniSection from "../components/landing/NotableAlumniSection";
import AlumniVoicesSection from "../components/landing/AlumniVoicesSection";
import UniversityMentorshipSection from "../components/landing/UniversityMentorshipSection";
import UniversityMomentsSection from "../components/landing/UniversityMomentsSection";
import UniversityEventsSection from "../components/landing/UniversityEventsSection";
import UniversityAffinityCircles from "../components/landing/UniversityAffinityCircles";
import UniversityResourcesSection from "../components/landing/UniversityResourcesSection";
import UniversityConnectBeyond from "../components/landing/UniversityConnectBeyond";
import UniversityFinalCta from "../components/landing/UniversityFinalCta";
import UniversityFooter from "../components/landing/UniversityFooter";

export default function LandingPage() {
  const { setDemoPortal } = useAuth();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectMessage, setConnectMessage] = useState("");

  function handleDirectPortal(role, path) {
    setAuthModalOpen(false);
    navigate(`/login?role=${role}`);
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
    <div className="min-h-screen bg-[#FFFFFF] text-[#2B3442] flex flex-col font-sans selection:bg-[#fac850]/20 selection:text-[#521321]">
      
      {/* 1. Header: Top Information Bar & Baseline-Aligned Navigation */}
      <UniversityHeader onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* 2. Hero: Authentic GL Bajaj Campus Photograph with Natural Navy Overlay */}
      <UniversityHero onOpenAuthModal={() => setAuthModalOpen(true)} />

      {/* 3. Notable GLB Alumni Showcase & Carousel */}
      <NotableAlumniSection onSelectAlumnus={(alumnus) => setSelectedAlumnus(alumnus)} />

      {/* 4. Voices From Our GLB Family: Verified Reflections */}
      <AlumniVoicesSection />

      {/* 5. GLB Family Moments: Community Celebrations Wall */}
      <UniversityMomentsSection />

      {/* 8. Events Calendar */}
      <UniversityEventsSection />

      {/* 9. Affinity Circles & Regional Chapters */}
      <UniversityAffinityCircles />

      {/* 10. GLB Alumni Resources & Institutional Privileges */}
      <UniversityResourcesSection />

      {/* 11. Stay Connected Beyond GLB: Official Socials & Newsletter */}
      <UniversityConnectBeyond />

      {/* 12. Institutional University Footer */}
      <UniversityFooter onOpenAuthModal={() => setAuthModalOpen(true)} />


      {/* ============================================================
          SIGN IN / THREE PORTALS SELECTOR MODAL
      ============================================================ */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border-2 border-[#ffcc4e] max-w-md w-full p-6 sm:p-7 text-slate-900 shadow-2xl relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <img
                src="/assets/glb-gold-crest.png"
                alt="GL Bajaj Seal"
                className="w-14 h-14 object-contain mx-auto mb-2 drop-shadow-md"
              />
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                Select Your Portal
              </h3>
              <p className="text-xs font-bold text-[#592106] tracking-wide mt-1 uppercase">
                G.L. Bajaj Alumni Connect Platform
              </p>
            </div>

            <div className="space-y-3.5">
              <button
                onClick={() => handleDirectPortal(USER_ROLES.STUDENT, "/student/dashboard")}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#ffcc4e] hover:bg-[#faf6eb] transition flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#592106] text-[#ffcc4e] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-950 group-hover:text-[#592106] transition">Student Portal</div>
                    <div className="text-xs font-semibold text-slate-600">Scholars &amp; Current Students</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#592106] transition" />
              </button>

              <button
                onClick={() => handleDirectPortal(USER_ROLES.ALUMNI, "/alumni/dashboard")}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#ffcc4e] hover:bg-[#faf6eb] transition flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#472510] text-[#ffcc4e] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-950 group-hover:text-[#592106] transition">Alumni Portal</div>
                    <div className="text-xs font-semibold text-slate-600">Graduates &amp; Industry Mentors</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#592106] transition" />
              </button>

              <button
                onClick={() => handleDirectPortal(USER_ROLES.ADMIN, "/admin/dashboard")}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-[#ffcc4e] hover:bg-[#faf6eb] transition flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#2f1508] text-[#ffcc4e] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-950 group-hover:text-[#592106] transition">Admin Cell Portal</div>
                    <div className="text-xs font-semibold text-slate-600">College Faculty &amp; Alumni Cell</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#592106] transition" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <Link
                to="/login"
                className="text-xs font-extrabold text-[#592106] hover:text-[#472510] hover:underline"
              >
                Sign In with College Roll Number &amp; Password &rarr;
              </Link>
            </div>

          </div>
        </div>
      )}


      {/* ============================================================
          ALUMNUS PROFILE & CONNECT MODAL
      ============================================================ */}
      {selectedAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#521321]/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#EAE5DC] max-w-lg w-full p-6 sm:p-7 text-[#2B3442] shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAlumnus(null)}
              className="absolute top-4 right-4 text-[#718096] hover:text-[#521321] p-1 rounded-lg hover:bg-[#FFFFFF]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start space-x-4 mb-5">
              <img
                src={selectedAlumnus.image}
                alt={selectedAlumnus.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = selectedAlumnus.fallbackImage;
                }}
                className="w-16 h-16 rounded-xl object-cover object-top border border-[#EAE5DC] shadow-xs"
              />
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-[#974319] uppercase tracking-wider font-serif">
                  {selectedAlumnus.batch} ? {selectedAlumnus.branch}
                </div>
                <h3 className="text-xl font-bold text-[#521321] leading-tight font-serif">
                  {selectedAlumnus.name}
                </h3>
                <p className="text-xs font-semibold text-[#2B3442] mt-0.5">
                  {selectedAlumnus.designation || selectedAlumnus.role}
                </p>
                <p className="text-xs text-[#718096] font-medium">
                  {selectedAlumnus.organization || selectedAlumnus.company}
                </p>
              </div>
            </div>

            {/* Journey Note */}
            <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[#EAE5DC] text-xs leading-relaxed text-[#4A5568] mb-5">
              <span className="font-semibold text-[#521321] block mb-1">
                Academic & Professional Journey
              </span>
              {selectedAlumnus.journey}
            </div>

            {/* Connect Form */}
            {connectSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Connection request dispatched to {selectedAlumnus.name}!</span>
              </div>
            ) : (
              <form onSubmit={handleSendConnect} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#521321] mb-1">
                    Send a connection note:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Hello senior! I am a GL Bajaj student and would value your perspective on..."
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    required
                    className="w-full bg-white border border-[#EAE5DC] rounded-lg p-2.5 text-xs text-[#521321] placeholder-[#A0AEC0] focus:outline-none focus:border-[#e0a82e]"
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-[#521321] hover:bg-[#6f1b2f] text-[#FFFFFF] text-xs font-semibold py-2.5 px-4 rounded-lg transition text-center shadow-xs"
                  >
                    Send Connection Request
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDemoPortal(USER_ROLES.STUDENT);
                      navigate("/student/messages");
                    }}
                    className="bg-[#FFFFFF] hover:bg-white text-[#521321] border border-[#EAE5DC] text-xs font-semibold py-2.5 px-3 rounded-lg transition"
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
