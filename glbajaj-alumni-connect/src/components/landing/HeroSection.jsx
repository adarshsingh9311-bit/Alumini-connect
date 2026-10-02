import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  Heart, 
  Search, 
  Users, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function HeroSection() {
  const { role, setDemoPortal } = useAuth();
  const navigate = useNavigate();

  function handleQuickEnter(targetRole, destination) {
    if (!role) {
      setDemoPortal(targetRole);
    }
    navigate(destination);
  }

  return (
    <section id="hero" className="relative text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col justify-center">
      {/* Background with deep dark gradient overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-glblue-750/80 to-slate-950"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
        {/* Emotional Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-glgold/20 via-amber-500/10 to-glgold/20 border border-glgold/50 px-4 py-1.5 rounded-full text-glgold font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg shadow-glgold/10">
          <Heart className="w-4 h-4 fill-glgold text-glgold animate-pulse" />
          <span>"Once GLB, Always GLB."</span>
        </div>

        {/* Emotional Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-md">
          Your GLB Journey <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-glgold via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Doesn't End at Graduation.
          </span>
        </h1>

        {/* Core Product Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto drop-shadow leading-relaxed">
          The mentorship-first digital family connecting GL Bajaj students, global alumni, and the college.
          Students learn from industry seniors, alumni guide the next generation, and our bond grows stronger every day.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#mentorship"
            className="bg-gradient-to-r from-glgold to-amber-600 hover:from-glgold-light hover:to-amber-500 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-xl shadow-glgold/25 hover:shadow-glgold/40 transition flex items-center space-x-2 group"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>Find an Alumni Mentor</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </a>

          <a
            href="#family"
            className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3.5 rounded-2xl border border-white/20 hover:border-white/40 backdrop-blur-md transition flex items-center space-x-2"
          >
            <Users className="w-4 h-4 text-teal-300" />
            <span>Explore GLB Family</span>
          </a>

          <Link
            to="/register"
            className="bg-teal-900/60 hover:bg-teal-800/80 text-teal-200 font-bold px-5 py-3.5 rounded-2xl border border-teal-500/30 transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-glgold" />
            <span>Join Verified Network</span>
          </Link>
        </div>

        {/* Four Credential Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-xl sm:text-2xl font-black text-glgold">15,000+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Alumni Worldwide</div>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-xl sm:text-2xl font-black text-teal-300">385+</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Active Industry Mentors</div>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-xl sm:text-2xl font-black text-glgold">100%</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Roll-Number Verified</div>
          </div>
          <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-xl sm:text-2xl font-black text-teal-300">Direct Chat</div>
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium">Mentee-Mentor Messaging</div>
          </div>
        </div>

        {/* Three Portal Cards (Product Architecture) */}
        <div className="pt-10">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">
            Select Your Portal to Enter
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* 1. Student Portal */}
            <div
              onClick={() => handleQuickEnter(USER_ROLES.STUDENT, "/student/dashboard")}
              className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 hover:shadow-2xl transition cursor-pointer group shadow-xl flex flex-col justify-between border border-teal-100 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-glgold/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-glgold flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-black text-slate-900">Student Portal</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-glgold px-2.5 py-0.5 rounded-full border border-glgold/30">
                    Scholars
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                  Search alumni by company, skills, and batch. Request 1-on-1 mentorship, chat directly with seniors, and apply for alumni job referrals.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free 1-on-1 mentorship requests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct chat with connected alumni</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center text-glgold font-bold text-sm group-hover:translate-x-2 transition">
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* 2. Alumni Portal */}
            <div
              onClick={() => handleQuickEnter(USER_ROLES.ALUMNI, "/alumni/dashboard")}
              className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 hover:shadow-2xl transition cursor-pointer group shadow-xl flex flex-col justify-between border border-teal-100 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-glblue-750 flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition shadow-md">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-black text-slate-900">Alumni Portal</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-glblue-750 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Graduates
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                  Showcase your career timeline, toggle mentorship availability, mentor students via chat, post job openings, and give back to GLB.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Control your mentorship bandwidth</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Post company openings & referrals</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center text-glblue-750 font-bold text-sm group-hover:translate-x-2 transition">
                <span>Enter Alumni Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* 3. Admin Portal */}
            <div
              onClick={() => handleQuickEnter(USER_ROLES.ADMIN, "/admin/dashboard")}
              className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 hover:shadow-2xl transition cursor-pointer group shadow-xl flex flex-col justify-between border border-teal-100 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-900/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-950 flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition shadow-md">
                  <ShieldCheck className="w-6 h-6 text-teal-300" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-black text-slate-900">Admin Portal</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-300">
                    College Cell
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2">
                  Oversee verified rosters, verify alumni identities, broadcast wishes & notices, curate alumni achievements, and import Excel datasets.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Roll-number verification workflow</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Excel/CSV bulk student & alumni import</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center text-teal-900 font-bold text-sm group-hover:translate-x-2 transition">
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
