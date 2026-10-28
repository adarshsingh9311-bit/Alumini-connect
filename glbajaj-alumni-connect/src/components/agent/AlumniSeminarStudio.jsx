import React, { useState } from "react";
import { Sparkles, Calendar, Clock, Users, Video, MessageSquare, Plus, CheckCircle, ExternalLink, Share2, BookOpen } from "lucide-react";
import { createSeminarWorkflow } from "../../lib/agentService";
import { useToast } from "../../context/ToastContext";

export default function AlumniSeminarStudio() {
  const { addToast } = useToast();
  const [title, setTitle] = useState("Agentic AI in Enterprise Production");
  const [topic, setTopic] = useState("Multi-Agent Architecture & Tool Calling");
  const [speakerName, setSpeakerName] = useState("Aman Sharma");
  const [speakerCompany, setSpeakerCompany] = useState("Google");
  const [speakerRole, setSpeakerRole] = useState("Staff AI Engineer");
  const [date, setDate] = useState("Nov 15, 2026");
  const [timeSlot, setTimeSlot] = useState("05:00 PM - 06:30 PM IST");
  const [totalSlots, setTotalSlots] = useState(50);
  const [description, setDescription] = useState(
    "Join this masterclass to explore how autonomous agents coordinate workflows, scrub PII, and deploy production LLM systems."
  );

  const [loading, setLoading] = useState(false);
  const [createdSeminar, setCreatedSeminar] = useState(null);

  async function handleCreateSeminar(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const details = {
        title,
        topic,
        speaker_name: speakerName,
        speaker_company: speakerCompany,
        speaker_role: speakerRole,
        date,
        time_slot: timeSlot,
        total_slots: Number(totalSlots),
        description
      };
      const result = await createSeminarWorkflow(details);
      setCreatedSeminar(result.seminar_details || result);
      addToast("Masterclass autonomously curated and published with Meet & WhatsApp links!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to curate seminar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-[#592106] to-[#431804] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#ffcc4e]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb]/15 text-[#ffcc4e] border border-[#ffcc4e]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alumni Masterclass Studio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Curate an Autonomous Seminar
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Fill in your topic and capacity. Our agentic curator will automatically generate a 3-part timed agenda, provision Google Meet &amp; WhatsApp rooms, design promotional copy, and open registration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
            Masterclass Configuration
          </h2>

          <form onSubmit={handleCreateSeminar} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Seminar Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain / Topic</label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Seat Capacity</label>
                <input
                  type="number"
                  required
                  min="10"
                  max="500"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speaker Name</label>
                <input
                  type="text"
                  required
                  value={speakerName}
                  onChange={(e) => setSpeakerName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speaker Company / Role</label>
                <input
                  type="text"
                  required
                  value={speakerCompany}
                  onChange={(e) => setSpeakerCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brief Description / Objective</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl text-xs font-bold bg-[#592106] text-white hover:bg-[#431804] disabled:opacity-50 transition shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Assets &amp; Provisioning Links...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#ffcc4e]" />
                  <span>Curate &amp; Publish Masterclass</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Agent Generated Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
                <span>Agent-Synthesized Assets</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                {createdSeminar ? "LIVE ACTIVE" : "PREVIEW"}
              </span>
            </div>

            {/* Generated Links */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700">Provisioned Meeting &amp; Community Links:</span>
              
              {/* Google Meet Action Pill */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100 transition group">
                <a
                  href={createdSeminar?.meet_link || "https://meet.google.com/new"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-slate-800 flex-1 mr-2"
                >
                  <Video className="w-4 h-4 text-[#592106] shrink-0" />
                  <span className="font-mono text-[11px] truncate text-[#592106] font-semibold underline decoration-dotted">
                    {createdSeminar?.meet_link || "https://meet.google.com/glb-agentx-2026"}
                  </span>
                </a>
                <a
                  href={createdSeminar?.meet_link || "https://meet.google.com/new"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-[10px] font-bold text-white bg-[#592106] hover:bg-[#431804] px-2.5 py-1 rounded-lg shadow-sm transition"
                >
                  <span>Open Meet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* WhatsApp Community Action Pill */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100 transition group">
                <a
                  href={createdSeminar?.whatsapp_link || "https://chat.whatsapp.com/"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-slate-800 flex-1 mr-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-mono text-[11px] truncate text-emerald-800 font-semibold underline decoration-dotted">
                    {createdSeminar?.whatsapp_link || "https://chat.whatsapp.com/GLBAJAJ-AI-2026"}
                  </span>
                </a>
                <a
                  href={createdSeminar?.whatsapp_link || "https://chat.whatsapp.com/"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-[10px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg shadow-sm transition"
                >
                  <span>Join Chat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* 3-Part Syllabus Agenda */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700">Synthesized 3-Part Agenda:</span>
              <div className="space-y-2">
                {(createdSeminar?.agenda || [
                  { time: "00:00 - 00:20", module: "Part 1: Transitioning from Traditional Full-Stack to Agentic AI" },
                  { time: "00:20 - 00:55", module: "Part 2: LangGraph StateGraph Architecture & Tool Execution in Production" },
                  { time: "00:55 - 01:25", module: "Part 3: End-to-End Live Coding: Building an Autonomous Enterprise Agent" }
                ]).map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-[#faf6eb] border border-[#ffcc4e]/40 rounded-xl text-xs space-y-0.5">
                    <span className="font-bold text-[#592106] text-[10px]">{item.time}</span>
                    <p className="text-slate-800 text-[11px]">{item.module}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Poster copy preview */}
            <div className="p-3 bg-slate-900 rounded-2xl text-white text-xs space-y-1">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Promotional Copy</div>
              <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                📢 GL BAJAJ MASTERCLASS: {title} by {speakerName} ({speakerCompany}). 
                Slots: {totalSlots} seats. Date: {date} @ {timeSlot}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}