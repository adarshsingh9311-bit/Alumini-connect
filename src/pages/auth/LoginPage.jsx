import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import Modal from "../../components/common/Modal";
import { GraduationCap, Briefcase, ShieldCheck, Lock, ArrowRight, Loader2, KeyRound, HelpCircle } from "lucide-react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("portal") || searchParams.get("role") || USER_ROLES.STUDENT;

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, resetPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ identifier, password, role: selectedRole });
      addToast(`Welcome to the GLB ${selectedRole.toUpperCase()} Portal!`, "success");
      if (selectedRole === USER_ROLES.STUDENT) navigate("/student/dashboard");
      else if (selectedRole === USER_ROLES.ALUMNI) navigate("/alumni/dashboard");
      else if (selectedRole === USER_ROLES.ADMIN) navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      addToast(err.message || "Invalid credentials. Please verify your Roll Number/Password.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotInput.trim()) return;
    setForgotLoading(true);
    try {
      await resetPassword(forgotInput);
      addToast(`Password recovery link has been dispatched for ${forgotInput}.`, "success");
      setForgotModalOpen(false);
      setForgotInput("");
    } catch (err) {
      addToast("Failed to process password recovery.", "error");
    } finally {
      setForgotLoading(false);
    }
  }

  function handleQuickDemo(roleType) {
    setSelectedRole(roleType);
    if (roleType === USER_ROLES.STUDENT) {
      setIdentifier("230192010055");
      setPassword("password123");
    } else if (roleType === USER_ROLES.ALUMNI) {
      setIdentifier("220192010001");
      setPassword("password123");
    } else {
      setIdentifier("admin@glbajaj.org");
      setPassword("password123");
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-glblue-750/70 to-slate-950"></div>
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-teal-100 p-8 space-y-6 relative z-10">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-glgold text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md">
            GL
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">GLB Alumni Connect</h2>
          <p className="text-xs text-glgold font-bold uppercase tracking-widest">
            "Once GLB, Always GLB."
          </p>
        </div>

        {/* Separate Portal Entry Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => { setSelectedRole(USER_ROLES.STUDENT); setIdentifier(""); }}
            className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              selectedRole === USER_ROLES.STUDENT
                ? "bg-white text-glgold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole(USER_ROLES.ALUMNI); setIdentifier(""); }}
            className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              selectedRole === USER_ROLES.ALUMNI
                ? "bg-white text-glblue-750 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Alumni</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedRole(USER_ROLES.ADMIN); setIdentifier(""); }}
            className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              selectedRole === USER_ROLES.ADMIN
                ? "bg-white text-teal-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              {selectedRole === USER_ROLES.ADMIN
                ? "College Admin Email / ID"
                : "College Roll Number"}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={selectedRole === USER_ROLES.ADMIN ? "text" : "text"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === USER_ROLES.ADMIN
                    ? "admin@glbajaj.org"
                    : selectedRole === USER_ROLES.STUDENT
                    ? "e.g. 230192010055"
                    : "e.g. 220192010001"
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-glblue-750"
              />
            </div>
            {selectedRole !== USER_ROLES.ADMIN && (
              <p className="text-[11px] text-slate-400 mt-1">
                Your permanent student/alumni identity issued by GL Bajaj.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] font-semibold text-glblue-750 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-glblue-750 hover:bg-teal-900 text-white font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
            Instant Demo Credentials
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo(USER_ROLES.STUDENT)}
              className="text-[11px] bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-glgold font-bold px-2.5 py-1 rounded-lg border border-slate-200"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(USER_ROLES.ALUMNI)}
              className="text-[11px] bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-glblue-750 font-bold px-2.5 py-1 rounded-lg border border-slate-200"
            >
              Alumni
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo(USER_ROLES.ADMIN)}
              className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg border border-slate-200"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Footer registration links */}
        {selectedRole !== USER_ROLES.ADMIN ? (
          <div className="text-center text-xs text-slate-500 pt-1">
            New here?{" "}
            <Link to={`/register?role=${selectedRole}`} className="text-glgold font-bold hover:underline">
              Register with your Roll Number
            </Link>
          </div>
        ) : (
          <div className="text-center text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            Public admin registration is closed. Accounts are provisioned by college administration.
          </div>
        )}
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Enter your College Roll Number or registered email address. We will verify your authorized profile and send recovery instructions.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Roll Number or Registered Email
            </label>
            <input
              type="text"
              required
              value={forgotInput}
              onChange={(e) => setForgotInput(e.target.value)}
              placeholder="e.g. 230192010055 or student@glbajaj.org"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-glblue-750 font-mono"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotLoading}
              className="bg-glgold hover:bg-glgold-dark text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1"
            >
              {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Recovery Link</span>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
