import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight, CheckCircle2, Briefcase, GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES } from "../../lib/constants";

export const FEATURED_UNIVERSITY_MENTORS = [
  {
    id: "um-1",
    name: "Saurabh Sarkar",
    batch: "Class of 2014",
    branch: "Computer Science & Engg",
    company: "Apple",
    role: "Software Engineer",
    skills: ["System Design", "Core CS", "Distributed Systems"],
    availability: "Available for 2 Mentees",
    image: "https://www.glbitm.org/Uploads/image/753imguf_saurabh-cs.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "um-2",
    name: "Ankur Varshney",
    batch: "Class of 2011",
    branch: "Computer Science & Engg",
    company: "Enfas GmbH, Munich",
    role: "Software Engineer",
    skills: ["MS in Europe", "Distributed Systems", "C++"],
    availability: "Available for 1 Mentee",
    image: "https://www.glbitm.org/Uploads/image/796imguf_ankur.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "um-3",
    name: "Shikha Chaudhary",
    batch: "B.Tech Alumna",
    branch: "Electronics & Communication",
    company: "Indian Air Force",
    role: "Squadron Leader",
    skills: ["Defense Services", "UPSC / SSB", "Leadership"],
    availability: "Available for 1 Mentee",
    image: "https://www.glbitm.org/Uploads/image/830imguf_shikha.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "um-4",
    name: "Anshul Shukla",
    batch: "Class of 2012",
    branch: "Computer Science & Engg",
    company: "Flipkart",
    role: "UI Engineer",
    skills: ["Frontend Architecture", "React", "Web Scale"],
    availability: "Available for 2 Mentees",
    image: "https://www.glbitm.org/Uploads/image/797imguf_anshul.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  }
];

export default function UniversityMentorshipSection({ onSelectMentor }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const { setDemoPortal } = useAuth();
  const navigate = useNavigate();

  const filters = ["All", "Product & Big Tech", "Cloud & Global", "Defense & Public Service"];

  function handleGoToDirectory() {
    setDemoPortal(USER_ROLES.STUDENT);
    navigate("/student/alumni");
  }

  return (
    <section id="mentorship" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#E7E1D4] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>1-on-1 Guidance</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            Find Someone Who Has Walked Your Path Before You
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Connect directly with verified GL Bajaj alumni for roadmap planning, resume critiques, and interview preparation.
          </p>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_UNIVERSITY_MENTORS.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C29B38] transition duration-200"
            >
              <div>
                {/* Header with Photo and Availability */}
                <div className="flex items-start space-x-3.5 mb-4">
                  <img
                    src={m.image}
                    alt={m.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = m.fallbackImage;
                    }}
                    className="w-14 h-14 rounded-xl object-cover object-top border border-[#E7E1D4] shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#0C1929] leading-tight">
                      {m.name}
                    </h3>
                    <p className="text-xs text-[#8C7138] font-medium mt-0.5">
                      {m.batch}
                    </p>
                    <p className="text-xs text-[#4A5568] font-semibold">
                      {m.role} @ {m.company}
                    </p>
                  </div>
                </div>

                {/* Branch */}
                <div className="text-[11px] text-[#718096] flex items-center space-x-1 mb-3">
                  <GraduationCap className="w-3.5 h-3.5 text-[#8C7138]" />
                  <span>{m.branch}</span>
                </div>

                {/* Skills Chips */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[10px] uppercase font-bold text-[#A0AEC0] tracking-wider">
                    Mentorship Focus
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {m.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#FAF8F5] text-[#2B3442] border border-[#E7E1D4] px-2 py-0.5 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="pt-3 border-t border-[#F5F1E8] space-y-2">
                <div className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{m.availability}</span>
                </div>

                <button
                  onClick={handleGoToDirectory}
                  className="w-full bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] text-xs font-semibold py-2 px-3 rounded-lg transition text-center"
                >
                  Request Mentorship
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="text-center pt-4">
          <button
            onClick={handleGoToDirectory}
            className="bg-[#C29B38] hover:bg-[#B58A38] text-[#0C1929] font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition inline-flex items-center space-x-2"
          >
            <span>Find Your Mentor in All Batches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
