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
  Users, 
  Sparkles, 
  Send, 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  GraduationCap, 
  RefreshCw,
  Sliders,
  AlertCircle
} from "lucide-react";

export default function StudentDashboard() {
  const { profile, user } = useAuth();
  const { addToast } = useToast();

  // Agent State
  const [targetRole, setTargetRole] = useState("Machine Learning Engineer");
  const [skillsInput, setSkillsInput] = useState("Python, Machine Learning, PyTorch, SQL");
  const [resumeFilename, setResumeFilename] = useState("Resume_GLB_Scholar.pdf");
  const [isMatching, setIsMatching] = useState(false);
  const [workflowState, setWorkflowState] = useState(null);
  const [events, setEvents] = useState([]);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [showSeminarWorkflow, setShowSeminarWorkflow] = useState(false);

  // Initial auto-trigger to seed view on first load
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
        goals: ["Off-campus referral", "Mock interview", "System Design teardown"]
      });
      setWorkflowState(res);
      setEvents(res.events || []);
      addToast(`Agent retrieved and ranked top alumni for ${targetRole}`, "success");
    } catch (err) {
      addToast("Error running matching pipeline", "error");
    } finally {
      setIsMatching(false);
    }
  }

  function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFilename(file.name);
      addToast(`Resume "${file.name}" uploaded. Profiler will extract skills automatically.`, "success");
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
      
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-[#592106] via-[#472510] to-[#2f1508] border-b-4 border-[#ffcc4e] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#ffcc4e]/20 border border-[#ffcc4e]/40 text-[#ffcc4e] text-xs px-3 py-1 rounded-full font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Student Portal | Roll No: {profile?.roll_number || "230192010055"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good Morning, {profile?.full_name?.split(" ")[0] || "Scholar"}!
            </h1>
            <p className="text-[#faf6eb] text-xs sm:text-sm max-w-xl leading-relaxed">
              Agent-driven career acceleration: find verified alumni mentors, simulate outreach with human-in-the-loop safety, and host tech seminars.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowSeminarWorkflow(!showSeminarWorkflow)}
              className="bg-[#ffcc4e]/20 hover:bg-[#ffcc4e]/30 text-[#ffcc4e] border border-[#ffcc4e]/50 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{showSeminarWorkflow ? "View Mentors" : "Host a Seminar"}</span>
            </button>
            <Link
              to="/student/alumni"
              className="bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition"
            >
              Browse Directory (30+ Alumni)
            </Link>
          </div>
        </div>
      </div>

      {/* Flagship Flow: Seminar Planner Toggle or Main Mentor Match */}
      {showSeminarWorkflow ? (
        <SeminarPlannerWorkflow />
      ) : (
        <>
          {/* Main Agent Step 1: Student Goal & Profiler Input Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#592106] bg-amber-100/60 px-2.5 py-1 rounded-md">
                  P0: Candidate Profiler &amp; Goal Orchestration
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Specify Your Target Career Goal
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your aspired job role, edit extracted skills, or upload your CV for automated parsing.
                </p>
              </div>

              <button
                onClick={handleTriggerMatch}
                disabled={isMatching}
                className="px-5 py-2.5 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold text-xs shadow-md transition flex items-center space-x-2 self-start sm:self-auto"
              >
                <RefreshCw className={`w-4 h-4 text-[#ffcc4e] ${isMatching ? "animate-spin" : ""}`} />
                <span>{isMatching ? "Orchestrating..." : "Run AI Mentor Match"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Target Role Selector */}
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

              {/* Editable Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Skills (Manual entry or parsed)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
                  placeholder="e.g. Python, PyTorch, SQL"
                />
              </div>

              {/* Resume Upload Simulator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resume Attachment (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer flex-1 p-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 flex items-center justify-center gap-1.5 transition">
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
            </div>

            {/* Profiler Extracted Gaps Pill */}
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
                  Suggested for discussion during mentorship
                </span>
              </div>
            )}
          </div>

          {/* AI Activity Console (Visibly Agentic Backend Log Stream) */}
          <AgentActivityConsole
            workflowState={workflowState}
            events={events}
          />

          {/* Ranked Explainable Matches Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Top Recommended Alumni Mentors ({workflowState?.ranked_matches?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Scored using formula: <code>40% Skill + 30% Relevance + 20% Availability - 15% Workload</code>.
                </p>
              </div>

              {workflowState?.status === "AWAITING_HUMAN_APPROVAL" && (
                <button
                  onClick={() => setApprovalModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#ffcc4e] hover:bg-[#e0b23d] text-[#472510] font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 animate-bounce"
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

      {/* Human Approval & Outreach Modal */}
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
