import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, GraduationCap, Menu, X, ArrowRight } from "lucide-react";
import { COLLEGE_NAME, COLLEGE_LOCATION } from "../../lib/constants";

export default function UniversityHeader({ onOpenAuthModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E7E1D4] shadow-[0_1px_3px_rgba(0,0,0,0.03)] font-sans">
      
      {/* ============================================================
          1. TOP INFORMATION BAR (Exactly matching user screenshot)
          Deep Navy-Slate background (#0F2132)
          Left: GraduationCap + GLB PRIDE in rounded gold badge | Official Mentorship & Alumni Community of G. L. Bajaj Institute of Technology & Management
          Right: Heart + "ONCE GLB, ALWAYS GLB." | MapPin + Greater Noida, Delhi-NCR
      ============================================================ */}
      <div className="bg-[#0F2132] text-[#E2DFD7] border-b border-[#1A2C42] py-1.5 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px]">
          
          {/* Left info */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border border-[#C2853B]/50 text-[#E5C378] text-[10px] font-bold tracking-wider">
              <GraduationCap className="w-3 h-3 text-[#E5C378]" />
              <span>GLB PRIDE</span>
            </span>
            <span className="text-[#374151]">|</span>
            <span className="text-[#CBD5E1] font-normal truncate max-w-md">
              Official Mentorship & Alumni Community of <strong className="font-semibold text-white">G. L. Bajaj Institute of Technology & Management</strong>
            </span>
          </div>

          {/* Right info */}
          <div className="flex items-center space-x-2.5 text-[10px] tracking-wide shrink-0 font-medium">
            <span className="flex items-center space-x-1 text-[#E5C378] font-serif font-bold">
              <Heart className="w-3 h-3 fill-[#E5C378] text-[#E5C378]" />
              <span>"ONCE GLB, ALWAYS GLB."</span>
            </span>
            <span className="text-[#374151]">|</span>
            <span className="flex items-center space-x-1 text-[#CBD5E1]">
              <MapPin className="w-3 h-3 text-[#C2853B]" />
              <span>Greater Noida, Delhi-NCR</span>
            </span>
          </div>

        </div>
      </div>


      {/* ============================================================
          2. MAIN NAVIGATION BAR (Exact layout from user screenshot)
          LEFT: Golden Crest + GL BAJAJ / ALUMNI CONNECT in font-serif
          CENTER: Home | Alumni | Mentorship | Events | Stories | Resources
          RIGHT: GL Bajaj Institute logo + Login + Join Family
          Everything sitting on the EXACT same visual baseline
      ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT: Crest & Serif Brand Typography */}
        <Link to="/" className="flex items-center space-x-3 shrink-0 group">
          <img
            src="/assets/glb-crest-clean.png"
            alt="GL Bajaj Seal"
            className="w-10 h-10 object-contain group-hover:scale-105 transition"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/assets/glb-crest.png";
            }}
          />
          <div className="flex flex-col justify-center">
            <span className="font-bold text-lg sm:text-xl tracking-wide text-[#1A2838] leading-tight font-serif group-hover:text-[#C2853B] transition">
              GL BAJAJ
            </span>
            <span className="text-[10px] font-semibold text-[#8C7138] uppercase tracking-widest leading-none">
              ALUMNI CONNECT
            </span>
          </div>
        </Link>

        {/* CENTER: Navigation Links (Matching user screenshot) */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#2B3442] h-10">
          <Link
            to="/"
            className="text-[#1A2838] font-bold border-b-2 border-[#C2853B] pb-1 h-full flex items-center"
          >
            Home
          </Link>

          <Link
            to="/student/alumni"
            className="text-[#4A5568] hover:text-[#C2853B] transition pb-1 h-full flex items-center"
          >
            Alumni
          </Link>

          <a
            href="#mentorship"
            className="text-[#4A5568] hover:text-[#C2853B] transition pb-1 h-full flex items-center"
          >
            Mentorship
          </a>

          <a
            href="#events"
            className="text-[#4A5568] hover:text-[#C2853B] transition pb-1 h-full flex items-center"
          >
            Events
          </a>

          <a
            href="#notable-alumni"
            className="text-[#4A5568] hover:text-[#C2853B] transition pb-1 h-full flex items-center"
          >
            Stories
          </a>

          <a
            href="#resources"
            className="text-[#4A5568] hover:text-[#C2853B] transition pb-1 h-full flex items-center"
          >
            Resources
          </a>
        </nav>

        {/* RIGHT: College Logo + Login + Join Family on Exact Same Baseline */}
        <div className="hidden sm:flex items-center space-x-4 shrink-0 h-10">
          {/* Right Logo from Screenshot */}
          <div className="hidden xl:flex items-center pr-2 border-r border-[#E7E1D4]">
            <img
              src="/assets/glb-right-logo-clean.png"
              alt="GL Bajaj Institute of Technology & Management"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/glb-right-logo.png";
              }}
            />
          </div>

          {/* Login Button */}
          <button
            onClick={onOpenAuthModal}
            className="h-10 px-5 rounded-lg border border-[#CBD5E1] bg-white text-xs sm:text-sm font-semibold text-[#1A2838] hover:bg-[#FAF8F5] hover:border-[#C2853B] transition flex items-center justify-center shadow-xs"
          >
            Login
          </button>

          {/* Join Family Button (Warm Caramel / Gold) */}
          <Link
            to="/register"
            className="h-10 px-5 rounded-lg bg-[#C2853B] hover:bg-[#B57C34] text-white text-xs sm:text-sm font-semibold transition shadow-sm flex items-center justify-center"
          >
            Join Family
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 sm:hidden">
          <button
            onClick={onOpenAuthModal}
            className="text-xs font-semibold text-[#1A2838] px-3 py-1.5 rounded border border-[#CBD5E1]"
          >
            Login
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#1A2838] hover:bg-[#FAF8F5]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E7E1D4] px-5 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-bold text-[#C2853B]"
          >
            Home
          </Link>
          <Link
            to="/student/alumni"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-[#2B3442] hover:text-[#C2853B]"
          >
            Alumni
          </Link>
          <a
            href="#mentorship"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-[#2B3442] hover:text-[#C2853B]"
          >
            Mentorship
          </a>
          <a
            href="#events"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-[#2B3442] hover:text-[#C2853B]"
          >
            Events
          </a>
          <a
            href="#notable-alumni"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-[#2B3442] hover:text-[#C2853B]"
          >
            Stories
          </a>
          <a
            href="#resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1.5 text-sm font-medium text-[#2B3442] hover:text-[#C2853B]"
          >
            Resources
          </a>
          <div className="pt-3 border-t border-[#E7E1D4]">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-[#C2853B] text-white text-xs font-semibold block"
            >
              Join Family
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
