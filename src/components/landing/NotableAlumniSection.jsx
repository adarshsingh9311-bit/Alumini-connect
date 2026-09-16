import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2
} from "lucide-react";

export const NOTABLE_GLB_ALUMNI = [
  {
    id: "notable-1",
    name: "Saurabh Sarkar",
    batch: "B.Tech CSE ? 2014",
    branch: "Computer Science & Engineering",
    designation: "Software Engineer",
    organization: "Apple",
    quote: "GL Bajaj has an enviable track record of academic excellence, coupled with hands-on technical training.",
    image: "https://www.glbitm.org/Uploads/image/753imguf_saurabh-cs.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  },
  {
    id: "notable-2",
    name: "Ankur Varshney",
    batch: "B.Tech CSE ? 2011",
    branch: "Computer Science & Engineering",
    designation: "Software Engineer",
    organization: "Enfas GmbH, Munich (Ex-BMW)",
    quote: "From GLB laboratories to MS at TU Kaiserslautern, research at Oxford University, and engineering at BMW HQ Munich.",
    image: "https://www.glbitm.org/Uploads/image/796imguf_ankur.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  },
  {
    id: "notable-3",
    name: "Shikha Chaudhary",
    batch: "B.Tech ECE ? Alumna",
    branch: "Electronics & Communication",
    designation: "Squadron Leader",
    organization: "Indian Air Force",
    quote: "From GLB campus to serving the nation as Squadron Leader in the Indian Air Force.",
    image: "https://www.glbitm.org/Uploads/image/830imguf_shikha.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  },
  {
    id: "notable-4",
    name: "Anshul Shukla",
    batch: "B.Tech CSE ? 2012",
    branch: "Computer Science & Engineering",
    designation: "UI Engineer",
    organization: "Flipkart",
    quote: "Architecting frontend user interfaces at Flipkart scale, delivering responsive experiences to millions.",
    image: "https://www.glbitm.org/Uploads/image/797imguf_anshul.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: false
  },
  {
    id: "notable-5",
    name: "Shami Agrawal",
    batch: "B.Tech CSE ? 2013",
    branch: "Computer Science & Engineering",
    designation: "Software Engineer",
    organization: "Solnet, New Zealand",
    quote: "Building enterprise cloud architecture and distributed software platforms in New Zealand.",
    image: "https://www.glbitm.org/Uploads/image/CS-Alumni-ShamiAgrawal-20.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  },
  {
    id: "notable-6",
    name: "Gaurav Joshi",
    batch: "B.Tech CSE ? 2013",
    branch: "Computer Science & Engineering",
    designation: "Sr. Technical Advisor",
    organization: "Concentric New Zealand",
    quote: "Advising enterprise technology leaders on cloud systems and strategic digital transformation.",
    image: "https://www.glbitm.org/Uploads/image/CS-Alumni-GauravJoshil-20.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  },
  {
    id: "notable-7",
    name: "Ashish Pandey",
    batch: "B.Tech CSE ? 2014",
    branch: "Computer Science & Engineering",
    designation: "Analyst Programmer",
    organization: "MediaTech",
    quote: "Developing media analytics software and high-availability digital publishing tools.",
    image: "https://www.glbitm.org/Uploads/image/CS-Alumni-AshishPandey-20.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: false
  },
  {
    id: "notable-8",
    name: "Ankit Pratap Singh",
    batch: "B.Tech CSE ? 2015",
    branch: "Computer Science & Engineering",
    designation: "M.Tech Scholar",
    organization: "NIT Hamirpur",
    quote: "Pursuing advanced research in computing architectures and systems at NIT Hamirpur.",
    image: "https://www.glbitm.org/Uploads/image/795imguf_ankitpratap.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    availableForMentorship: true
  }
];

export default function NotableAlumniSection({ onSelectAlumnus }) {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  const totalItems = NOTABLE_GLB_ALUMNI.length;

  const canPrev = startIndex > 0;
  const canNext = startIndex + itemsPerPage < totalItems;

  function handlePrev() {
    if (canPrev) {
      setStartIndex((prev) => Math.max(0, prev - 1));
    }
  }

  function handleNext() {
    if (canNext) {
      setStartIndex((prev) => Math.min(totalItems - itemsPerPage, prev + 1));
    }
  }

  const visibleAlumni = NOTABLE_GLB_ALUMNI.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section id="notable-alumni" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full font-sans">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#E7E1D4] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#8C7138] text-xs font-semibold uppercase tracking-widest mb-2 font-serif">
            <span>Official College Records</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#0C1929] font-serif tracking-tight">
            GLB Alumni Who Inspire Us
          </h2>
          <p className="text-sm sm:text-base text-[#4A5568] mt-2 max-w-2xl leading-relaxed">
            Meet GLBIANS who are creating an impact across industries, organizations and the world.
          </p>
        </div>

        {/* Carousel Desktop Controls */}
        <div className="hidden sm:flex items-center space-x-3 shrink-0">
          <button
            onClick={handlePrev}
            disabled={!canPrev}
            aria-label="Previous Alumni"
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition shadow-xs ${
              canPrev
                ? "bg-white border-[#E7E1D4] text-[#0C1929] hover:border-[#B58A38] hover:text-[#B58A38]"
                : "bg-[#FAF8F5] border-[#E7E1D4]/60 text-[#A0AEC0] cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-medium text-[#718096] px-1 font-mono">
            {startIndex + 1}?{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
          </span>

          <button
            onClick={handleNext}
            disabled={!canNext}
            aria-label="Next Alumni"
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition shadow-xs ${
              canNext
                ? "bg-white border-[#E7E1D4] text-[#0C1929] hover:border-[#B58A38] hover:text-[#B58A38]"
                : "bg-[#FAF8F5] border-[#E7E1D4]/60 text-[#A0AEC0] cursor-not-allowed"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Alumni Card Grid (Matching Exact Requested Structure) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleAlumni.map((alumnus) => (
          <div
            key={alumnus.id}
            className="bg-white rounded-xl border border-[#E7E1D4] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#B58A38]/60 hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] transition duration-200 flex flex-col justify-between group"
          >
            <div>
              {/* [PHOTO] */}
              <div className="relative aspect-[4/3] w-full bg-[#F3EFE6] overflow-hidden border-b border-[#E7E1D4]">
                <img
                  src={alumnus.image}
                  alt={alumnus.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = alumnus.fallbackImage;
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-102 transition duration-300"
                />

                {alumnus.availableForMentorship && (
                  <div className="absolute top-2.5 right-2.5 bg-[#FAF8F5]/95 backdrop-blur-xs text-[#0C1929] border border-[#B58A38]/40 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center space-x-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Available for Mentorship</span>
                  </div>
                )}
              </div>

              {/* Alumni Details */}
              <div className="p-5 space-y-2 text-center sm:text-left">
                {/* Name */}
                <h3 className="font-bold text-base sm:text-lg text-[#0C1929] leading-tight font-serif group-hover:text-[#B58A38] transition">
                  {alumnus.name}
                </h3>

                {/* Batch / Branch */}
                <div className="text-xs font-semibold text-[#8C7138] uppercase tracking-wider">
                  {alumnus.batch}
                </div>

                {/* Current Designation & Company */}
                <div className="pt-1">
                  <div className="text-xs font-bold text-[#0C1929]">
                    {alumnus.designation}
                  </div>
                  <div className="text-xs font-medium text-[#4A5568]">
                    {alumnus.organization}
                  </div>
                </div>

                {/* Short Achievement or Journey Quote */}
                <p className="text-xs text-[#5C667A] leading-relaxed pt-2 italic font-serif line-clamp-3">
                  "{alumnus.quote}"
                </p>
              </div>
            </div>

            {/* Buttons: [View Profile] and [Connect] */}
            <div className="p-5 pt-0 border-t border-[#F5F1E8] mt-3">
              <div className="pt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectAlumnus(alumnus)}
                  className="text-xs font-semibold py-2 px-2.5 rounded-lg bg-[#FAF8F5] text-[#0C1929] border border-[#E7E1D4] hover:bg-white hover:border-[#B58A38] transition text-center"
                >
                  View Profile
                </button>

                <button
                  onClick={() => onSelectAlumnus(alumnus)}
                  className="text-xs font-semibold py-2 px-2.5 rounded-lg bg-[#0C1929] text-[#FAF8F5] hover:bg-[#1A2C42] transition text-center shadow-xs"
                >
                  Connect
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Navigation of Section */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7E1D4]">
        <div className="text-xs text-[#718096]">
          Information verified from the official GL Bajaj Institute of Technology & Management notable alumni archive.
        </div>

        <Link
          to="/student/alumni"
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-[#0C1929] hover:text-[#B58A38] border-b border-[#0C1929] hover:border-[#B58A38] pb-0.5 transition"
        >
          <span>View All Alumni ?</span>
        </Link>
      </div>

    </section>
  );
}
