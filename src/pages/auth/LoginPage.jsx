import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES, COLLEGE_NAME } from "../../lib/constants";
import Modal from "../../components/common/Modal";
import { isSupabaseConfigured } from "../../lib/supabase";
import { 
  GraduationCap, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Loader2, 
  KeyRound,
  Mail,
  Users,
  Network,
  TrendingUp,
  ArrowLeft
} from "lucide-react";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("portal") || searchParams.get("role") || USER_ROLES.STUDENT;

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Unconfirmed email state
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(null);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [loginResendCooldown, setLoginResendCooldown] = useState(0);

  const { login, resetPassword, resendConfirmationEmail } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isVerifiedParam = searchParams.get("verified") === "true";

  React.useEffect(() => {
    const urlRole = searchParams.get("portal") || searchParams.get("role");
    if (urlRole && (urlRole === USER_ROLES.STUDENT || urlRole === USER_ROLES.ALUMNI || urlRole === USER_ROLES.ADMIN)) {
      setSelectedRole(urlRole);
    }
  }, [searchParams]);

  React.useEffect(() => {
    let timer = null;
    if (loginResendCooldown > 0) {
      timer = setTimeout(() => {
        setLoginResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [loginResendCooldown]);

  function handleRoleChange(newRole) {
    setSelectedRole(newRole);
    setEmail("");
    setRollNumber("");
    setPassword("");
    setUnconfirmedEmail(null);
  }

  async function handleResendVerification() {
    if (!unconfirmedEmail || loginResendCooldown > 0 || resendingVerification) return;
    setResendingVerification(true);
    try {
      await resendConfirmationEmail(unconfirmedEmail);
      setLoginResendCooldown(60);
      addToast(`Verification email has been re-dispatched to ${unconfirmedEmail}. Please check your inbox.`, "success");
    } catch (err) {
      addToast(err.message || "Failed to resend verification email.", "error");
    } finally {
      setResendingVerification(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      addToast("Supabase is not configured. Please contact the administrator.", "error");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith("@glbitm.ac.in") || cleanEmail.length <= "@glbitm.ac.in".length) {
      addToast("Please use your official @glbitm.ac.in college email.", "error");
      return;
    }

    if (selectedRole !== USER_ROLES.ADMIN && !rollNumber.trim()) {
      addToast("College Roll Number is required for login.", "error");
      return;
    }

    setLoading(true);
    try {
      await login({
        email: cleanEmail,
        rollNumber: rollNumber.trim(),
        password,
        role: selectedRole,
      });

      addToast(`Welcome back to the GLB ${selectedRole.toUpperCase()} Portal!`, "success");
      if (selectedRole === USER_ROLES.STUDENT) navigate("/student");
      else if (selectedRole === USER_ROLES.ALUMNI) navigate("/alumni");
      else if (selectedRole === USER_ROLES.ADMIN) navigate("/admin");
      else navigate("/");
    } catch (err) {
      if (err.message?.toLowerCase().includes("not been verified")) {
        setUnconfirmedEmail(cleanEmail);
      }
      addToast(err.message || "Invalid login credentials.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith("@glbitm.ac.in") || cleanEmail.length <= "@glbitm.ac.in".length) {
      addToast("Please use your official @glbitm.ac.in college email.", "error");
      return;
    }

    setForgotLoading(true);
    try {
      await resetPassword(cleanEmail);
      addToast(`Password recovery link has been dispatched to ${cleanEmail}.`, "success");
      setForgotModalOpen(false);
      setForgotEmail("");
    } catch (err) {
      addToast(err.message || "Failed to process password recovery.", "error");
    } finally {
      setForgotLoading(false);
    }
  }

  const roleMeta = {
    [USER_ROLES.STUDENT]: {
      title: "Student Login",
      subtitle: "Welcome back! Please login with your college credentials.",
      registerText: "Register as Student",
      registerLink: "/register?role=student",
      rollLabel: "College Roll Number",
      rollPlaceholder: "e.g. 2300001",
      emailPlaceholder: "student@glbitm.ac.in"
    },
    [USER_ROLES.ALUMNI]: {
      title: "Alumni Login",
      subtitle: "Welcome back to GL Bajaj! Please login with your registered credentials.",
      registerText: "Register as Alumni",
      registerLink: "/register?role=alumni",
      rollLabel: "Roll Number or Alumni ID",
      rollPlaceholder: "e.g. 2200001",
      emailPlaceholder: "alumni@glbitm.ac.in"
    },
    [USER_ROLES.ADMIN]: {
      title: "Admin Login",
      subtitle: "Authorized GL Bajaj administration access.",
      registerText: null,
      registerLink: null,
      rollLabel: null,
      rollPlaceholder: null,
      emailPlaceholder: "admin@glbitm.ac.in"
    }
  }[selectedRole] || {
    title: "Portal Login",
    subtitle: "Please login with your official credentials.",
    registerText: "Register account",
    registerLink: "/register",
    rollLabel: "Roll Number",
    rollPlaceholder: "e.g. 2300001",
    emailPlaceholder: "user@glbitm.ac.in"
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Container - Two Column Academic Card */}
      <div className="w-full max-w-5xl bg-[#FFFFFF] border border-[#D9DDE3] rounded-xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* LEFT COLUMN: Academic Identity & Visual Context */}
        <div className="lg:col-span-5 bg-[#F7F5F0] p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#D9DDE3] flex flex-col justify-between">
          <div>
            {/* College Crest & Name */}
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/assets/glb-crest-clean.png"
                alt="GL Bajaj Seal"
                className="w-11 h-11 object-contain shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/glb-crest.png";
                }}
              />
              <div className="flex flex-col justify-center">
                <span className="font-bold text-lg tracking-wide text-[#102235] leading-tight font-serif">
                  GL BAJAJ
                </span>
                <span className="text-[10px] font-semibold text-[#D6A34D] uppercase tracking-widest leading-none mt-0.5">
                  ALUMNI CONNECT
                </span>
              </div>
            </div>

            {/* Academic Motto */}
            <div className="inline-block px-3 py-1 bg-[#FFFFFF] border border-[#D9DDE3] rounded-md text-[11px] font-bold text-[#D6A34D] tracking-widest uppercase mb-4 font-serif">
              "Once GLB, Always GLB."
            </div>

            <p className="text-sm text-[#202124] leading-relaxed mb-6 font-medium">
              A platform to connect, mentor and grow together.
            </p>

            {/* Real Campus Image */}
            <div className="rounded-lg border border-[#D9DDE3] overflow-hidden mb-6 bg-[#FFFFFF]">
              <img
                src="/assets/hero-exact.png"
                alt="GL Bajaj Campus"
                className="w-full h-36 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/hero-bg.png";
                }}
              />
            </div>

            {/* Institutional Highlights with Simple Line Icons */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-xs text-[#202124]">
                <div className="w-7 h-7 rounded-md bg-[#FFFFFF] border border-[#D9DDE3] flex items-center justify-center text-[#102235] shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>One-on-one alumni mentorship & advice</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-[#202124]">
                <div className="w-7 h-7 rounded-md bg-[#FFFFFF] border border-[#D9DDE3] flex items-center justify-center text-[#102235] shrink-0">
                  <Network className="w-3.5 h-3.5" />
                </div>
                <span>Verified GL Bajaj graduate directory</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-[#202124]">
                <div className="w-7 h-7 rounded-md bg-[#FFFFFF] border border-[#D9DDE3] flex items-center justify-center text-[#102235] shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <span>Career opportunities & campus events</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#D9DDE3] text-[11px] text-[#667085]">
            {COLLEGE_NAME}
          </div>
        </div>

        {/* RIGHT COLUMN: Institutional Login Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F7F5F0] border border-[#D9DDE3] rounded-lg mb-8">
              <button
                type="button"
                onClick={() => handleRoleChange(USER_ROLES.STUDENT)}
                className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                  selectedRole === USER_ROLES.STUDENT
                    ? "bg-[#102235] text-[#FFFFFF] shadow-sm"
                    : "text-[#202124] hover:bg-[#FFFFFF]/70"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange(USER_ROLES.ALUMNI)}
                className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                  selectedRole === USER_ROLES.ALUMNI
                    ? "bg-[#102235] text-[#FFFFFF] shadow-sm"
                    : "text-[#202124] hover:bg-[#FFFFFF]/70"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Alumni</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange(USER_ROLES.ADMIN)}
                className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition ${
                  selectedRole === USER_ROLES.ADMIN
                    ? "bg-[#102235] text-[#FFFFFF] shadow-sm"
                    : "text-[#202124] hover:bg-[#FFFFFF]/70"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

            {/* Unconfigured Alert */}
            {!isSupabaseConfigured && (
              <div className="p-3 bg-[#F7F5F0] border border-[#D6A34D] rounded-lg text-[#202124] text-xs font-medium mb-6">
                Supabase is not configured. Please contact the administrator.
              </div>
            )}

            {/* Email Verified Success Banner */}
            {isVerifiedParam && (
              <div className="p-3 bg-[#2E6B4A]/10 border border-[#2E6B4A]/30 rounded-lg text-[#2E6B4A] text-xs font-medium mb-6 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#2E6B4A]" />
                <span>Your college email has been verified successfully. Please log in with your credentials below.</span>
              </div>
            )}

            {/* Email Unconfirmed Action Box */}
            {unconfirmedEmail && (
              <div className="p-4 bg-[#A66A00]/10 border border-[#A66A00]/30 rounded-lg text-[#202124] text-xs font-medium mb-6 space-y-2">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-[#A66A00]" />
                  <div className="space-y-1">
                    <p className="font-bold text-[#A66A00]">Email Verification Required</p>
                    <p className="text-[#667085]">
                      A confirmation link was dispatched to <strong className="text-[#202124]">{unconfirmedEmail}</strong>. Please verify your email before logging in.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingVerification || loginResendCooldown > 0}
                  className="text-xs font-bold text-[#102235] hover:underline inline-flex items-center gap-1.5 pt-1 disabled:opacity-50 disabled:no-underline"
                >
                  {resendingVerification ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  <span>
                    {loginResendCooldown > 0
                      ? `Resend verification email (wait ${loginResendCooldown}s)`
                      : "Resend verification email to this address"}
                  </span>
                </button>
              </div>
            )}

            {/* Card Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#202124] tracking-tight">
                {roleMeta.title}
              </h2>
              <p className="text-xs text-[#667085] mt-1">
                {roleMeta.subtitle}
              </p>
            </div>

            {/* The Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* College Email Field */}
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1">
                  {selectedRole === USER_ROLES.ADMIN ? "Official Admin Email" : "College Email"} <span className="text-[#B42318]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={roleMeta.emailPlaceholder}
                    className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
                  />
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  Use your official @glbitm.ac.in email address.
                </p>
              </div>

              {/* Roll Number Field (Student and Alumni only) */}
              {selectedRole !== USER_ROLES.ADMIN && (
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    {roleMeta.rollLabel} <span className="text-[#B42318]">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder={roleMeta.rollPlaceholder}
                      className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm font-mono text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#202124]">
                    Password <span className="text-[#B42318]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-[11px] font-semibold text-[#102235] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D6A34D] hover:bg-[#C2933E] text-[#102235] font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 disabled:opacity-50 mt-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Secondary Links */}
          <div className="pt-6 mt-6 border-t border-[#D9DDE3] flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            {roleMeta.registerText ? (
              <div className="text-[#667085]">
                Don't have an account?{" "}
                <Link
                  to={roleMeta.registerLink}
                  className="text-[#102235] font-bold hover:text-[#D6A34D] hover:underline"
                >
                  {roleMeta.registerText}
                </Link>
              </div>
            ) : (
              <div className="text-[#667085] text-[11px]">
                Authorized GL Bajaj administration access.
              </div>
            )}

            <Link
              to="/"
              className="text-[#667085] hover:text-[#202124] flex items-center space-x-1 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Account Password"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-[#667085]">
            Enter your official GL Bajaj college email address. A recovery link will be sent to your inbox.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[#202124] mb-1">
              Official College Email
            </label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="e.g. adarsh@glbitm.ac.in"
              className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
            />
            <p className="text-[11px] text-[#667085] mt-1">
              Use your official @glbitm.ac.in email address.
            </p>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setForgotModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#667085] hover:bg-[#F7F5F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={forgotLoading}
              className="bg-[#102235] hover:bg-[#0B1724] text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              {forgotLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Send Recovery Link</span>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
