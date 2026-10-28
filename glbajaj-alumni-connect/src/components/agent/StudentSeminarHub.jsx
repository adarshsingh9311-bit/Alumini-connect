import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Clock, Users, Video, MessageSquare, ArrowRight, CheckCircle2, ShieldCheck, Mail, ExternalLink } from "lucide-react";
import { fetchSeminars } from "../../lib/agentService";
import SeminarRegistrationModal from "./SeminarRegistrationModal";
import SimulatedEmailInboxModal from "./SimulatedEmailInboxModal";

export default function StudentSeminarHub() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [lastRegisteredStudent, setLastRegisteredStudent] = useState(null);

  useEffect(() => {
    loadSeminars();
  }, []);

  async function loadSeminars() {
    setLoading(true);
    try {
      const data = await fetchSeminars();
      setSeminars(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenRegister(sem) {
    setSelectedSeminar(sem);
    setIsRegisterOpen(true);
  }

  function handleOpenInbox(sem) {
    setSelectedSeminar(sem);
    setIsInboxOpen(true);
  }

  function handleRegistrationSuccess(response) {
    // Update local state seat count
    if (selectedSeminar) {
      setSeminars((prev) =>
        prev.map((s) =>
          s.id === selectedSeminar.id
            ? { ...s, booked_slots: Math.min(s.booked_slots + 1, s.total_slots) }
            : s
        )
      );
    }
    if (response.student_registration) {
      setLastRegisteredStudent(response.student_registration);
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-[#592106] to-[#431804] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#ffcc4e]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb]/15 text-[#ffcc4e] border border-[#ffcc4e]/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AGENTX 2026 • Autonomous Lifecycle Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Alumni Masterclasses &amp; Tech Seminars
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Autonomous seat allocation, dynamic capacity reservation, and omnichannel notifications managed entirely by AI agents.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => handleOpenInbox(seminars[0])}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ffcc4e] text-[#592106] hover:bg-[#ffe082] transition shadow-md flex items-center space-x-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Simulated Webmail &amp; WhatsApp Alerts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Seminar Listing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Upcoming Live Masterclasses</h2>
          <span className="text-xs text-slate-500 font-medium">Real-time slot capacity tracking active</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <div className="w-6 h-6 border-2 border-[#592106] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading active seminars...
          </div>
        ) : seminars.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No active seminars scheduled yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {seminars.map((sem) => {
              const booked = sem.booked_slots || 0;
              const total = sem.total_slots || 50;
              const remaining = Math.max(total - booked, 0);
              const percentage = Math.round((booked / total) * 100);
              const isFull = remaining === 0;

              return (
                <div
                  key={sem.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-lg transition space-y-5"
                >
                  {/* Card Top */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/50">
                          {sem.topic || "Tech Masterclass"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sem.date}</span>
                        </span>
                        <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{sem.time_slot}</span>
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{sem.title}</h3>
                      <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                        {sem.description}
                      </p>
                    </div>

                    {/* Speaker Capsule */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1 shrink-0 min-w-[200px]">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Speaker</span>
                      <p className="font-bold text-slate-900">{sem.speaker_name}</p>
                      <p className="text-slate-500">{sem.speaker_company} • GL Bajaj Alumnus</p>
                    </div>
                  </div>

                  {/* Dynamic Capacity Tracker */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 flex items-center space-x-1.5">
                        <Users className="w-4 h-4 text-[#592106]" />
                        <span>Seat Allocation:</span>
                        <strong className="text-slate-900">{booked} / {total} Claimed</strong>
                      </span>
                      <span className={isFull ? "text-rose-600 font-bold" : "text-emerald-700 font-bold"}>
                        {isFull ? "Sold Out" : `${remaining} Slots Remaining`}
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          percentage > 85 ? "bg-amber-500" : "bg-[#592106]"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* 3-Part Agenda Preview */}
                  {sem.agenda && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-800">Autonomous 3-Part Syllabus:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {sem.agenda.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#faf6eb]/50 border border-[#ffcc4e]/30 text-xs space-y-1"
                          >
                            <span className="text-[10px] font-bold text-[#592106]">{item.time}</span>
                            <p className="text-slate-700 line-clamp-2">{item.module}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified GL Bajaj Student ID required for admission</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleOpenInbox(sem)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                      >
                        Preview Alerts
                      </button>

                      <button
                        onClick={() => handleOpenRegister(sem)}
                        disabled={isFull}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#592106] text-white hover:bg-[#431804] disabled:opacity-50 transition shadow-md flex items-center space-x-2"
                      >
                        <span>{isFull ? "Capacity Full" : "Register & Claim Seat"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <SeminarRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        seminar={selectedSeminar}
        onRegistered={handleRegistrationSuccess}
      />

      <SimulatedEmailInboxModal
        isOpen={isInboxOpen}
        onClose={() => setIsInboxOpen(false)}
        seminar={selectedSeminar}
        student={lastRegisteredStudent}
      />
    </div>
  );
}