import React from "react";
import { COLLEGE_NAME, COLLEGE_LOCATION } from "../../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm py-8 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="bg-glgold text-white text-xs px-2 py-1 rounded-md font-bold shadow-sm">GLB</span>
          <div>
            <p className="text-slate-300 font-semibold">{COLLEGE_NAME}</p>
            <p className="text-slate-500 text-xs">{COLLEGE_LOCATION} • Dedicated Alumni & Student Network</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <a href="#" className="hover:text-glgold transition">Alumni Cell Desk</a>
          <a href="#" className="hover:text-glgold transition">Career & Placements</a>
          <a href="#" className="hover:text-glgold transition">Privacy Policy</a>
          <a href="#" className="hover:text-glgold transition">Terms & Guidelines</a>
        </div>
      </div>
    </footer>
  );
}
