import React from "react";
import { Link } from "react-router-dom";
import { Heart, LogIn, ArrowRight } from "lucide-react";
import { COLLEGE_NAME } from "../../lib/constants";

export default function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div className="bg-gradient-to-r from-glblue-750 via-teal-900 to-glblue-750 border-b border-white/10 text-xs py-1.5 px-4 text-center sm:text-left text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center space-x-2 font-medium">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-glgold/20 text-glgold font-bold border border-glgold/40 text-[10px]">
              GLB PRIDE
            </span>
            <span className="hidden sm:inline text-slate-300">Official Mentorship & Alumni Community of</span>
            <span className="font-semibold text-white">{COLLEGE_NAME}</span>
          </div>
          <div className="flex items-center space-x-4 font-bold text-glgold tracking-wider uppercase text-[10px]">
            <span className="flex items-center space-x-1">
              <Heart className="w-3 h-3 fill-glgold text-glgold" />
              <span>"Once GLB, Always GLB."</span>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300 font-normal capitalize">Greater Noida, Delhi-NCR</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-glgold via-amber-500 to-amber-700 flex items-center justify-center font-black text-2xl text-slate-950 shadow-lg shadow-glgold/20 group-hover:scale-105 transition">
            GL
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-glgold transition">
                GL BAJAJ
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                ALUMNI CONNECT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Mentorship-First Alumni Family
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm text-slate-300">
          <a href="#family" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            GLB Family
          </a>
          <a href="#mentorship" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition flex items-center space-x-1.5">
            <span>Mentorship</span>
            <span className="w-2 h-2 rounded-full bg-glgold animate-pulse"></span>
          </a>
          <a href="#stories" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            Alumni Stories
          </a>
          <a href="#events" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            Events
          </a>
          <a href="#moments" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            Moments
          </a>
          <a href="#communities" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            Affinity Circles
          </a>
          <a href="#resources" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition">
            Resources
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Link
            to="/login?portal=student"
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/5 transition flex items-center space-x-1.5"
          >
            <LogIn className="w-3.5 h-3.5 text-glgold" />
            <span>Sign In</span>
          </Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-glgold to-amber-600 hover:from-glgold-light hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg shadow-glgold/25 hover:shadow-glgold/40 transition flex items-center space-x-1.5 group"
          >
            <span>Join Family</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </header>
  );
}
