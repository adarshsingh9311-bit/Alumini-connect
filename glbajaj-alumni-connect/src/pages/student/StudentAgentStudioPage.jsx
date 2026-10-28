import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { 
  runMentorMatchWorkflow, 
  submitWorkflowApproval 
} from "../../lib/agentService";

import AgentActivityConsole from "../../components/agent/AgentActivityConsole";
import ExplainableMatchCard from "../../components/agent/ExplainableMatchCard";
import OutreachApprovalModal from "../../components/agent/OutreachApprovalModal";
import SeminarPlannerWorkflow from "../../components/agent/SeminarPlannerWorkflow";

import { 
  Sparkles, 
  Send, 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  RefreshCw,
  Cpu,
  Calendar,
  Users,
  Briefcase,
  ChevronRight
} from "lucide-react";

export default function StudentAgentStudioPage() {
  const { profile } = useAuth();
  const { addToast } = useToast();

  const [targetRole, setTargetRole] = useState("Machine Learning Engineer");
  const [skillsInput, setSkillsInput] = useState("Python, Machine Learning, PyTorch, SQL");
  const [resumeFilename, setResumeFilename] = useState("Resume_GLB_Scholar.pdf");
  const [isMatching, setIsMatching] = useState(false);
  const [workflowState, setWorkflowState] = useState(null);
  const [events, setEvents] = useState([]);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("matching"); // 'matching' | 'seminar'

  useEffect(() => {
    handleTriggerMatch();
  }, []);

  async function handleTriggerMatch() {
    setIsMatching(true);
    try {
      const res = await runMentorMatchWorkflow({
        target_role: targetRole,
        skills: skillsInput,
        student_name: profile?.full_name || "Tanmay Singhal",
        student_id: profile?.id || "stu-glb-01",
        goals: ["Off-campus placement", "Resume review", "System design mock interview"]
      });
      setWorkflowState(res);
      setEvents(res.events || []);
      addToast(`Agent pipeline executed for ${targetRole}`, "success");
    } catch (err) {
      addToast("Failed to run agent matching pipeline", "error");
    } finally {
      setIsMatching(false);
    }
  }

  function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFilename(file.name);
      addToast(`Resume "${file.name}" uploaded. Skills parsed by Candidate Profiler.`, "success");
    }
  }

  async function handleApproveOutreach(workflowId, message) {
    try {
      const res = await submitWorkflowApproval(workflowId, "APPROVE", message);
      setWorkflowState(res);
      setEvents((prev) => [...prev, ...(res.events || [])]);
      setApprovalModalOpen(false);
      addToast("Outreach approved & simulated dispatch to mentor!", "success");
    } catch (err) {
      addToast("Failed to record approval decision", "error");
    }
  }

  async function handleRejectOutreach(workflowId) {
    try {
      const res = await submitWorkflowApproval(workflowId, "REJECT");
      setWorkflowState(res);
      setEvents((prev) => [...prev, ...(res.events || [])]);
      setApprovalModalOpen(false);
      addToast("Outreach rejected. Transmission halted.", "info");
    } catch (err) {
      addToast("Failed to record rejection", "error");
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#592106] via-[#472510] to-[#2f1508] border-b-4 border-[#ffcc4e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#ffcc4e]/20 border border-[#ffcc4e]/40 text-[#ffcc4e] text-xs px-3 py-1 rounded-full font-bold">
              <Cpu className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>AGENTX 2026 • Autonomous Career Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Multi-Agent Career Studio
            </h1>
            <p className="text-[#faf6eb] text-xs sm:text-sm max-w-2xl leading-relaxed">
              Demonstrate the complete live multi-agent journey: Candidate Profiler, Explainable Mentorship Broker, PII Guardrail Redaction, and the Seminar Planner.
            </p>
          </div>

          {/* Workflow Toggle */}
          <div className="flex items-center space-x-2 bg-black/30 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveWorkflowTab("matching")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeWorkflowTab === "matching" ? "bg-[#ffcc4e] text-[#472510] shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Mentor Match (P0)</span>
            </button>
            <button
              onClick={() => setActiveWorkflowTab("seminar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeWorkflowTab === "seminar" ? "bg-[#ffcc4e] text-[#472510] shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Seminar Planner (P1)</span>
            </button>
          </div>
        </div>
      </div>

      {activeWorkflowTab === "seminar" ? (
        <SeminarPlannerWorkflow />
      ) : (
        <>
          {/* Step 1: Candidate Profiler Goal & Skill Input */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#592106] bg-amber-100/60 px-2.5 py-1 rounded-md">
                  Agent Node 1 • Candidate Profiler
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Input Career Objective &amp; Parse Skills
                </h2>
                <p className="text-xs text-slate-500">
                  Select an aspirational career target or upload your CV to trigger automated gap detection.
                </p>
              </div>

              <button
                onClick={handleTriggerMatch}
                disabled={isMatching}
                className="px-5 py-2.5 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold text-xs shadow-md transition flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 text-[#ffcc4e] ${isMatching ? "animate-spin" : ""}`} />
                <span>{isMatching ? "Agents Executing..." : "Rerun Multi-Agent Pipeline"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Aspirational Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
                >
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Backend Engineer">Backend Engineer (Java/Go)</option>
                  <option value="Frontend Engineer">Frontend Engineer (React/TypeScript)</option>
                  <option value="DevOps / SRE">DevOps / SRE Engineer</option>
                  <option value="Data Engineer">Data Engineer (Big Data / Spark)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Skills (Manual or Extracted)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
                  placeholder="e.g. Python, PyTorch, SQL"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume Attachment (Optional)
                </label>
                <label className="cursor-pointer flex p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 items-center justify-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5 text-[#592106]" />
                  <span className="truncate">{resumeFilename}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Inferred Preparation Gaps */}
            {workflowState?.inferred_gaps && workflowState.inferred_gaps.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-900">Inferred Preparation Gaps:</span>
                  <div className="flex flex-wrap gap-1">
                    {workflowState.inferred_gaps.map((g, idx) => (
                      <span key={idx} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-amber-800 italic">
                  Identified by Candidate Profiler as benchmark requirements
                </span>
              </div>
            )}
          </div>

          {/* AI Activity Console (Live Trace) */}
          <AgentActivityConsole
            workflowState={workflowState}
            events={events}
          />

          {/* Explainable Matches & Approval Trigger */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Ranked Alumni Matches ({workflowState?.ranked_matches?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Scored via formula: <code>40% Skill + 30% Relevance + 20% Availability - 15% Workload</code>.
                </p>
              </div>

              {workflowState?.status === "AWAITING_HUMAN_APPROVAL" && (
                <button
                  onClick={() => setApprovalModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 animate-bounce"
                >
                  <ShieldCheck className="w-4 h-4 text-[#472510]" />
                  <span>Review Synthesized Outreach Draft</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workflowState?.ranked_matches?.map((match, idx) => (
                <ExplainableMatchCard
                  key={idx}
                  match={match}
                  onSelectForOutreach={() => setApprovalModalOpen(true)}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Human Approval Modal */}
      <OutreachApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        workflowState={workflowState}
        onApprove={handleApproveOutreach}
        onReject={handleRejectOutreach}
      />

    </div>
  );
}
