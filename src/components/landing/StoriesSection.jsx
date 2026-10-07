import React, { useState } from "react";
import { 
  Sparkles, 
  Quote, 
  ArrowRight, 
  Building, 
  GraduationCap, 
  ExternalLink,
  Award,
  X
} from "lucide-react";

export const ALUMNI_STORIES = [
  {
    id: "s-1",
    featured: true,
    name: "Vikramaditya Chaurasia",
    batch: "Class of 2015",
    branch: "Computer Science & Engineering",
    currentTitle: "Principal Distributed Systems Architect",
    company: "Stripe, San Francisco",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    headline: "From Greater Noida Labs to Powering Global Internet Commerce",
    quote: "GL Bajaj gave me an uncompromising work ethic. When you build distributed systems that process billions of dollars, the foundational CS concepts taught in our labs are what keep things steady.",
    impactStat: "$10B+ Transaction Infrastructure",
    story: "Graduating in 2015, Vikram began his journey at an NCR product startup before moving to Europe and eventually Silicon Valley. At Stripe, he leads core payment infrastructure. Despite living in California, Vikram conducts weekend system design clinics for GLB final-year students every semester.",
    advice: "Do not just memorize algorithms. Build real systems, deploy them, break them, and understand how networks fail in the real world."
  },
  {
    id: "s-2",
    featured: false,
    name: "Divya Nambiar",
    batch: "Class of 2019",
    branch: "Electronics & Communication",
    currentTitle: "Founding Engineer & AI Lead",
    company: "NeuroMed AI (HealthTech)",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    headline: "Building Early Oncology Detection Models for Tier-2 Hospitals",
    quote: "My professors at GLB encouraged me to submit our 4th-year project to an IEEE conference. That single encouragement shaped my entire career in applied AI.",
    impactStat: "120k+ Patients Screened",
    story: "Divya transitioned from hardware engineering to medical deep learning. Her startup's diagnostic models are deployed across 45 regional hospitals in North India, drastically lowering diagnostic wait times.",
    advice: "Participate in college research initiatives. The bridge between academic papers and real-world impact is where true innovation happens."
  },
  {
    id: "s-3",
    featured: false,
    name: "Abhishek Kashyap",
    batch: "Class of 2017",
    branch: "Mechanical Engineering",
    currentTitle: "Co-Founder & CEO",
    company: "VoltPulse Mobility (EV Tech)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    headline: "Pioneering Swappable Battery Architecture for Commercial Fleets",
    quote: "We started building our first chassis right behind the GLB Mechanical Workshop with used angle irons. Today we operate 800+ fleet vehicles.",
    impactStat: "$4.5M Seed Raised • 800+ EVs",
    story: "Bootstrapped from the GL Bajaj E-Cell incubator, Abhishek and his batchmates engineered a low-cost swappable thermal management battery. Today VoltPulse employs over 70 engineers?including 12 GLB alumni.",
    advice: "GL Bajaj's workshop facilities are world-class. Spend time on the lathe and 3D printers rather than just simulation software."
  },
  {
    id: "s-4",
    featured: false,
    name: "Meenakshi Joshi",
    batch: "Class of 2018",
    branch: "Information Technology",
    currentTitle: "Senior Product Manager",
    company: "Uber, Amsterdam",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    headline: "Orchestrating Driver Safety Features Across 14 European Countries",
    quote: "Being president of the student placement committee taught me cross-functional negotiation before I even knew the term 'Product Management'.",
    impactStat: "25M+ Safe Trips Managed",
    story: "Meenakshi worked as an SDE before pursuing an MBA and pivoting to product. She currently heads the European Driver Trust & Safety product organization at Uber's EMEA headquarters.",
    advice: "Take on campus leadership roles. Engineering skill gets you in the door; communication and empathy take you to global leadership."
  }
];

export default function StoriesSection() {
  const [activeStory, setActiveStory] = useState(null);

  const featuredStory = ALUMNI_STORIES.find(s => s.featured);
  const supportingStories = ALUMNI_STORIES.filter(s => !s.featured);

  return (
    <section id="stories" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Award className="w-3.5 h-3.5 text-glgold" />
            <span>Alumni Hall of Inspiration</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            GLB Alumni Making an Impact
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From Greater Noida to Silicon Valley, European tech hubs, and grassroots innovation, our alumni embody the spirit of excellence and giving back.
          </p>
        </div>

        {/* Featured Story Hero Card */}
        {featuredStory && (
          <div className="bg-gradient-to-br from-slate-950 via-teal-950/40 to-slate-950 border border-glgold/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-glgold/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-glgold/50 transition duration-300">
                  <img
                    src={featuredStory.image}
                    alt={featuredStory.name}
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-4">
                    <div className="text-glgold font-extrabold text-xs uppercase tracking-wider">
                      Featured Spotlight
                    </div>
                    <div className="text-white font-bold text-base">
                      {featuredStory.name}
                    </div>
                    <div className="text-teal-300 text-xs">
                      {featuredStory.currentTitle} @ {featuredStory.company}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold bg-glgold text-slate-950 px-2.5 py-1 rounded-lg">
                    {featuredStory.batch}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {featuredStory.branch}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                  {featuredStory.headline}
                </h3>

                <div className="relative pl-6 border-l-2 border-glgold text-slate-300 italic text-sm sm:text-base leading-relaxed">
                  <Quote className="w-6 h-6 text-glgold/40 absolute -left-3 -top-2 fill-glgold/20" />
                  "{featuredStory.quote}"
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-xl text-teal-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                    <span>Impact: {featuredStory.impactStat}</span>
                  </div>

                  <button
                    onClick={() => setActiveStory(featuredStory)}
                    className="bg-glgold hover:bg-glgold-dark text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-glgold/20 flex items-center space-x-1.5 group/btn"
                  >
                    <span>Read Full Journey</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3 Supporting Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {supportingStories.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 hover:border-glgold/40 transition duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/10 h-48">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-mono text-glgold font-bold border border-white/10">
                    {item.batch}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <h4 className="font-black text-lg text-white group-hover:text-glgold transition">
                    {item.name}
                  </h4>
                  <p className="text-xs font-bold text-teal-400">
                    {item.currentTitle}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.company}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  "{item.headline}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-300">
                  {item.impactStat}
                </span>
                <button
                  onClick={() => setActiveStory(item)}
                  className="text-xs font-bold text-glgold hover:text-white transition flex items-center space-x-1"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Story Details Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={activeStory.image}
                alt={activeStory.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-glgold"
              />
              <div>
                <h3 className="text-xl font-black text-white">{activeStory.name}</h3>
                <p className="text-teal-300 font-bold text-xs sm:text-sm">{activeStory.currentTitle} @ {activeStory.company}</p>
                <p className="text-xs text-slate-400">{activeStory.batch} • {activeStory.branch}</p>
              </div>
            </div>

            <div className="bg-glgold/10 border border-glgold/30 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 italic mb-5 leading-relaxed">
              "{activeStory.quote}"
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-white mb-1">
                  The Journey
                </h5>
                <p>{activeStory.story}</p>
              </div>

              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-glgold mb-1">
                  Words of Advice for GLB Students
                </h5>
                <p className="bg-white/5 p-3 rounded-xl border border-white/5 text-slate-200">
                  {activeStory.advice}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs text-slate-400">
                Official GL Bajaj Alumni Archive
              </span>
              <button
                onClick={() => setActiveStory(null)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
