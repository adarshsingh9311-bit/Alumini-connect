import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Briefcase, ShieldCheck, ArrowRight, Heart, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";

export default function FinalCtaSection() {
  const { setDemoPortal } = useAuth();
  const navigate = useNavigate();

  function handleJump(role, dest) {
    setDemoPortal(role);
    navigate(dest);
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        
        {/* Heart Badge */}
        <div className="inline-flex items-center space-x-2 bg-glgold/20 border border-glgold/50 px-4 py-1.5 rounded-full text-glgold font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg">
          <Heart className="w-4 h-4 fill-glgold text-glgold animate-pulse" />
          <span>"Once GLB, Always GLB."</span>
        </div>

        {/* Big Bold Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Ready to Reconnect with Your <br />
          <span className="text-glgold">Lifelong GLB Family?</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of GL Bajaj students and graduates supporting one another, celebrating milestones, and building careers together.
        </p>

        {/* Dual Entrance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
          {/* Student Path */}
          <div className="bg-slate-900/90 border border-glgold/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-glgold transition group shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-glgold flex items-center justify-center text-slate-950 mb-4 group-hover:scale-105 transition shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">
                I am a GLB Student
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 mb-6">
                Explore alumni directory, find mentors in your target company, receive resume feedback, and chat in real-time.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleJump(USER_ROLES.STUDENT, "/student/dashboard")}
                className="w-full bg-gradient-to-r from-glgold to-amber-600 hover:from-glgold-light hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-glgold/20"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/register"
                className="block text-center text-xs text-slate-400 hover:text-white transition py-1"
              >
                New student? Register with Roll Number
              </Link>
            </div>
          </div>

          {/* Alumni Path */}
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-teal-400 transition group shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white mb-4 group-hover:scale-105 transition shadow-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-white mb-1">
                I am a GLB Graduate
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 mb-6">
                Give back by mentoring juniors, post internal referrals, catch up with old batchmates, and celebrate milestones.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleJump(USER_ROLES.ALUMNI, "/alumni/dashboard")}
                className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-teal-700/20"
              >
                <span>Enter Alumni Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/register"
                className="block text-center text-xs text-slate-400 hover:text-white transition py-1"
              >
                Claim or verify your alumni profile
              </Link>
            </div>
          </div>
        </div>

        {/* Administration Link */}
        <div className="pt-4 text-xs text-slate-400 flex items-center justify-center space-x-2">
          <span>College Faculty or Alumni Cell Administrator?</span>
          <button
            onClick={() => handleJump(USER_ROLES.ADMIN, "/admin/dashboard")}
            className="text-teal-300 hover:text-white font-semibold underline underline-offset-2 flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Cell Sign In</span>
          </button>
        </div>

      </div>
    </section>
  );
}
