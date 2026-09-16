import React, { useState } from "react";
import { 
  Code2, 
  Rocket, 
  BrainCircuit, 
  Landmark, 
  GraduationCap, 
  Wrench, 
  Sparkles, 
  MapPin, 
  Check, 
  ArrowRight 
} from "lucide-react";

export const UNIVERSITY_CIRCLES = [
  {
    id: "uc-1",
    name: "GLB Tech & SDE Guild",
    members: "4,200+ Members",
    icon: Code2,
    desc: "Software engineers, systems architects, and infrastructure leads in India and abroad."
  },
  {
    id: "uc-2",
    name: "GLB Founders & Innovators",
    members: "280+ Founders",
    icon: Rocket,
    desc: "Alumni running venture-backed or bootstrapped companies. Peer advisory and investor intros."
  },
  {
    id: "uc-3",
    name: "AI/ML & Data Science Network",
    members: "1,900+ Members",
    icon: BrainCircuit,
    desc: "Researchers and engineers in Generative AI, machine learning, and data platforms."
  },
  {
    id: "uc-4",
    name: "Civil Services & Governance",
    members: "150+ Members",
    icon: Landmark,
    desc: "Alumni serving in IAS, IPS, IES, defense, and public policy advising current students."
  },
  {
    id: "uc-5",
    name: "GLB Global Scholars",
    members: "620+ Scholars",
    icon: GraduationCap,
    desc: "Alumni with master's or doctorate degrees from Oxford, CMU, Stanford, and TU Munich."
  },
  {
    id: "uc-6",
    name: "Regional Alumni Chapters",
    members: "6 Chapters Worldwide",
    icon: MapPin,
    desc: "Active regional wings across Delhi-NCR, Bengaluru, Hyderabad, and North America."
  }
];

export default function UniversityAffinityCircles() {
  const [joined, setJoined] = useState({});

  function handleToggleJoin(id) {
    setJoined(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="communities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Specialized Groups</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            Affinity Circles & Regional Chapters
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Connect with batchmates and seniors across specialized domains, industries, and geographic hubs.
          </p>
        </div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSITY_CIRCLES.map((circle) => {
            const Icon = circle.icon;
            const isJoined = joined[circle.id];

            return (
              <div
                key={circle.id}
                className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C29B38] transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-[#0C1929]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#8C7138] bg-[#FAF8F5] border border-[#E7E1D4] px-2.5 py-0.5 rounded">
                      {circle.members}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0C1929] mb-1.5 font-serif">
                    {circle.name}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                    {circle.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5F1E8]">
                  <button
                    onClick={() => handleToggleJoin(circle.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1 ${
                      isJoined
                        ? "bg-emerald-700 text-white"
                        : "bg-[#FAF8F5] text-[#0C1929] border border-[#E7E1D4] hover:bg-white hover:border-[#B58A38]"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Member</span>
                      </>
                    ) : (
                      <>
                        <span>Join Circle</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
