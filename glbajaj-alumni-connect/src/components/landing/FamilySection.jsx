import React from "react";
import { 
  Building2, 
  Users, 
  Compass, 
  GraduationCap, 
  HeartHandshake, 
  MessageSquare, 
  Gift, 
  Globe2, 
  ArrowRight 
} from "lucide-react";

export default function FamilySection() {
  const steps = [
    {
      icon: Building2,
      tag: "Foundation",
      title: "College Heritage",
      desc: "GL Bajaj Greater Noida provides the rigorous academic foundation, world-class labs, and entrepreneurial spirit.",
      color: "from-teal-600 to-teal-800"
    },
    {
      icon: Globe2,
      tag: "Global Footprint",
      title: "Alumni Worldwide",
      desc: "Over 15,000 graduates working in Silicon Valley, Delhi-NCR, Bengaluru, London, Singapore, and beyond.",
      color: "from-glblue-750 to-teal-900"
    },
    {
      icon: Compass,
      tag: "Guidance",
      title: "Industry Mentors",
      desc: "Experienced engineers, PMs, founders, and civil servants dedicating time to guide the next generation.",
      color: "from-glgold to-amber-600"
    },
    {
      icon: GraduationCap,
      tag: "Next Generation",
      title: "GLB Scholars",
      desc: "Current students climbing higher with personalized roadmap guidance, mock interviews, and trusted referrals.",
      color: "from-amber-600 to-amber-800"
    }
  ];

  const pillars = [
    {
      step: "01",
      title: "CONNECT",
      desc: "Discover GLB seniors by company, branch, graduation year, or location worldwide.",
      icon: Users,
      bg: "bg-teal-900/30 border-teal-500/30 text-teal-300"
    },
    {
      step: "02",
      title: "MENTOR",
      desc: "Request 1-on-1 guidance for SDE roles, off-campus placements, GATE, CAT, and MS abroad.",
      icon: HeartHandshake,
      bg: "bg-amber-900/30 border-amber-500/30 text-amber-300"
    },
    {
      step: "03",
      title: "CHAT",
      desc: "Converse directly with verified alumni through private, real-time messaging.",
      icon: MessageSquare,
      bg: "bg-teal-900/30 border-teal-500/30 text-teal-300"
    },
    {
      step: "04",
      title: "GIVE BACK",
      desc: "Alumni share internal job referrals, mentor junior batches, and sponsor student clubs.",
      icon: Gift,
      bg: "bg-amber-900/30 border-amber-500/30 text-amber-300"
    },
    {
      step: "05",
      title: "STAY CONNECTED",
      desc: "Celebrate batch reunions, career promotions, startup milestones, and college achievements.",
      icon: Globe2,
      bg: "bg-teal-900/30 border-teal-500/30 text-teal-300"
    }
  ];

  return (
    <section id="family" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/80 border-t border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <span>The Enduring GLB Bond</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Your GLB Family, Wherever You Go
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From the classrooms of Knowledge Park III to Fortune 500 boardrooms and high-growth venture-backed startups, your GLB connection remains vibrant and supportive.
          </p>
        </div>

        {/* Relationship Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-950/70 border border-white/10 rounded-2xl p-6 relative hover:border-glgold/40 transition group hover:-translate-y-1 duration-200"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-glgold mb-1">
                  {item.tag}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600">
                    <ArrowRight className="w-5 h-5 text-glgold/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5 Core Pillars Bar */}
        <div className="bg-slate-950/90 border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h3 className="text-xl font-black text-white">
              The Five Pillars of GLB Alumni Connect
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              How our community fosters career breakthroughs and lasting friendships
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold text-slate-500">{pillar.step}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${pillar.bg}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="font-extrabold text-sm text-white tracking-wide mb-1">
                      {pillar.title}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
