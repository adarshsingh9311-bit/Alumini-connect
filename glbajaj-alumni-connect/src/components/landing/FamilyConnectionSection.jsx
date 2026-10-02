import React from "react";
import { Building2, Globe2, HeartHandshake, GraduationCap, Sparkles, ArrowRight } from "lucide-react";

export default function FamilyConnectionSection() {
  const steps = [
    {
      num: "01",
      title: "GLB College",
      icon: Building2,
      desc: "Knowledge Park III campus providing academic foundation, ethics, and innovation culture.",
      accent: "border-[#0C1929] text-[#0C1929]"
    },
    {
      num: "02",
      title: "GLB Alumni",
      icon: Globe2,
      desc: "Graduates excelling across top global tech firms, research centers, and public governance.",
      accent: "border-[#8C7138] text-[#8C7138]"
    },
    {
      num: "03",
      title: "Mentors",
      icon: HeartHandshake,
      desc: "Experienced alumni returning to guide, review resumes, and conduct peer mock interviews.",
      accent: "border-[#C29B38] text-[#C29B38]"
    },
    {
      num: "04",
      title: "Students",
      icon: GraduationCap,
      desc: "Current scholars reaching higher with 1-on-1 senior roadmaps and trusted job referrals.",
      accent: "border-[#0C1929] text-[#0C1929]"
    },
    {
      num: "05",
      title: "Future Alumni",
      icon: Sparkles,
      desc: "Graduating scholars who step into industry and renew the cycle of giving back.",
      accent: "border-[#8C7138] text-[#8C7138]"
    }
  ];

  return (
    <section id="family" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>The Enduring Bond</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            Your GLB Family, Wherever You Go
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            From Greater Noida to international technology hubs, our community forms a continuous circle of guidance and mutual support.
          </p>
        </div>

        {/* Visual Pipeline: GLB -> ALUMNI -> MENTORS -> STUDENTS -> FUTURE ALUMNI */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between hover:border-[#C29B38] transition shadow-[0_2px_6px_rgba(0,0,0,0.02)] relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold text-[#A0AEC0]">
                      {step.num}
                    </span>
                    <div className={`w-9 h-9 rounded-lg bg-[#FAF8F5] border flex items-center justify-center ${step.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-[#0C1929] mb-1.5 font-serif">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 text-[#A0AEC0]">
                    <ArrowRight className="w-4 h-4 text-[#C29B38]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Community Note */}
        <div className="bg-[#FAF8F5] rounded-xl border border-[#E7E1D4] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-bold text-base text-[#0C1929] font-serif">
              "Once GLB, Always GLB."
            </h4>
            <p className="text-xs sm:text-sm text-[#5C667A]">
              Our network thrives because every generation of GL Bajaj graduates supports the next.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs font-semibold text-[#0C1929]">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E1D4]">
              Connect
            </span>
            <span>?</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E1D4]">
              Mentor
            </span>
            <span>?</span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E7E1D4]">
              Give Back
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
