import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES } from "../../lib/constants";
import Modal from "../../components/common/Modal";
import { isSupabaseConfigured } from "../../lib/supabase";
import { GraduationCap, Briefcase, ShieldCheck, Lock, ArrowRight, Loader2, KeyRound } from "lucide-react";

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
    if (!isSupabaseConfigured) {
      addToast("Supabase is not configured. Please contact the administrator.", "error");
      return;
    }
    setLoading(true);
    try {
      await login({ identifier, password, role: selectedRole });
      addToast(`Welcome back to the GLB ${selectedRole.toUpperCase()} Portal!`, "success");
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
      addToast(err.message || "Failed to process password recovery.", "error");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#0C1929] relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="/assets/hero-exact.png"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/hero-bg.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C1929]/90 via-[#0C1929]/70 to-[#0C1929]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-[#E7E1D4] p-8 space-y-6 relative z-10">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-[#0C1929] text-[#E5C378] rounded-2xl flex items-center justify-center font-serif font-black text-xl mx-auto shadow-md">
            GL
          </div>
          <h2 className="text-2xl font-black text-[#0C1929] tracking-tight font-serif">GLB Alumni Connect</h2>
          <p className="text-xs text-[#8C7138] font-bold uppercase tracking-widest">
            "Once GLB, Always GLB."
          </p>
        </div>

        {/* Separate Portal Entry Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#FAF8F5] border border-[#E7E1D4] rounded-2xl">
          <button
            type="button"
            onClick={() => { setSelectedRole(USER_ROLES.STUDENT); setIdentifier(""); }}
            className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              selectedRole === USER_ROLES.STUDENT
                ? "bg-white text-[#8C7138] shadow-xs border border-[#E7E1D4]"
                : "text-[#718096] hover:text-[#0C1929]"
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
                ? "bg-white text-[#0C1929] shadow-xs border border-[#E7E1D4]"
                : "text-[#718096] hover:text-[#0C1929]"
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
                ? "bg-white text-[#0C1929] shadow-xs border border-[#E7E1D4]"
                : "text-[#718096] hover:text-[#0C1929]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Unconfigured Warning */}
        {!isSupabaseConfigured && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold text-center">
            Supabase is not configured. Please contact the administrator.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2B3442] uppercase tracking-wide mb-1">
              {selectedRole === USER_ROLES.ADMIN
                ? "College Admin Email / ID"
                : "College Roll Number / Email"}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-3" />
              <input
                type="text"
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
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>
            {selectedRole !== USER_ROLES.ADMIN && (
              <p className="text-[11px] text-[#718096] mt-1">
                Enter your permanent GL Bajaj Roll Number or registered email.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#2B3442] uppercase tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[11px] font-semibold text-[#8C7138] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0C1929] focus:outline-none focus:ring-2 focus:ring-[#C29B38]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C1929] hover:bg-[#1A2C42] text-[#FAF8F5] font-bold py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
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

        {/* Footer registration links */}
        {selectedRole !== USER_ROLES.ADMIN ? (
          <div className="text-center text-xs text-[#718096] pt-1 border-t border-[#E7E1D4]">
            New member?{" "}
            <Link to={`/register?role=${selectedRole}`} className="text-[#8C7138] font-bold hover:underline">
              Register with your Roll Number
            </Link>
          </div>
        ) : (
          <div className="text-center text-[11px] text-[#718096] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E7E1D4]">
            Public admin registration is restricted. Admin accounts are provisioned directly by the college.
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
          <p className="text-xs text-[#718096]">
            Enter your College Roll Number or registered email address. We will verify your authorized profile and send recovery instructions.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#0C1929] uppercase mb-1">
              Roll Number or Registered Email
            </label>
            <input
              type="text"
              required
              value={forgotInput}
              onChange={(e) => setForgotInput(e.target.value)}
              placeholder="e.g. 230192010055 or student@glbajaj.org"
              className="w-full bg-[#FAF8F5] border border-[#E7E1D4] rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C29B38] font-mono text-[#0C1929]"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#718096] hover:bg-[#FAF8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotLoading}
              className="bg-[#C29B38] hover:bg-[#B57C34] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-md flex items-center space-x-1"
            >
              {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Recovery Link</span>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
