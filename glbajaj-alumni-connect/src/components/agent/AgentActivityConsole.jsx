import React from "react";
import { Terminal, CheckCircle2, Clock, ShieldAlert, Cpu } from "lucide-react";

export default function AgentActivityConsole({ workflowState, events = [] }) {
  const currentStatus = workflowState?.status || "IDLE";

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold tracking-wider text-slate-100 uppercase">
                AI Agent Activity Console
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                LIVE ORCHESTRATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Workflow ID: {workflowState?.workflow_id || "None active"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">Status:</span>
          <span
            className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] ${
              currentStatus === "AWAITING_HUMAN_APPROVAL"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                : currentStatus === "SIMULATED" || currentStatus === "COMPLETED"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : currentStatus === "REJECTED"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Terminal Event Stream */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="py-8 text-center text-slate-500 space-y-1">
            <Terminal className="w-8 h-8 mx-auto opacity-40 mb-2" />
            <p>Ready to orchestrate. Launch the mentor matching pipeline below.</p>
          </div>
        ) : (
          events.map((ev, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 transition hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  {ev.agent}
                </span>
                <span className="text-slate-500">{ev.time_str || "Just now"}</span>
              </div>
              <div className="text-slate-300 font-semibold">{ev.step}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{ev.result_summary}</p>
            </div>
          ))
        )}
      </div>

      {/* Trust & Safety Indicator Bar */}
      {workflowState?.pii_flags && workflowState.pii_flags.length > 0 && (
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-rose-300">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>
              <strong>Trust &amp; Safety Guardrail:</strong> {workflowState.pii_flags.length} sensitive fields masked (PII Protected).
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-200">
            Human Approval Required
          </span>
        </div>
      )}
    </div>
  );
}
