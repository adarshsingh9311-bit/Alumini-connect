import React, { useState } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  Building2 
} from "lucide-react";

export const UPCOMING_EVENTS = [
  {
    id: "ev-1",
    month: "NOV",
    day: "14",
    year: "2026",
    badge: "Annual Homecoming",
    title: "SANSMRITI 2026: Grand Silver Alumni Meet",
    time: "10:00 AM ? 6:00 PM IST",
    location: "Main Auditorium, GL Bajaj Campus, Greater Noida",
    type: "In-Person",
    attendees: "1,200+ Alumni Registered",
    description: "The grand annual reunion bringing together batches from 2005 to 2025. Featuring campus tour, department nostalgia panels, cultural night, and networking dinner.",
    speakers: ["College Leadership", "Distinguished Alumni Awardees"]
  },
  {
    id: "ev-2",
    month: "OCT",
    day: "28",
    year: "2026",
    badge: "Founders Circle",
    title: "GLB Tech Founders: From Zero to Product-Market Fit",
    time: "6:30 PM ? 8:00 PM IST",
    location: "Virtual Global Stream (Zoom & YouTube Live)",
    type: "Virtual",
    attendees: "480+ RSVP'd",
    description: "Fireside session featuring 3 GLB alumni founders discussing early traction, fundraising pitfalls, hiring engineers, and scaling to \$5M+ ARR.",
    speakers: ["Priya Saxena (PayFlow)", "Abhishek Kashyap (VoltPulse)", "Nitin Bansal (CloudMatrix)"]
  },
  {
    id: "ev-3",
    month: "OCT",
    day: "12",
    year: "2026",
    badge: "Global Studies",
    title: "Targeting Top US & European Masters: The GLB Playbook",
    time: "7:00 PM ? 8:30 PM IST",
    location: "Interactive Webinar & Breakout Rooms",
    type: "Virtual",
    attendees: "340+ Students Signed Up",
    description: "Alumni currently studying or graduated from CMU, Stanford, TU Munich, and NUS break down GRE preparation, scholarship applications, and SOP drafting.",
    speakers: ["Karan Singhal (CMU)", "Ritika Sharma (TU Munich)"]
  },
  {
    id: "ev-4",
    month: "DEC",
    day: "05",
    year: "2026",
    badge: "Career Mentorship",
    title: "Winter SDE Mock Interview & System Design Sprint",
    time: "11:00 AM ? 3:00 PM IST",
    location: "Virtual 1-on-1 Rooms + GLB Lab 4",
    type: "Hybrid",
    attendees: "150 Mentee Slots",
    description: "Intensive 4-hour mock interview marathon with 30 senior GLB alumni working at FAANG and top product companies.",
    speakers: ["30 Verified Alumni Mentors"]
  }
];

export default function EventsSection() {
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [rsvpNotice, setRsvpNotice] = useState(null);

  function handleRegister(event) {
    setRegisteredEvents(prev => ({ ...prev, [event.id]: true }));
    setRsvpNotice(`RSVP Confirmed for ${event.title}! Calendar invite dispatched.`);
    setTimeout(() => setRsvpNotice(null), 3500);
  }

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Calendar className="w-3.5 h-3.5 text-glgold" />
            <span>Community Calendar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            What's Happening in the GLB Family
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stay connected through on-campus reunions, international virtual town halls, and mentorship bootcamps designed to keep the GLB bond alive.
          </p>
        </div>

        {/* RSVP Toast */}
        {rsvpNotice && (
          <div className="bg-emerald-900/90 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl text-center text-sm font-semibold flex items-center justify-center space-x-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{rsvpNotice}</span>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {UPCOMING_EVENTS.map((item) => {
            const isRegistered = registeredEvents[item.id];
            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 sm:p-7 hover:border-glgold/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Date Badge + Category Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Howard-style Date Tile */}
                      <div className="w-14 h-16 rounded-2xl bg-gradient-to-b from-glblue-750 to-teal-950 border border-teal-500/30 flex flex-col items-center justify-center text-center shadow-md group-hover:border-glgold/60 transition">
                        <span className="text-[10px] font-black uppercase text-glgold tracking-wider">
                          {item.month}
                        </span>
                        <span className="text-2xl font-black text-white leading-none mt-0.5">
                          {item.day}
                        </span>
                      </div>

                      <div>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-glgold/15 text-glgold border border-glgold/30 px-2.5 py-0.5 rounded-full mb-1">
                          {item.badge}
                        </span>
                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          {item.type === "Virtual" ? (
                            <span className="flex items-center space-x-1 text-teal-300 font-medium">
                              <Video className="w-3.5 h-3.5" />
                              <span>Virtual Stream</span>
                            </span>
                          ) : item.type === "Hybrid" ? (
                            <span className="flex items-center space-x-1 text-amber-300 font-medium">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Hybrid Event</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-slate-300 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-glgold" />
                              <span>On-Campus</span>
                            </span>
                          )}
                          <span>?</span>
                          <span className="text-slate-400">{item.year}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      {item.attendees}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-black text-lg sm:text-xl text-white group-hover:text-glgold transition mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Logistics Info */}
                  <div className="space-y-1.5 text-xs text-slate-400 mb-4 pb-4 border-b border-white/5">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Key Speakers: {item.speakers.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400 sm:hidden">
                    {item.attendees}
                  </span>

                  {isRegistered ? (
                    <button
                      disabled
                      className="w-full sm:w-auto bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>RSVP Confirmed</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(item)}
                      className="w-full sm:w-auto bg-white/5 hover:bg-glgold hover:text-slate-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 hover:border-glgold transition flex items-center justify-center space-x-1.5 group/btn"
                    >
                      <span>RSVP for Event</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
