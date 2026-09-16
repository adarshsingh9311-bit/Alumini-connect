import React, { useState } from "react";
import { Send, CheckCircle2, Globe, Heart } from "lucide-react";

export default function ConnectBeyondSection() {
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
      stats: "18,400+ Members",
      color: "hover:text-[#0a66c2]",
      url: "https://www.linkedin.com"
    },
    {
      name: "GitHub",
      iconClass: "fa-brands fa-github",
      handle: "glb-open-source",
      stats: "140+ Projects",
      color: "hover:text-white",
      url: "https://github.com"
    },
    {
      name: "Instagram",
      iconClass: "fa-brands fa-instagram",
      handle: "@glbajaj_alumni",
      stats: "12.5k Followers",
      color: "hover:text-pink-400",
      url: "https://instagram.com"
    },
    {
      name: "X (Twitter)",
      iconClass: "fa-brands fa-x-twitter",
      handle: "@GLB_Alumni",
      stats: "6.2k Followers",
      color: "hover:text-sky-400",
      url: "https://twitter.com"
    },
    {
      name: "YouTube",
      iconClass: "fa-brands fa-youtube",
      handle: "GL Bajaj Media Cell",
      stats: "45k Subscribers",
      color: "hover:text-rose-500",
      url: "https://youtube.com"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Globe className="w-3.5 h-3.5 text-glgold" />
            <span>Digital Footprint</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Connect Beyond the Platform
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Follow our global channels for campus news, live event streams, career opportunities, and nostalgia snippets.
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {socialLinks.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 text-center hover:border-glgold/40 hover:-translate-y-1 transition duration-200 group flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl text-slate-300 group-hover:scale-110 transition shadow-inner">
                <i className={`${item.iconClass} ${item.color} transition text-2xl`}></i>
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-glgold transition">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {item.handle}
                </div>
                <div className="text-[10px] text-teal-300 font-semibold mt-1">
                  {item.stats}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Newsletter Box */}
        <div className="bg-gradient-to-r from-glblue-750 via-teal-950 to-glblue-750 border border-teal-500/30 rounded-3xl p-8 max-w-3xl mx-auto text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-glgold/20 border border-glgold/40 flex items-center justify-center mx-auto text-glgold">
            <Heart className="w-5 h-5 fill-glgold" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Subscribe to the GLB Alumni Chronicle
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            A curated quarterly digest featuring alumni career breakthroughs, campus updates, and upcoming reunion dates.
          </p>

          {subscribed ? (
            <div className="bg-emerald-950/70 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl max-w-md mx-auto text-sm font-semibold flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Thank you! You are subscribed to the Chronicle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-slate-950/90 border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-glgold"
              />
              <button
                type="submit"
                className="bg-glgold hover:bg-glgold-dark text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 shadow-lg shadow-glgold/20"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
