import React from "react";
import { Link } from "react-router-dom";
import { COLLEGE_NAME, COLLEGE_LOCATION } from "../../lib/constants";
import { MapPin, Phone, Mail, Heart } from "lucide-react";

export default function UniversityFooter({ onOpenAuthModal }) {
  return (
    <footer className="bg-[#0C1929] text-[#CBD5E1] border-t border-[#1E2E44] font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-[#1E2E44]">
          
          {/* Column 1: Institution & Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-[#C29B38] text-[#0C1929] flex items-center justify-center font-serif font-bold text-base shadow-xs">
                GL
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide text-white block">
                  GL BAJAJ ALUMNI CONNECT
                </span>
                <span className="text-[10px] text-[#C29B38] font-semibold tracking-wider font-serif uppercase">
                  "Once GLB, Always GLB."
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              {COLLEGE_NAME}
            </p>

            <div className="space-y-1.5 text-xs text-[#94A3B8] pt-1">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#C29B38] shrink-0 mt-0.5" />
                <span>Plot No. 2, Knowledge Park III, Greater Noida, Gautam Budh Nagar, UP 201306</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                <span>+91 (0120) 2323818 / 19</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                <span>alumni@glbajaj.org</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1E2E44] pb-2 font-serif">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/family" className="hover:text-[#E5C378] transition">
                  GLB Family
                </Link>
              </li>
              <li>
                <a href="#mentorship" className="hover:text-[#E5C378] transition">
                  Mentorship Program
                </a>
              </li>
              <li>
                <a href="#notable-alumni" className="hover:text-[#E5C378] transition">
                  Alumni Stories & Accolades
                </a>
              </li>
              <li>
                <a href="#events" className="hover:text-[#E5C378] transition">
                  Events & Reunions
                </a>
              </li>
              <li>
                <a href="#moments" className="hover:text-[#E5C378] transition">
                  GLB Family Moments
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1E2E44] pb-2 font-serif">
              Three Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenAuthModal}
                  className="hover:text-[#E5C378] transition text-left"
                >
                  Student Portal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuthModal}
                  className="hover:text-[#E5C378] transition text-left"
                >
                  Alumni Portal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAuthModal}
                  className="hover:text-[#E5C378] transition text-left"
                >
                  Admin Cell Portal
                </button>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#E5C378] transition">
                  Roll-Number Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#E5C378] transition">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Recognition */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white border-b border-[#1E2E44] pb-2 font-serif">
              Accreditation
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Approved by AICTE, Ministry of Education, Govt. of India. Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow.
            </p>
            <div className="pt-2">
              <a
                href="https://www.glbitm.org/our-notable-alumni/"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[#C29B38] hover:text-[#E5C378] font-medium transition text-xs underline underline-offset-4"
              >
                Official Notable Alumni Directory ?
              </a>
            </div>
          </div>

        </div>

        {/* Sub-footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
          <div className="flex items-center space-x-1.5 font-serif text-[#C29B38]">
            <Heart className="w-3.5 h-3.5 fill-[#C29B38]" />
            <span>"Once GLB, Always GLB."</span>
          </div>

          <div>
            © {new Date().getFullYear()} G.L. Bajaj Institute of Technology & Management. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
