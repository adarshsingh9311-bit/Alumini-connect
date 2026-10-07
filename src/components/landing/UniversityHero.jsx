import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Users, HeartHandshake, MessageSquare, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";

export default function UniversityHero() {
  const { setDemoPortal } = useAuth();
  const navigate = useNavigate();

  function handleFindMentor() {
    setDemoPortal(USER_ROLES.STUDENT);
    navigate("/student/alumni");
  }

  const pillars = [
    {
      id: "pillar-connect",
      title: "Connect",
      subtitle: "With fellow GLBians",
      icon: Users
    },
    {
      id: "pillar-mentor",
      title: "Mentor",
      subtitle: "Guide the next generation",
      icon: HeartHandshake
    },
    {
      id: "pillar-chat",
      title: "Chat",
      subtitle: "Build lasting relationships",
      icon: MessageSquare
    },
    {
      id: "pillar-giveback",
      title: "Give Back",
      subtitle: "Strengthen the GLB family",
      icon: Heart
    }
  ];

  return (
    <div className="w-full flex flex-col font-sans">
      
      {/* ============================================================
          HERO SECTION (Matching user screenshot exactly)
          Real GL Bajaj Building background with sunset lighting
          Headline: "Once GLB, Always GLB."
          Buttons: [Find a Mentor ->]  [Explore GLB Family ->]
      ============================================================ */}
      <section className="relative w-full overflow-hidden text-white flex items-center min-h-[500px] sm:min-h-[540px] lg:min-h-[580px]">
        {/* Background Image from user screenshot */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-clean-bg.png"
            alt="GL Bajaj Campus"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://www.glbitm.org/Uploads/banner/160_glbajaj-campus-delhi.jpg";
            }}
          />
          {/* Subtle gradient overlay to darken left text area while keeping building clear on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent sm:w-3/5" />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="max-w-xl text-left space-y-4">
            
            {/* Accent Line */}
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-[2px] bg-[#E5C378]" />
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-[#E5C378]">
                G. L. BAJAJ ALUMNI CONNECT
              </span>
            </div>

            {/* Main Headline (Exact words and colors from screenshot) */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] font-serif">
              <span className="text-white block">Once GLB,</span>
              <span className="text-[#D9A758] block mt-1">Always GLB.</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#F1EFEA] font-normal leading-relaxed pt-1 max-w-md">
              Your college journey doesn't end at graduation. Stay connected, find mentors, share your journey and grow the GLB family.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3.5">
              {/* Find a Mentor button (Caramel Gold rounded pill) */}
              <button
                onClick={handleFindMentor}
                className="bg-[#D9A758] hover:bg-[#C99645] text-[#1A2838] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition shadow-md flex items-center space-x-2 group"
              >
                <span>Find a Mentor</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </button>

              {/* Explore GLB Family button (Dark rounded pill with thin white border) */}
              <Link
                to="/family"
                className="bg-black/40 hover:bg-black/60 text-white border border-white/60 text-xs sm:text-sm font-medium px-6 py-3 rounded-full transition backdrop-blur-xs flex items-center space-x-2 group"
              >
                <span>Explore GLB Family</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          VALUE PILLARS BAR (Directly below Hero in user screenshot)
          4 Pillars with vertical separator lines:
          Connect | Mentor | Chat | Give Back
      ============================================================ */}
      <div className="bg-[#FAF8F5] border-b border-[#E7E1D4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className={`flex items-center space-x-4 px-4 ${
                    idx < pillars.length - 1 ? "lg:border-r lg:border-[#E7E1D4]" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E7E1D4] flex items-center justify-center text-[#1A2838] shrink-0 shadow-2xs">
                    <Icon className="w-6 h-6 text-[#1A2838]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A2838] leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[#5C667A] leading-tight mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
