import React from "react";
import { Link } from "react-router-dom";
import { COLLEGE_NAME } from "../../lib/constants";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

export default function UniversityFooter({ onOpenAuthModal }) {
  return (
    <footer className="bg-[#472510] text-[#faf6eb] border-t-4 border-[#ffcc4e] font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          
          {/* Column 1: Institution & Official Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/glbitm-logo.webp"
                alt="GL Bajaj Institute of Technology & Management"
                className="h-12 w-auto object-contain bg-white px-2 py-1 rounded shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/glb-gold-crest.png";
                }}
              />
            </div>

            <p className="text-xs text-[#d5c7b3] leading-relaxed">
              <strong>G. L. Bajaj Institute of Technology and Management (GLBITM)</strong> is one of the premier engineering and management institutes in Greater Noida, approved by AICTE and affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow.
            </p>

            <div className="space-y-2 text-xs text-[#d5c7b3] pt-1">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#ffcc4e] shrink-0 mt-0.5" />
                <span>Plot No. 2, Knowledge Park III, Greater Noida, Gautam Budh Nagar, UP 201306</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#ffcc4e] shrink-0" />
                <span>College Code: 192 | +91 0120 2323818 / 19</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#ffcc4e] shrink-0" />
                <span>alumni@glbitm.org</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-[#ffcc4e] shrink-0" />
                <a href="https://www.glbitm.org" target="_blank" rel="noreferrer" className="text-[#ffcc4e] hover:underline flex items-center gap-1">
                  <span>www.glbitm.org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Portals Access */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#ffcc4e] uppercase tracking-wider border-b border-[#ffcc4e]/30 pb-2">
              Alumni Connect Portals
            </h4>
            <ul className="space-y-2 text-xs text-[#d5c7b3]">
              <li>
                <Link to="/student/dashboard" className="hover:text-[#ffcc4e] transition flex items-center space-x-1.5">
                  <span className="text-[#ffcc4e] font-bold">â¢</span>
                  <span>Student Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/alumni/dashboard" className="hover:text-[#ffcc4e] transition flex items-center space-x-1.5">
                  <span className="text-[#ffcc4e] font-bold">â¢</span>
                  <span>Alumni Portal</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#ffcc4e] transition flex items-center space-x-1.5">
                  <span className="text-[#ffcc4e] font-bold">â¢</span>
                  <span>Administration Portal</span>
                </Link>
              </li>
              <li>
                <button onClick={onOpenAuthModal} className="text-[#ffcc4e] hover:underline text-left font-semibold">
                  Quick Portal Switcher â'
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#ffcc4e] uppercase tracking-wider border-b border-[#ffcc4e]/30 pb-2">
              Official GLBITM Links
            </h4>
            <ul className="space-y-2 text-xs text-[#d5c7b3]">
              <li>
                <a href="https://www.glbitm.org/academics/btech/27/158/247/" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e] transition">
                  Academics & B.Tech Programs
                </a>
              </li>
              <li>
                <a href="https://www.glbitm.org/training-and-placement/placement-record/35/195/248/" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e] transition">
                  Placement Records & Top Recruiters
                </a>
              </li>
              <li>
                <a href="https://www.glbitm.org/academics/about-iqac/27/175/242/" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e] transition">
                  IQAC & Accreditations
                </a>
              </li>
              <li>
                <a href="https://www.glbitm.org/student_corner.aspx?mpgid=129&pgidtrail=129" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e] transition">
                  Student Corner
                </a>
              </li>
              <li>
                <a href="https://www.glbitm.org/engineering-college/" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e] transition">
                  Mandatory Public Disclosure
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Stay Connected */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#ffcc4e] uppercase tracking-wider border-b border-[#ffcc4e]/30 pb-2">
              Alumni Association
            </h4>
            <p className="text-xs text-[#d5c7b3] leading-relaxed">
              Connecting thousands of engineers, architects, managers, and entrepreneurs across Microsoft, Google, Amazon, Palo Alto Networks, Intuit, and global firms.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-[#ffcc4e] text-[#472510] text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider">
                COLLEGE CODE - 192
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#d5c7b3]">
          <div>
            &copy; {new Date().getFullYear()} G.L. Bajaj Institute of Technology & Management. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[#ffcc4e] font-semibold">"Once GLB, Always GLB."</span>
            <span>|</span>
            <a href="https://www.glbitm.org" target="_blank" rel="noreferrer" className="hover:text-[#ffcc4e]">
              Official College Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
