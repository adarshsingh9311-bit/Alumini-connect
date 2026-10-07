import React, { useState } from "react";
import { 
  Users, 
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

export const AFFINITY_CIRCLES = [
  {
    id: "c-1",
    name: "GLB Tech & SDE Guild",
    members: "4,200+ Members",
    icon: Code2,
    color: "from-blue-600 to-teal-700",
    description: "Software developers, distributed systems engineers, and architects across Big Tech and product companies.",
    lead: "Lead: Aman Sharma ('18, Google)"
  },
  {
    id: "c-2",
    name: "GLB Founders & Builders",
    members: "280+ Founders",
    icon: Rocket,
    color: "from-amber-600 to-rose-700",
    description: "Alumni running funded or profitable ventures. Monthly investor pitch practice and peer advisory.",
    lead: "Lead: Priya Saxena ('16, PayFlow)"
  },
  {
    id: "c-3",
    name: "AI/ML & Data Science Network",
    members: "1,900+ Members",
    icon: BrainCircuit,
    color: "from-purple-600 to-indigo-800",
    description: "Researchers and engineers in Generative AI, LLMs, Computer Vision, and high-performance ML pipelines.",
    lead: "Lead: Divya Nambiar ('19, NeuroMed)"
  },
  {
    id: "c-4",
    name: "Civil Services & Public Policy",
    members: "150+ Members",
    icon: Landmark,
    color: "from-emerald-600 to-teal-800",
    description: "Alumni serving in IAS, IPS, IES, and public governance roles guiding students for UPSC exams.",
    lead: "Lead: Shweta Pandey ('17, IAS)"
  },
  {
    id: "c-5",
    name: "GLB Global Scholars (US & Europe)",
    members: "620+ Scholars",
    icon: GraduationCap,
    color: "from-cyan-600 to-blue-800",
    description: "Alumni pursuing or graduated with MS/PhD degrees at CMU, Stanford, TU Munich, and Imperial College.",
    lead: "Lead: Karan Singhal ('17, CMU)"
  },
  {
    id: "c-6",
    name: "Core Engineering, EV & Robotics",
    members: "980+ Members",
    icon: Wrench,
    color: "from-orange-600 to-amber-700",
    description: "Mechanical, Civil, and Electrical graduates shaping electric mobility, semiconductors, and manufacturing.",
    lead: "Lead: Abhishek Kashyap ('17, VoltPulse)"
  },
  {
    id: "c-7",
    name: "Women in Tech @ GLB",
    members: "1,400+ Members",
    icon: Sparkles,
    color: "from-pink-600 to-purple-800",
    description: "Empowering GLB women in engineering and leadership through dedicated 1-on-1 mentorship circles.",
    lead: "Lead: Ananya Iyer ('20, AWS)"
  },
  {
    id: "c-8",
    name: "Bengaluru & South India Chapter",
    members: "1,850+ Alumni",
    icon: MapPin,
    color: "from-teal-600 to-emerald-800",
    description: "Active regional chapter hosting regular tech mixers, career circles, and quarterly reunions in Bengaluru.",
    lead: "Chapter Rep: Rohan Verma ('19, Microsoft)"
  },
  {
    id: "c-9",
    name: "Greater Noida & Delhi-NCR Hub",
    members: "5,500+ Alumni",
    icon: MapPin,
    color: "from-glgold to-amber-700",
    description: "The home chapter collaborating closely with college leadership, incubation cells, and placement cells.",
    lead: "Chapter Rep: GLB Alumni Cell"
  },
  {
    id: "c-10",
    name: "North America & Bay Area Wing",
    members: "450+ Alumni",
    icon: MapPin,
    color: "from-slate-700 to-slate-900",
    description: "Alumni based in the US and Canada hosting annual Bay Area reunions and helping newcomers settle.",
    lead: "Chapter Rep: Vikramaditya ('15, Stripe)"
  }
];

export default function CommunitiesSection() {
  const [joinedMap, setJoinedMap] = useState({});

  function handleToggleJoin(id) {
    setJoinedMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="communities" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Users className="w-3.5 h-3.5 text-glgold" />
            <span>Affinity Circles & Regional Chapters</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Find Your GLB Community
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Whether you are passionate about Generative AI, launching a venture, preparing for civil services, or looking for batchmates in Bengaluru or Silicon Valley, there is a circle for you.
          </p>
        </div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AFFINITY_CIRCLES.map((circle) => {
            const Icon = circle.icon;
            const isJoined = joinedMap[circle.id];

            return (
              <div
                key={circle.id}
                className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 hover:border-glgold/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${circle.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-teal-300 font-bold bg-teal-950/60 border border-teal-500/30 px-2.5 py-0.5 rounded-full">
                      {circle.members}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-glgold transition mb-1.5">
                    {circle.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {circle.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                    {circle.lead}
                  </span>

                  <button
                    onClick={() => handleToggleJoin(circle.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition flex items-center space-x-1 ${
                      isJoined
                        ? "bg-emerald-950 text-emerald-300 border-emerald-500/50"
                        : "bg-white/5 hover:bg-white/15 text-white border-white/15"
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Joined</span>
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
