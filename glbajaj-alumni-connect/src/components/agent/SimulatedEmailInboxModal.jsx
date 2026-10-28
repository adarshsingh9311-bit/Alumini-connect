import React, { useState } from "react";
import { X, Mail, MessageSquare, Clock, Send, Sparkles, CheckCircle2, Video, ExternalLink, Calendar } from "lucide-react";
import { simulateAlertStage } from "../../lib/agentService";
import { useToast } from "../../context/ToastContext";

export default function SimulatedEmailInboxModal({ isOpen, onClose, seminar, student }) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("email"); // "email" or "whatsapp"
  const [selectedStage, setSelectedStage] = useState("T_0");
  const [loading, setLoading] = useState(false);
  const [simulatedAlert, setSimulatedAlert] = useState(null);

  if (!isOpen) return null;

  const currentStudent = student || {
    name: "Tanmay Singhal",
    college_email: "tanmay.s@glbajaj.ac.in",
    mobile: "+91 98765 43210",
    branch: "Computer Science & Engineering",
    year: "3rd Year"
  };

  const currentSeminar = seminar || {
    id: "sem-glb-101",
    title: "Masterclass: Deploying Scalable Agentic AI Systems",
    speaker_name: "Aman Sharma",
    speaker_company: "Google",
    date: "Tomorrow, 06:00 PM IST",
    time_slot: "06:00 PM - 07:30 PM",
    meet_link: "https://meet.google.com/glb-agentx-2026",
    whatsapp_link: "https://chat.whatsapp.com/GLBAJAJ-AI-MASTERS-2026"
  };

  async function handleTriggerStage(stage) {
    setSelectedStage(stage);
    setLoading(true);
    try {
      const res = await simulateAlertStage(stage, currentSeminar.id, currentStudent);
      setSimulatedAlert(res.alert);
      addToast(`Simulated ${stage} dispatch fired successfully!`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to simulate dispatch stage", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/60">
              <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Omnichannel Dispatch Simulator</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Live Judge Demonstration: Time-Travel Alert Dispatches
            </h3>
            <p className="text-xs text-slate-500">
              Simulating delivery channels for: <span className="font-semibold text-slate-800">{currentStudent.college_email}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Time-Travel Controls */}
        <div className="my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-[#592106]" />
            <span>Time-Travel Trigger:</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleTriggerStage("T_0")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedStage === "T_0"
                  ? "bg-[#592106] text-white shadow-sm"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Send className="w-3 h-3" />
              <span>[Simulate T_0 (Instant)]</span>
            </button>

            <button
              onClick={() => handleTriggerStage("T_24h")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedStage === "T_24h"
                  ? "bg-[#592106] text-white shadow-sm"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>[Simulate T-24h (Prep)]</span>
            </button>

            <button
              onClick={() => handleTriggerStage("T_1h")}
              disabled={loading}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                selectedStage === "T_1h"
                  ? "bg-[#592106] text-white shadow-sm"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>[Simulate T-1h (Live Alert)]</span>
            </button>
          </div>
        </div>

        {/* Channel View Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("email")}
            className={`pb-2.5 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === "email"
                ? "border-[#592106] text-[#592106]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>GL Bajaj Webmail Simulation</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`pb-2.5 px-4 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeTab === "whatsapp"
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Community Dispatch</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-mono space-y-3">
          {activeTab === "email" ? (
            <div className="space-y-3 font-sans">
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>From: <strong className="text-slate-700">agent-dispatcher@glbajaj.ac.in</strong></span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  To: <strong className="text-slate-700">{currentStudent.college_email}</strong>
                </div>
                <div className="text-slate-900 font-bold text-sm pt-1">
                  {simulatedAlert?.subject || `[${selectedStage}] Registration Confirmed: ${currentSeminar.title}`}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                {simulatedAlert?.email_body || (
                  selectedStage === "T_0" ? (
                    `Dear ${currentStudent.name},\n\nYour seat for "${currentSeminar.title}" has been successfully reserved by our autonomous multi-agent registration broker.\n\n` +
                    `📅 Date & Time: ${currentSeminar.date} (${currentSeminar.time_slot})\n` +
                    `🎙️ Speaker: ${currentSeminar.speaker_name} (${currentSeminar.speaker_company})\n\n` +
                    `🔗 Direct Google Meet Access: ${currentSeminar.meet_link}\n` +
                    `💬 Join WhatsApp Cohort: ${currentSeminar.whatsapp_link}\n\n` +
                    `An .ics calendar file has been attached. We look forward to seeing you!\n\n` +
                    `Warm regards,\nGL Bajaj Alumni Connect Agent Engine`
                  ) : selectedStage === "T_24h" ? (
                    `Dear ${currentStudent.name},\n\nThis is your 24-hour preparatory briefing for "${currentSeminar.title}".\n\n` +
                    `Recommended Pre-Reading:\n• Review LangGraph StateGraph concepts\n• Prepare 1 question for ${currentSeminar.speaker_name}\n\n` +
                    `Session Link: ${currentSeminar.meet_link}`
                  ) : (
                    `URGENT: Masterclass Starting in 60 Minutes!\n\nHi ${currentStudent.name},\n"${currentSeminar.title}" will begin at ${currentSeminar.time_slot}.\n\nClick here for one-click entry: ${currentSeminar.meet_link}`
                  )
                )}
              </div>

              {/* Action Buttons inside Email */}
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={currentSeminar.meet_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#592106] text-white hover:bg-[#431804] transition"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Google Meet</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                <a
                  href={currentSeminar.whatsapp_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Join WhatsApp Cohort</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          ) : (
            /* WhatsApp Tab */
            <div className="bg-[#e5ddd5] p-4 rounded-xl border border-slate-300 font-sans space-y-3">
              <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-md text-slate-800 text-xs leading-relaxed">
                <div className="text-[11px] font-bold text-emerald-700 mb-1">GL Bajaj Alumni Masterclass Bot</div>
                <div className="whitespace-pre-wrap">
                  {simulatedAlert?.whatsapp_message || (
                    `🚨 [GL BAJAJ MASTERCLASS - ${selectedStage}]\n\n` +
                    `Hello ${currentStudent.name}! Your status for "${currentSeminar.title}":\n` +
                    `• Time: ${currentSeminar.date} • ${currentSeminar.time_slot}\n` +
                    `• Direct Room: ${currentSeminar.meet_link}\n\n` +
                    `Please join 5 mins before start time.`
                  )}
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Demonstration for AGENTX 2026 Evaluation Panel</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Close Simulator
          </button>
        </div>

      </div>
    </div>
  );
}