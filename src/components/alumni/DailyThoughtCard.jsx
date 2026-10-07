import React, { useState, useEffect } from "react";
import { Sun, Heart, Share2, Check, Sparkles, Quote } from "lucide-react";
import { getThoughtForDate } from "../../lib/dailyThoughtsData";
import { useToast } from "../../context/ToastContext";

export default function DailyThoughtCard() {
  const { addToast } = useToast();
  const [thought, setThought] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Formatted date string (e.g., "Thursday, September 17, 2026")
  const today = new Date();
  const dateFormatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const todayIso = today.toISOString().split("T")[0];

  useEffect(() => {
    const dailyThought = getThoughtForDate(todayIso);
    setThought(dailyThought);
    setLikeCount(dailyThought?.likes_count || 24);

    // Check if user already liked today's thought
    try {
      const likedKeys = JSON.parse(localStorage.getItem("glb_thought_likes") || "[]");
      if (dailyThought && likedKeys.includes(`${dailyThought.id}_${todayIso}`)) {
        setHasLiked(true);
      }
    } catch (e) {
      // ignore
    }
  }, [todayIso]);

  function handleToggleLike() {
    if (!thought) return;
    const key = `${thought.id}_${todayIso}`;
    let likedKeys = [];
    try {
      likedKeys = JSON.parse(localStorage.getItem("glb_thought_likes") || "[]");
    } catch (e) {
      likedKeys = [];
    }

    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      const updated = likedKeys.filter((k) => k !== key);
      localStorage.setItem("glb_thought_likes", JSON.stringify(updated));
    } else {
      setHasLiked(true);
      setLikeCount((c) => c + 1);
      likedKeys.push(key);
      localStorage.setItem("glb_thought_likes", JSON.stringify(likedKeys));
      addToast("Thank you for your reaction!", "success");
    }
  }

  function handleShare() {
    if (!thought) return;
    const shareText = `"${thought.quote}" — ${thought.author} (GL Bajaj Alumni Connect)`;

    if (navigator.share) {
      navigator
        .share({
          title: "Daily GLB Thought",
          text: shareText,
          url: window.location.origin
        })
        .catch(() => copyToClipboard(shareText));
    } else {
      copyToClipboard(shareText);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      addToast("Daily thought copied to clipboard!", "info");
      setTimeout(() => setCopied(false), 2500);
    });
  }

  if (!thought) return null;

  return (
    <div className="bg-[#FAF8F5] border border-[#E7DFC6] rounded-3xl p-6 shadow-xs relative overflow-hidden transition hover:border-[#D4AF37]/50">
      {/* Decorative Warm Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C2853B] via-[#E5B56A] to-[#0F2132]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#8C7138] uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 text-[#C2853B]" />
            <span>DAILY GLB THOUGHT</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">{dateFormatted}</p>
        </div>

        {thought.category && (
          <span className="text-[10px] font-semibold bg-white border border-[#E7DFC6] text-slate-700 px-2.5 py-0.5 rounded-full shadow-xs">
            {thought.category}
          </span>
        )}
      </div>

      {/* Quote Body */}
      <div className="my-3.5">
        <blockquote className="text-slate-800 font-serif italic text-sm sm:text-[15px] leading-relaxed relative pl-3 border-l-2 border-[#C2853B]/60">
          "{thought.quote}"
        </blockquote>
        <div className="mt-2 text-right">
          <span className="text-xs font-semibold text-slate-600 font-serif">
            — {thought.author || "GLB Alumni Connect"}
          </span>
        </div>
      </div>

      {/* Interactive Actions Footer */}
      <div className="pt-3 mt-2 border-t border-[#EFE8D8] flex items-center justify-between text-xs">
        <button
          onClick={handleToggleLike}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl transition font-medium ${
            hasLiked
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          }`}
          title={hasLiked ? "Unlike" : "Heart today's thought"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition ${
              hasLiked ? "fill-rose-500 text-rose-500" : "text-slate-400"
            }`}
          />
          <span className="font-mono text-[11px]">{likeCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-slate-600 hover:bg-white hover:text-[#C2853B] transition font-medium text-[11px]"
          title="Share this thought"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Share Thought</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
