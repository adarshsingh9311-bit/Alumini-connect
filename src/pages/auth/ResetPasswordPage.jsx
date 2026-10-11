import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useToast } from "../../context/ToastContext";
import { COLLEGE_NAME } from "../../lib/constants";
import { Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      addToast("Supabase is not configured. Please contact the administrator.", "error");
      return;
    }

    if (password.length < 6) {
      addToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (password !== confirmPassword) {
      addToast("Passwords do not match. Please re-enter.", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw new Error(error.message || "Failed to update password.");
      }

      setSuccess(true);
      addToast("Your password has been successfully updated! You can now log in.", "success");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      addToast(err.message || "Failed to reset password. The link may have expired.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#D9DDE3] rounded-xl shadow-sm p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 mb-3 group">
            <img
              src="/assets/glb-crest-clean.png"
              alt="GL Bajaj Seal"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/assets/glb-crest.png";
              }}
            />
            <div className="flex flex-col text-left">
              <span className="font-bold text-xl tracking-wide text-[#102235] leading-tight font-serif">
                GL BAJAJ
              </span>
              <span className="text-[10px] font-semibold text-[#D6A34D] uppercase tracking-widest leading-none mt-0.5">
                ALUMNI CONNECT
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-[#D6A34D] font-bold tracking-widest uppercase mt-1 font-serif">
            "Once GLB, Always GLB."
          </p>
          <p className="text-xs text-[#667085] mt-1">
            {COLLEGE_NAME} • Institutional Directory
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-[#2E6B4A]/10 text-[#2E6B4A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#202124]">
              Password Updated Successfully
            </h2>
            <p className="text-xs text-[#667085]">
              Redirecting you to the portal login screen...
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#D6A34D] hover:bg-[#C2933E] text-[#102235] py-2.5 px-4 rounded-lg font-bold text-xs transition"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                New Password <span className="text-[#B42318]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Confirm New Password <span className="text-[#B42318]">*</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#667085] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#102235] focus:ring-1 focus:ring-[#102235]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D6A34D] hover:bg-[#C2933E] text-[#102235] py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-xs disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs text-[#102235] hover:text-[#D6A34D] hover:underline font-bold inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
