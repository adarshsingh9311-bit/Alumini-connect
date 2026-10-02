import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, MapPin, Phone, Mail, GraduationCap, Briefcase } from "lucide-react";
import { COLLEGE_NAME, COLLEGE_LOCATION } from "../../lib/constants";

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-white/10 text-xs">
      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & College Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-glgold to-amber-600 flex items-center justify-center font-black text-xl text-slate-950 shadow-md">
                GL
              </div>
              <div>
                <span className="font-black text-base text-white tracking-wide">
                  GL BAJAJ ALUMNI CONNECT
                </span>
                <p className="text-[10px] text-glgold font-bold tracking-widest uppercase">
                  "Once GLB, Always GLB."
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The official mentorship-first community platform connecting GL Bajaj Institute of Technology & Management scholars, global alumni, and faculty into an enduring family.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-glgold shrink-0 mt-0.5" />
                <span>Plot No. 2, Knowledge Park III, Greater Noida, Gautam Budh Nagar, UP 201306, India</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-glgold shrink-0" />
                <span>+91 (0120) 2323818 / 19</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-glgold shrink-0" />
                <span>alumni@glbajaj.org ? contact@glbajaj.org</span>
              </div>
            </div>
          </div>

          {/* Col 3: Exactly Three Portals */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white tracking-wide uppercase text-[11px] border-b border-white/10 pb-2">
              Three Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login?portal=student" className="hover:text-glgold transition flex items-center space-x-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-glgold" />
                  <span>Student Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/login?portal=alumni" className="hover:text-glgold transition flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                  <span>Alumni Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/login?portal=admin" className="hover:text-glgold transition flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                  <span>Admin Cell Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-glgold transition">
                  Roll-Number Registration
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-glgold transition">
                  Password Reset & OTP
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Mentorship & Network */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white tracking-wide uppercase text-[11px] border-b border-white/10 pb-2">
              Mentorship Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#mentorship" className="hover:text-glgold transition">
                  Find an Alumni Mentor
                </a>
              </li>
              <li>
                <a href="#family" className="hover:text-glgold transition">
                  The GLB Family Pipeline
                </a>
              </li>
              <li>
                <a href="#communities" className="hover:text-glgold transition">
                  10 Affinity Circles
                </a>
              </li>
              <li>
                <a href="#stories" className="hover:text-glgold transition">
                  Alumni Impact Stories
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-glgold transition">
                  Internal Referral Board
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: College & Community */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-white tracking-wide uppercase text-[11px] border-b border-white/10 pb-2">
              Community & Events
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#events" className="hover:text-glgold transition">
                  SANSMRITI 2026 Reunion
                </a>
              </li>
              <li>
                <a href="#moments" className="hover:text-glgold transition">
                  GLB Family Moments Wall
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-glgold transition">
                  Official Transcript Request
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-glgold transition">
                  E-Cell Prototyping Lab
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-glgold transition">
                  Campus Guest Pass
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-white/10 bg-slate-950 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <span className="text-glgold font-bold">"Once GLB, Always GLB."</span>
            <span>?</span>
            <span>Approved by AICTE, Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU)</span>
          </div>

          <div className="text-center md:text-right">
            ? {new Date().getFullYear()} G.L. Bajaj Institute of Technology & Management. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
