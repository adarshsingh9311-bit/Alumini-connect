import React, { useState } from "react";
import { Send, CheckCircle2, Globe, Heart } from "lucide-react";

export default function UniversityConnectBeyond() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3500);
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      iconClass: "fa-brands fa-linkedin-in",
      handle: "GL Bajaj Alumni Network",
      url: "https://www.linkedin.com"
    },
    {
      name: "GitHub",
      iconClass: "fa-brands fa-github",
      handle: "glb-open-source",
      url: "https://github.com"
    },
    {
      name: "Instagram",
      iconClass: "fa-brands fa-instagram",
      handle: "@glbajajalumni",
      url: "https://instagram.com"
    },
    {
      name: "X (Twitter)",
      iconClass: "fa-brands fa-x-twitter",
      handle: "@GLB_Alumni",
      url: "https://twitter.com"
    },
    {
      name: "YouTube",
      iconClass: "fa-brands fa-youtube",
      handle: "GL Bajaj TV",
      url: "https://youtube.com"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Global Footprint</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            Stay Connected Beyond GLB
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Engage with official alumni channels across professional and social platforms.
          </p>
        </div>

        {/* Minimal Social Links Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="bg-white rounded-xl border border-[#E7E1D4] p-4 text-center hover:border-[#B58A38] transition shadow-[0_2px_6px_rgba(0,0,0,0.02)] group flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex items-center justify-center text-slate-700 group-hover:text-[#0C1929] transition">
                <i className={`${item.iconClass} text-lg`}></i>
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-[#0C1929]">
                  {item.name}
                </div>
                <div className="text-[10px] text-[#718096] truncate max-w-[120px]">
                  {item.handle}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Newsletter Box in Warm Beige */}
        <div className="bg-[#F5F1E8] rounded-xl border border-[#E7E1D4] p-8 max-w-3xl mx-auto text-center space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#0C1929] font-serif">
            Subscribe to the Quarterly Alumni Chronicle
          </h3>
          <p className="text-xs sm:text-sm text-[#4A5568] max-w-md mx-auto leading-relaxed">
            Curated updates on fellow graduates' achievements, campus development, and upcoming reunions.
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-lg max-w-md mx-auto text-xs font-semibold flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! You are subscribed to the Chronicle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white border border-[#E7E1D4] rounded-lg px-3.5 py-2.5 text-xs text-[#0C1929] placeholder-[#A0AEC0] focus:outline-none focus:border-[#B58A38]"
              />
              <button
                type="submit"
                className="bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] font-semibold px-4 py-2.5 rounded-lg text-xs transition"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
