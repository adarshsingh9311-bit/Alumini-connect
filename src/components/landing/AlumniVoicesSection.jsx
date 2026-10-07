import React from "react";
import { Quote } from "lucide-react";

export default function AlumniVoicesSection() {
  const testimonials = [
    {
      id: "voice-1",
      quote: "GL Bajaj has an enviable track record of academic excellence, which is coupled with hands-on technical training, and innumerable industry-institute interactions, which makes each GL Bajaj student ready for the corporate.",
      name: "Saurabh Sarkar",
      batch: "Class of 2014",
      designation: "Software Engineer",
      organization: "Apple",
      image: "https://www.glbitm.org/Uploads/image/753imguf_saurabh-cs.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "voice-2",
      quote: "The rigorous computer science fundamentals and project work at GL Bajaj laid the foundation for my postgraduate work at Oxford University and my software engineering roles in Munich.",
      name: "Ankur Varshney",
      batch: "Class of 2011",
      designation: "Software Engineer",
      organization: "Enfas GmbH, Munich (Ex-BMW)",
      image: "https://www.glbitm.org/Uploads/image/796imguf_ankur.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "voice-3",
      quote: "The discipline, determination and leadership values nurtured during my college years at GL Bajaj prepared me to serve our country as a Squadron Leader in the Indian Air Force.",
      name: "Shikha Chaudhary",
      batch: "B.Tech Alumna",
      designation: "Squadron Leader",
      organization: "Indian Air Force",
      image: "https://www.glbitm.org/Uploads/image/830imguf_shikha.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F1E8] border-t border-b border-[#E7E1D4] font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Alumni Reflections</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            Voices From Our GLB Family
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Reflections from graduates who walked our campus corridors and are now shaping global engineering and leadership.
          </p>
        </div>

        {/* 3 Academic Quote Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E7E1D4] p-7 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#C29B38]/40 fill-[#C29B38]/10" />
                <p className="text-xs sm:text-sm text-[#2B3442] italic leading-relaxed font-serif">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#F5F1E8] flex items-center space-x-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = item.fallbackImage;
                  }}
                  className="w-12 h-12 rounded-full object-cover object-top border border-[#C29B38]/40 shadow-xs shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-[#0C1929] leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#8C7138]">
                    {item.batch}
                  </p>
                  <p className="text-[11px] text-[#718096] font-medium leading-tight mt-0.5">
                    {item.designation} • {item.organization}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
