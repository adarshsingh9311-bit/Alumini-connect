import React, { useState } from "react";
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const UNIVERSITY_EVENTS = [
  {
    id: "uev-1",
    month: "NOV",
    day: "14",
    year: "2026",
    category: "Reunion",
    title: "SANSMRITI 2026: Grand Silver Alumni Meet",
    time: "10:00 AM ? 5:30 PM IST",
    location: "Main Auditorium, GL Bajaj Campus, Greater Noida",
    description: "The annual institutional homecoming bringing together batches across 20 years for department panels, faculty interactions, and campus nostalgic tours.",
    attendees: "1,200+ Alumni"
  },
  {
    id: "uev-2",
    month: "OCT",
    day: "28",
    year: "2026",
    category: "Career Talk",
    title: "GLB Founders: Scaling from Zero to \$5M ARR",
    time: "6:30 PM ? 8:00 PM IST",
    location: "Virtual Global Webinar (Zoom & YouTube Live)",
    description: "Alumni tech founders share candid lessons on early customer traction, technical architecture choices, and raising venture capital.",
    attendees: "450+ Registered"
  },
  {
    id: "uev-3",
    month: "OCT",
    day: "12",
    year: "2026",
    category: "Mentorship Session",
    title: "International Masters & Research Pathways",
    time: "7:00 PM ? 8:30 PM IST",
    location: "Interactive Online Seminar",
    description: "Alumni currently pursuing or graduated with MS/PhD degrees at Oxford, CMU, and TU Munich guide students on GRE, SOPs, and scholarships.",
    attendees: "320+ Students"
  }
];

export default function UniversityEventsSection() {
  const [rsvps, setRsvps] = useState({});

  function handleRsvp(id) {
    setRsvps(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] border-t border-[#E7E1D4] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Academic & Community Calendar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            What's Happening in the GLB Family
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Upcoming reunions, mentorship masterclasses, and networking mixers organized by the college and alumni chapters.
          </p>
        </div>

        {/* 3 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UNIVERSITY_EVENTS.map((event) => {
            const isRegistered = rsvps[event.id];

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C29B38] transition duration-200"
              >
                <div>
                  {/* Date Badge and Category */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-13 h-14 rounded-lg bg-[#FAF8F5] border border-[#E7E1D4] flex flex-col items-center justify-center text-center shrink-0">
                      <span className="text-[10px] font-bold text-[#8C7138] uppercase">
                        {event.month}
                      </span>
                      <span className="text-xl font-bold text-[#0C1929] leading-none mt-0.5 font-serif">
                        {event.day}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#FAF8F5] text-[#2B3442] border border-[#E7E1D4]">
                      {event.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0C1929] leading-snug mb-2 font-serif">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#4A5568] leading-relaxed mb-4">
                    {event.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#718096] mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3.5 h-3.5 text-[#8C7138]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8C7138]" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* RSVP Button */}
                <div className="pt-3 border-t border-[#F5F1E8]">
                  <button
                    onClick={() => handleRsvp(event.id)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
                      isRegistered
                        ? "bg-emerald-700 text-white"
                        : "bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5]"
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>RSVP Confirmed</span>
                      </>
                    ) : (
                      <>
                        <span>Register / RSVP</span>
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
