import React from "react";
import { Terminal, CheckCircle2, Clock, ShieldAlert, Cpu } from "lucide-react";

export default function AgentActivityConsole({ workflowState, events = [] }) {
  const currentStatus = workflowState?.status || "IDLE";

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-[#faf6eb] border border-[#ffcc4e]/40 text-[#592106]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                AI Agent Execution Trace
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/50">
                ACTIVE PIPELINE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Workflow ID: {workflowState?.workflow_id || "None active"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <span
            className={`px-2.5 py-1 rounded-lg font-bold uppercase text-[11px] ${
              currentStatus === "AWAITING_HUMAN_APPROVAL"
                ? "bg-amber-100 text-amber-900 border border-amber-300"
                : currentStatus === "SIMULATED" || currentStatus === "COMPLETED"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : currentStatus === "REJECTED"
                ? "bg-rose-100 text-rose-900 border border-rose-300"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {currentStatus}
          </span>
        </div>
      </div>

      {/* Structured Clean Event List */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
        {events.length === 0 ? (
          <div className="py-6 text-center text-slate-400 space-y-1">
            <Clock className="w-6 h-6 mx-auto opacity-50 mb-1 text-slate-300" />
            <p>Ready to orchestrate. Click "Rerun Multi-Agent Pipeline" to begin.</p>
          </div>
        ) : (
          events.map((ev, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#592106] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#592106]" />
                  {ev.agent}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">{ev.time_str || "Just now"}</span>
              </div>
              <div className="text-slate-800 font-semibold">{ev.step}</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{ev.result_summary}</p>
            </div>
          ))
        )}
      </div>

      {/* Trust & Safety Guardrail Bar */}
      {workflowState?.pii_flags && workflowState.pii_flags.length > 0 && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-amber-950 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Guardrail Filter:</strong> {workflowState.pii_flags.length} private items masked before approval.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 self-start sm:self-auto">
            Review Required
          </span>
        </div>
      )}
    </div>
  );
}
