import React, { useState } from "react";
import { FileText, BookOpen, Building, Rocket, Briefcase, CreditCard, CheckCircle2, ArrowRight } from "lucide-react";

export const UNIVERSITY_RESOURCES = [
  {
    id: "ur-1",
    title: "Official Transcripts & Verification",
    icon: FileText,
    desc: "Order authenticated college transcripts, degree verifications, and migration certificates for WES, US, and UK graduate programs."
  },
  {
    id: "ur-2",
    title: "Digital Research Library Access",
    icon: BookOpen,
    desc: "Off-campus digital access to IEEE Xplore, ScienceDirect, and GL Bajaj institutional research publications."
  },
  {
    id: "ur-3",
    title: "Campus Guest Passes & Alumni Lounge",
    icon: Building,
    desc: "Generate an instant visitor pass, reserve conference rooms, or access sports amenities when visiting the Greater Noida campus."
  },
  {
    id: "ur-4",
    title: "E-Cell Incubation & Grants",
    icon: Rocket,
    desc: "Prototyping facilities, patent filing legal support, and seed funding support via the GL Bajaj Incubation Foundation."
  },
  {
    id: "ur-5",
    title: "Internal Alumni Referral Board",
    icon: Briefcase,
    desc: "Browse tech and management positions posted directly by GL Bajaj seniors with 1-click referral requests."
  },
  {
    id: "ur-6",
    title: "Lifelong Alumni Identity & Perks",
    icon: CreditCard,
    desc: "Permanent alumni directory access, partner corporate travel privileges, and executive education fee concessions."
  }
];

export default function UniversityResourcesSection() {
  const [requested, setRequested] = useState({});

  function handleRequest(id) {
    setRequested(prev => ({ ...prev, [id]: true }));
  }

  return (
    <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#E7E1D4] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Institutional Privileges</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            GLB Alumni Resources & Benefits
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Your connection with GL Bajaj extends far beyond graduation with continuous institutional support and campus access.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {UNIVERSITY_RESOURCES.map((res) => {
            const Icon = res.icon;
            const isDone = requested[res.id];

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C29B38] transition duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-[#0C1929] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-bold text-base text-[#0C1929] mb-1.5 font-serif">
                    {res.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F5F1E8]">
                  <button
                    onClick={() => handleRequest(res.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                      isDone
                        ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                        : "bg-[#FAF8F5] text-[#0C1929] border border-[#E7E1D4] hover:bg-white hover:border-[#B58A38]"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Request Initiated</span>
                      </>
                    ) : (
                      <>
                        <span>Access Resource</span>
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
