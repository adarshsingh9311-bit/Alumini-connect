import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import Modal from "../../components/common/Modal";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Loader2, 
  KeyRound, 
  HelpCircle,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("portal") || searchParams.get("role") || USER_ROLES.STUDENT;

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Captcha State
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const { login, resetPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Generate random 5-character Captcha
  function generateCaptcha() {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
    setCaptchaError("");
  }

  useEffect(() => {
    generateCaptcha();
  }, [selectedRole]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Verify Captcha
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError("Incorrect security code. Please try again.");
      generateCaptcha();
      return;
    }

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
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotInput.trim()) return;

    setForgotLoading(true);
    try {
      if (resetPassword) {
        await resetPassword(forgotInput.trim());
      }
      setForgotSent(true);
      addToast("Password recovery link has been sent to your registered email.", "success");
    } catch (err) {
      addToast(err.message || "Unable to send recovery instructions. Check your roll number / email.", "error");
    } finally {
      setForgotLoading(false);
    }
  }

  function handleDemoFill(role) {
    setSelectedRole(role);
    setCaptchaError("");
    setCaptchaInput(captchaCode); // Auto-fill captcha for easy testing
    if (role === USER_ROLES.STUDENT) {
      setIdentifier("230192010055");
      setPassword("password123");
    } else if (role === USER_ROLES.ALUMNI) {
      setIdentifier("220192010001");
      setPassword("password123");
    } else {
      setIdentifier("admin@glbajaj.org");
      setPassword("password123");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      {/* Background with GLBITM Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/assets/campus-hero-academic.jpg"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2f1508]/90 via-[#472510]/80 to-[#1e0e05]/95"></div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-[#ffcc4e]/40 p-8 space-y-6 relative z-10">
        
        {/* Brand Crest & Title */}
        <div className="text-center space-y-1.5">
          <img 
            src="/assets/glb-gold-crest.png" 
            alt="GL Bajaj Seal" 
            className="w-16 h-16 object-contain mx-auto drop-shadow-md" 
          />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">GLB Alumni Connect</h2>
          <p className="text-xs text-[#c87e35] font-black uppercase tracking-widest">
            "ONCE GLB, ALWAYS GLB."
          </p>
        </div>

        {/* Portal Entry Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => { setSelectedRole(USER_ROLES.STUDENT); setIdentifier(""); }}
            className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center justify-center gap-1 transition ${
              selectedRole === USER_ROLES.STUDENT
                ? "bg-[#592106] text-[#ffcc4e] shadow-sm font-extrabold"
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
                ? "bg-[#592106] text-[#ffcc4e] shadow-sm font-extrabold"
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
                ? "bg-[#592106] text-[#ffcc4e] shadow-sm font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Roll Number or Admin ID */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              {selectedRole === USER_ROLES.ADMIN
                ? "College Admin Email / ID"
                : "College Roll Number"}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === USER_ROLES.ADMIN
                    ? "Enter admin email or username"
                    : "Enter your college roll number"
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#592106] focus:border-[#592106]"
              />
            </div>
            {selectedRole !== USER_ROLES.ADMIN && (
              <p className="text-[11px] text-slate-400 mt-1">
                Your permanent student/alumni identity issued by GL Bajaj.
              </p>
            )}
          </div>

          {/* Password & Forgot Password Trigger */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(true);
                  setForgotSent(false);
                  setForgotInput(identifier);
                }}
                className="text-[11px] text-[#592106] hover:text-[#472510] hover:underline font-bold transition flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Forgot Password?</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#592106] focus:border-[#592106]"
              />
            </div>
          </div>

          {/* Security Captcha Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Security Verification Code
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                required
                maxLength={6}
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError("");
                }}
                placeholder="Enter code"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#592106] focus:border-[#592106]"
              />

              {/* Styled Captcha Visual Canvas with reload button */}
              <div className="flex items-center bg-[#faf6eb] border-2 border-dashed border-[#ffcc4e] rounded-xl px-3 py-1.5 shadow-inner select-none">
                <span 
                  className="font-mono text-base font-black tracking-widest text-[#592106] line-through decoration-[#c87e35]/60 italic"
                  style={{ letterSpacing: '0.25em' }}
                >
                  {captchaCode}
                </span>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  title="Generate new security code"
                  className="ml-2 text-slate-500 hover:text-[#592106] p-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {captchaError && (
              <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" />
                <span>{captchaError}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg border border-[#ffcc4e]/30 flex items-center justify-center space-x-2 disabled:opacity-40"
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

        {/* Demo Fast Fill Credentials */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
            Instant Demo Credentials
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill(USER_ROLES.STUDENT)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-medium transition"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill(USER_ROLES.ALUMNI)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-medium transition"
            >
              Alumni
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill(USER_ROLES.ADMIN)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg font-medium transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Registration link or policy notice */}
        <div className="text-center text-xs text-slate-500">
          {selectedRole === USER_ROLES.ADMIN ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px] leading-relaxed">
              Public admin registration is closed. Accounts are provisioned directly by college administration.
            </div>
          ) : (
            <p>
              New here?{" "}
              <Link
                to={`/register?role=${selectedRole}`}
                className="text-[#c87e35] font-extrabold hover:underline"
              >
                Register with your Roll Number
              </Link>
            </p>
          )}
        </div>

      </div>

      {/* Interactive Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        {forgotSent ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Reset Instructions Sent</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If an authorized account is linked with <strong className="text-slate-800">{forgotInput}</strong>, a secure password recovery email has been dispatched.
            </p>
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="w-full bg-[#592106] text-[#ffcc4e] font-bold py-2.5 rounded-xl text-xs transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your College Roll Number or registered email address. We will verify your official GL Bajaj profile and send recovery instructions.
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Roll Number or Registered Email
              </label>
              <input
                type="text"
                required
                value={forgotInput}
                onChange={(e) => setForgotInput(e.target.value)}
                placeholder="Enter roll number or email"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#592106] focus:border-[#592106]"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="px-5 py-2 bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow"
              >
                {forgotLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
