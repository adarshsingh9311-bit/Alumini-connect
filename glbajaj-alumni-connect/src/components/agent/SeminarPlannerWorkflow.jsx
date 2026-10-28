import React, { useState } from "react";
import { Sparkles, Calendar, Clock, Users, BookOpen, CheckCircle, FileText, Send } from "lucide-react";
import { createSeminarPlan } from "../../lib/agentService";
import { useToast } from "../../context/ToastContext";

export default function SeminarPlannerWorkflow() {
  const { addToast } = useToast();
  const [topic, setTopic] = useState("Agentic AI Architecture & Microservices in Production");
  const [duration, setDuration] = useState("90 minutes");
  const [targetBatch, setTargetBatch] = useState("3rd & 4th Year B.Tech Scholars");
  const [capacity, setCapacity] = useState(100);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  async function handleGeneratePlan(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const generated = await createSeminarPlan({
        topic,
        duration,
        target_batch: targetBatch,
        capacity: Number(capacity)
      });
      setPlan(generated);
      addToast("AI Seminar Plan & Reminders synthesized successfully!", "success");
    } catch (err) {
      addToast("Failed to generate seminar plan", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      
      {/* Workflow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
            <span>Workflow P1: Autonomous Seminar Curator &amp; Planner</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Host an Alumni Tech Seminar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Let the agent curate an industry-aligned agenda, target audience segment, and 3-stage reminder timeline.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
          <span>Status:</span>
          <span className="font-bold text-emerald-700">{plan ? "CURATED" : "READY"}</span>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Seminar Topic / Core Skill Domain
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
            placeholder="e.g. Distributed System Design with Kafka"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Duration
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
          >
            <option value="60 minutes">60 minutes (Fast-track)</option>
            <option value="90 minutes">90 minutes (Recommended)</option>
            <option value="120 minutes">120 minutes (Deep-dive Workshop)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Student Capacity
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            min="10"
            max="500"
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold text-xs shadow-md transition flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#ffcc4e]" />
            <span>{loading ? "Agent Synthesizing Agenda..." : "Generate AI Seminar Plan"}</span>
          </button>
        </div>
      </form>

      {/* Generated Plan Display */}
      {plan && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-6 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agenda Timeline */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ffcc4e]" />
                <span>Curated Agenda ({plan.duration})</span>
              </h4>
              <div className="space-y-2">
                {plan.agenda.map((ag, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-100 text-xs flex items-start justify-between gap-3">
                    <span className="font-mono font-bold text-slate-500 whitespace-nowrap">{ag.time}</span>
                    <span className="text-slate-800 text-right">{ag.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites & Outcomes */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Student Prerequisites</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {plan.prerequisites.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* 3-Stage Reminder Plan */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Automated 3-Stage Reminder Plan</span>
                </h4>
                <div className="space-y-1.5">
                  {plan.reminders.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-emerald-100">
                      <span className="font-bold text-slate-800">{r.stage}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600">
              Calendar asset: <strong className="text-slate-900">{plan.calendar_ics_status}</strong>
            </span>
            <button
              type="button"
              onClick={() => addToast("Seminar schedule published & calendar event simulated!", "success")}
              className="px-5 py-2 rounded-xl bg-[#592106] text-white font-bold hover:bg-[#472510] transition"
            >
              Publish Seminar to GL Bajaj Portal (Simulated)
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
