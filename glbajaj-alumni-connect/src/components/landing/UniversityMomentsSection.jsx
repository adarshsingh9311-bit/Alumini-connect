import React, { useState } from "react";
import { Heart, MessageCircle, Briefcase, GraduationCap, Award, PartyPopper } from "lucide-react";

export const INITIAL_UNIVERSITY_MOMENTS = [
  {
    id: "umom-1",
    author: "Rahul Gupta",
    batch: "CSE '21",
    category: "Promotion",
    badge: "Career Milestone",
    icon: Briefcase,
    text: "Honored to step into the role of Senior Software Engineer at Microsoft. Grateful for the foundation laid during my late-night coding sessions in GLB hostel rooms!",
    likes: 92,
    time: "3 hours ago"
  },
  {
    id: "umom-2",
    author: "Neha Mishra",
    batch: "IT '22",
    category: "Higher Studies",
    badge: "Carnegie Mellon",
    icon: GraduationCap,
    text: "Received my official admission letter for MS in Intelligent Information Systems at Carnegie Mellon University! Sincere thanks to seniors for reviewing my SOP drafts.",
    likes: 135,
    time: "Yesterday"
  },
  {
    id: "umom-3",
    author: "GLB Bengaluru Chapter",
    batch: "All Batches",
    category: "Reunion",
    badge: "Chapter Mixer",
    icon: PartyPopper,
    text: "Great Sunday meetup in Indiranagar with 60+ GLB alumni from batches 2008 to 2024. The GLB spirit continues strong in Bengaluru!",
    likes: 184,
    time: "3 days ago"
  },
  {
    id: "umom-4",
    author: "Abhishek Kashyap",
    batch: "ME '17",
    category: "Startup Launch",
    badge: "VoltPulse Mobility",
    icon: Award,
    text: "Our startup VoltPulse closed its seed round for commercial EV battery systems! It all started at the GL Bajaj E-Cell workshop with our batchmates.",
    likes: 240,
    time: "5 days ago"
  }
];

export default function UniversityMomentsSection() {
  const [moments, setMoments] = useState(INITIAL_UNIVERSITY_MOMENTS);
  const [likedMap, setLikedMap] = useState({});

  function handleLike(id) {
    setMoments(prev => prev.map(m => {
      if (m.id === id) {
        const hasLiked = likedMap[id];
        return {
          ...m,
          likes: hasLiked ? m.likes - 1 : m.likes + 1
        };
      }
      return m;
    }));
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="moments" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      <div className="space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest font-serif">
            <span>Community Celebrations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            GLB Family Moments
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed">
            Sharing the milestones, new chapters, and heartfelt reunions that keep our college family connected.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moments.map((item) => {
            const Icon = item.icon;
            const isLiked = likedMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-[#E7E1D4] p-6 flex flex-col justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#C29B38] transition duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] text-[#8C7138] border border-[#E7E1D4]">
                      {item.badge}
                    </span>
                    <span className="text-[11px] text-[#A0AEC0]">{item.time}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#0C1929]">
                    {item.author}
                  </h3>
                  <p className="text-xs text-[#8C7138] font-medium mb-3">
                    {item.batch}
                  </p>

                  <p className="text-xs text-[#4A5568] leading-relaxed italic font-serif">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F1E8] mt-4 flex items-center justify-between text-xs text-[#718096]">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center space-x-1.5 transition ${
                      isLiked ? "text-rose-600 font-bold" : "hover:text-rose-600"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-600" : ""}`} />
                    <span>{item.likes} Cheers</span>
                  </button>

                  <span className="text-[10px] text-[#A0AEC0]">Verified Member</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
