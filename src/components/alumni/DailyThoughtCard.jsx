import React, { useState, useEffect } from "react";
import { Sun, Heart, Share2, Check } from "lucide-react";
import { getThoughtForDate } from "../../lib/dailyThoughtsData";
import { useToast } from "../../context/ToastContext";

export default function DailyThoughtCard() {
  const { addToast } = useToast();
  const [thought, setThought] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [copied, setCopied] = useState(false);

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
    <div className="bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A1F24] uppercase tracking-wider">
            <Sun className="w-3.5 h-3.5 text-[#B08A3E]" />
            <span>DAILY GLB THOUGHT</span>
          </div>
          <p className="text-[11px] text-[#667085]">{dateFormatted}</p>
        </div>

        {thought.category && (
          <span className="text-[10px] font-semibold bg-[#F7F3EA] border border-[#D9DDE3] text-[#202124] px-2.5 py-0.5 rounded">
            {thought.category}
          </span>
        )}
      </div>

      {/* Quote Body */}
      <div className="my-3">
        <blockquote className="text-[#202124] italic text-xs sm:text-sm leading-relaxed pl-3 border-l-2 border-[#7A1F24]">
          "{thought.quote}"
        </blockquote>
        <div className="mt-2 text-right">
          <span className="text-xs font-semibold text-[#667085]">
            — {thought.author || "GLB Alumni Connect"}
          </span>
        </div>
      </div>

      {/* Interactive Actions Footer */}
      <div className="pt-3 mt-2 border-t border-[#D9DDE3]/60 flex items-center justify-between text-xs">
        <button
          onClick={handleToggleLike}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition text-xs font-medium cursor-pointer ${
            hasLiked
              ? "bg-[#FDF6F6] text-[#B42318] border border-[#B42318]/30"
              : "text-[#667085] hover:bg-[#F7F3EA] hover:text-[#202124]"
          }`}
          title={hasLiked ? "Unlike" : "Heart today's thought"}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              hasLiked ? "fill-[#B42318] text-[#B42318]" : "text-[#667085]"
            }`}
          />
          <span className="font-mono text-[11px]">{likeCount}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[#667085] hover:bg-[#F7F3EA] hover:text-[#7A1F24] transition text-[11px] font-medium cursor-pointer"
          title="Share this thought"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#2E6B4A]" />
              <span className="text-[#2E6B4A] font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#667085]" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
