import React, { useState } from "react";
import { 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Share2, 
  PartyPopper, 
  Award, 
  GraduationCap, 
  Briefcase 
} from "lucide-react";

export const INITIAL_MOMENTS = [
  {
    id: "m-1",
    author: "Rahul Gupta",
    batch: "CSE '21",
    type: "Promotion",
    icon: Briefcase,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    content: "Thrilled to share that I've been promoted to Senior Software Engineer at Microsoft! Immense gratitude to my GLB coding circle who stayed up all night practicing dynamic programming in hostel rooms.",
    likes: 84,
    comments: 19,
    timeAgo: "2 hours ago"
  },
  {
    id: "m-2",
    author: "Neha Mishra",
    batch: "IT '22",
    type: "Higher Studies",
    icon: GraduationCap,
    color: "text-teal-300 bg-teal-500/10 border-teal-500/30",
    content: "Heading to Pittsburgh! Officially admitted into Carnegie Mellon University for MS in Intelligent Information Systems (MIIS). Big shoutout to GLB senior Karan Singhal for reviewing my SOP multiple times!",
    likes: 128,
    comments: 34,
    timeAgo: "1 day ago"
  },
  {
    id: "m-3",
    author: "GLB Robotics Alumni Wing",
    batch: "Batches '16-'20",
    type: "Giving Back",
    icon: Award,
    color: "text-glgold bg-glgold/10 border-glgold/30",
    content: "Alumni from our old autonomous robotics club pooled together to sponsor 2 industrial-grade 3D LiDAR sensors for the current GL Bajaj E-BAJA collegiate team. Keep innovating, juniors!",
    likes: 215,
    comments: 42,
    timeAgo: "3 days ago"
  },
  {
    id: "m-4",
    author: "Bengaluru Alumni Chapter",
    batch: "All Batches",
    type: "Reunion",
    icon: PartyPopper,
    color: "text-purple-300 bg-purple-500/10 border-purple-500/30",
    content: "Amazing turnout at our Indiranagar alumni mixer! Over 70 GLBians from batches 2008 to 2024 caught up over filter coffee and startup ideas. Next meetup coming up in Koramangala next month.",
    likes: 162,
    comments: 27,
    timeAgo: "4 days ago"
  },
  {
    id: "m-5",
    author: "Sahil Verma",
    batch: "ME '19",
    type: "Achievement",
    icon: Sparkles,
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    content: "Honored to be listed in the Forbes 30 Under 30 Asia list for our cold-chain agritech venture! It all started with an ideation pitch in the GL Bajaj AB-1 seminar hall.",
    likes: 310,
    comments: 58,
    timeAgo: "1 week ago"
  },
  {
    id: "m-6",
    author: "Tarun & Swati",
    batch: "ECE '18",
    type: "Celebration",
    icon: Heart,
    color: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    content: "Batchmates in 2014, lab partners in 2016, and now partners for life! Over 25 GLB friends flew in to celebrate our wedding. Once GLB, always GLB family!",
    likes: 420,
    comments: 73,
    timeAgo: "2 weeks ago"
  }
];

export default function MomentsSection() {
  const [moments, setMoments] = useState(INITIAL_MOMENTS);
  const [likedMap, setLikedMap] = useState({});

  function handleLike(id) {
    setMoments(prev => prev.map(m => {
      if (m.id === id) {
        const isLiked = likedMap[id];
        return {
          ...m,
          likes: isLiked ? m.likes - 1 : m.likes + 1
        };
      }
      return m;
    }));
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="moments" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/70 border-t border-b border-white/10 relative">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 text-glgold font-bold text-xs uppercase tracking-widest bg-glgold/10 px-3 py-1 rounded-full border border-glgold/30">
            <Heart className="w-3.5 h-3.5 fill-glgold text-glgold" />
            <span>Community Wall</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            GLB Family Moments
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Celebrating the personal milestones, career breakthroughs, and heartwarming reunions that make our GL Bajaj community a lifelong family.
          </p>
        </div>

        {/* Moments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moments.map((item) => {
            const Icon = item.icon;
            const isLiked = likedMap[item.id];

            return (
              <div
                key={item.id}
                className="bg-slate-950/85 border border-white/10 rounded-3xl p-6 hover:border-glgold/30 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top: Author & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-white">{item.author}</h3>
                      <span className="text-[11px] font-mono text-glgold font-semibold">
                        {item.batch}
                      </span>
                    </div>

                    <span className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{item.type}</span>
                    </span>
                  </div>

                  {/* Body */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    "{item.content}"
                  </p>
                </div>

                {/* Bottom Bar: Interactions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>{item.timeAgo}</span>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center space-x-1.5 transition ${
                        isLiked ? "text-rose-400 font-bold" : "text-slate-400 hover:text-rose-400"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-400" : ""}`} />
                      <span>{item.likes}</span>
                    </button>

                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <MessageCircle className="w-4 h-4" />
                      <span>{item.comments}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
