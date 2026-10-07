import React, { useState } from "react";
import { 
  FileText, 
  BookOpen, 
  Building, 
  Rocket, 
  Briefcase, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";

export const RESOURCES = [
  {
    id: "r-1",
    title: "Official Transcripts & Degree Verification",
    icon: FileText,
    badge: "Registrar Cell",
    desc: "Order authenticated college transcripts, migration certificates, and syllabus copies for higher studies (WES, US, UK, Canada).",
    action: "Request Transcripts"
  },
  {
    id: "r-2",
    title: "Digital Research Library Access",
    icon: BookOpen,
    badge: "Academic",
    desc: "Complimentary off-campus access to IEEE Xplore, ScienceDirect, Springer, and GLB institutional digital publications.",
    action: "Access Library"
  },
  {
    id: "r-3",
    title: "Campus Guest Passes & Alumni Lounge",
    icon: Building,
    badge: "Campus",
    desc: "Visiting Greater Noida? Generate an instant campus entry QR pass, book conference facilities, and use the sports complex.",
    action: "Book Campus Pass"
  },
  {
    id: "r-4",
    title: "E-Cell Incubation & Seed Grants",
    icon: Rocket,
    badge: "Entrepreneurship",
    desc: "Access prototyping labs, IoT testing facilities, patent filing support, and initial seed funding via the GL Bajaj Incubation Foundation.",
    action: "Apply for Incubation"
  },
  {
    id: "r-5",
    title: "Internal Alumni Referral Board",
    icon: Briefcase,
    badge: "Careers",
    desc: "Browse unadvertised tech and management vacancies posted directly by GLB seniors with 1-click referral requests.",
    action: "View Referrals"
  },
  {
    id: "r-6",
    title: "Lifelong Alumni Identity & Perks",
    icon: CreditCard,
    badge: "Privileges",
    desc: "Permanent alumni email alias, special discounts on executive education, and partner corporate hotel/flight benefits.",
    action: "Claim Alumni Perks"
  }
];

export default function ResourcesSection() {
  const [requested, setRequested] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  function handleAction(resource) {
    setRequested(prev => ({ ...prev, [resource.id]: true }));
    setToastMessage(`Service request initiated for: ${resource.title}. Details sent to your email.`);
    setTimeout(() => setToastMessage(null), 3000);
  }

  return (
    <section id="resources" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-t border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <BookOpen className="w-3.5 h-3.5 text-glgold" />
            <span>Alumni Privileges & Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            GLB Alumni Resources & Benefits
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Your relationship with GL Bajaj extends far beyond graduation day. Enjoy institutional privileges, transcript verification, and startup incubation.
          </p>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-xl animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCES.map((res) => {
            const Icon = res.icon;
            const isDone = requested[res.id];

            return (
              <div
                key={res.id}
                className="bg-slate-950/80 border border-white/10 rounded-3xl p-6 hover:border-glgold/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-glblue-750/70 border border-teal-500/30 flex items-center justify-center text-teal-300 shadow-md group-hover:scale-105 transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 px-2.5 py-1 rounded-full border border-white/10">
                      {res.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white group-hover:text-glgold transition mb-2">
                    {res.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {res.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleAction(res)}
                    className={`w-full text-xs font-bold py-2.5 px-4 rounded-xl border transition flex items-center justify-center space-x-1.5 ${
                      isDone
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                        : "bg-white/5 hover:bg-glgold hover:text-slate-950 text-white border-white/10 hover:border-glgold"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Request Sent</span>
                      </>
                    ) : (
                      <>
                        <span>{res.action}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
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
