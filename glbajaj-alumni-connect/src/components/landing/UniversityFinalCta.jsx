import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Search, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";

export default function UniversityFinalCta() {
  const { setDemoPortal } = useAuth();
  const navigate = useNavigate();

  function handleFindMentor() {
    setDemoPortal(USER_ROLES.STUDENT);
    navigate("/student/alumni");
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] border-t border-[#EAE5DC] font-sans text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Small Heart Line */}
        <div className="inline-flex items-center space-x-1.5 text-xs uppercase tracking-widest text-[#974319] font-semibold font-serif">
          <Heart className="w-3.5 h-3.5 fill-[#974319] text-[#974319]" />
          <span>"ONCE GLB, ALWAYS GLB."</span>
        </div>

        {/* Big Academic Headline */}
        <h2 className="text-3xl sm:text-5xl font-bold text-[#521321] font-serif tracking-tight leading-tight">
          Your GLB Journey Didn't End at Graduation.
        </h2>

        {/* Supporting Motto */}
        <p className="text-base sm:text-lg text-[#4A5568] max-w-xl mx-auto font-medium">
          Connect. Mentor. Give Back. Stay GLB.
        </p>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleFindMentor}
            className="bg-[#fac850] hover:bg-[#e0a82e] text-[#521321] font-semibold text-sm px-7 py-3.5 rounded-lg shadow-sm transition flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Find a Mentor</span>
          </button>

          <Link
            to="/register"
            className="bg-[#521321] hover:bg-[#6f1b2f] text-[#FFFFFF] font-semibold text-sm px-7 py-3.5 rounded-lg shadow-sm transition flex items-center space-x-2"
          >
            <span>Join the GLB Family</span>
            <ArrowRight className="w-4 h-4 text-[#fac850]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
