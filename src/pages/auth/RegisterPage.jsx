import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES, BRANCH_CODES, BATCH_YEARS, COLLEGE_NAME } from "../../lib/constants";
import { isSupabaseConfigured } from "../../lib/supabase";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  Loader2, 
  ArrowLeft,
  Mail,
  KeyRound,
  Lock,
  User,
  Building,
  MapPin
} from "lucide-react";

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || USER_ROLES.STUDENT;

  const [targetRole, setTargetRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    full_name: "",
    roll_number: "",
    email: "",
    password: "",
    branch: "CSE",
    batch_year: "2024",
    phone: "",
    skills: "",
    interests: "",
    // Alumni specific
    current_company: "",
    current_designation: "",
    industry: "",
    location: "",
    bio: "",
    verification_note: ""
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      addToast("Supabase is not configured. Please contact the administrator.", "error");
      return;
    }
    const cleanEmail = (formData.email || "").trim().toLowerCase();
    if (!cleanEmail.endsWith("@glbitm.ac.in") || cleanEmail.length <= "@glbitm.ac.in".length) {
      addToast("Please use your official @glbitm.ac.in college email.", "error");
      return;
    }
    if (!formData.roll_number.trim()) {
      addToast("College Roll Number is required as your primary identity.", "error");
      return;
    }
    setLoading(true);
    try {
      await register(formData, targetRole);
      addToast(
        targetRole === USER_ROLES.STUDENT
          ? "Student account activated successfully! Welcome to GLB Alumni Connect."
          : "Alumni account registered! Your profile is now set up.",
        "success"
      );
      if (targetRole === USER_ROLES.STUDENT) navigate("/student");
      else navigate("/alumni");
    } catch (err) {
      addToast(err.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3EA] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#D9DDE3] rounded-xl shadow-sm p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#7A1F24] text-white rounded-lg flex items-center justify-center font-bold text-xl mx-auto mb-3 shadow-xs">
            GL
          </div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">
            Create College Account
          </h1>
          <p className="text-xs text-[#B08A3E] font-bold tracking-widest uppercase mt-1">
            "Once GLB, Always GLB."
          </p>
          <p className="text-xs text-[#667085] mt-1">
            {COLLEGE_NAME} • Institutional Directory
          </p>
        </div>

        {/* Role Selector Tabs (Student & Alumni Only - Admin is strictly excluded) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F3EA] border border-[#D9DDE3] rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setTargetRole(USER_ROLES.STUDENT)}
            className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition ${
              targetRole === USER_ROLES.STUDENT
                ? "bg-[#7A1F24] text-[#FFFFFF] shadow-xs"
                : "text-[#202124] hover:bg-[#FFFFFF]/70"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>I am a Current Student</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetRole(USER_ROLES.ALUMNI)}
            className={`py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-2 transition ${
              targetRole === USER_ROLES.ALUMNI
                ? "bg-[#7A1F24] text-[#FFFFFF] shadow-xs"
                : "text-[#202124] hover:bg-[#FFFFFF]/70"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>I am an Alumnus / Alumna</span>
          </button>
        </div>

        {/* Unconfigured Alert */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-[#F7F3EA] border border-[#B08A3E] rounded-lg text-[#202124] text-xs font-medium mb-6">
            Supabase is not configured. Please contact the administrator.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Full Name <span className="text-[#B42318]">*</span>
              </label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                College Roll Number <span className="text-[#B42318]">*</span>
              </label>
              <input
                type="text"
                required
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                placeholder={targetRole === USER_ROLES.STUDENT ? "e.g. 2300001" : "e.g. 2200001"}
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                College Email <span className="text-[#B42318]">*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={targetRole === USER_ROLES.STUDENT ? "student@glbitm.ac.in" : "alumni@glbitm.ac.in"}
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              />
              <p className="text-[11px] text-[#667085] mt-1">
                Use your official @glbitm.ac.in email address.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Account Password <span className="text-[#B42318]">*</span>
              </label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Branch / Dept
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              >
                {BRANCH_CODES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                {targetRole === USER_ROLES.STUDENT ? "Graduation Year" : "Graduated Batch"}
              </label>
              <select
                name="batch_year"
                value={formData.batch_year}
                onChange={handleChange}
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              >
                {BATCH_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
              />
            </div>
          </div>

          {/* Alumni Specific Professional Fields */}
          {targetRole === USER_ROLES.ALUMNI && (
            <div className="pt-2 border-t border-[#D9DDE3] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A1F24]">
                Professional Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Current Company / Organization
                  </label>
                  <input
                    type="text"
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    placeholder="e.g. Tata Consultancy Services"
                    className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Current Designation
                  </label>
                  <input
                    type="text"
                    name="current_designation"
                    value={formData.current_designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-[#FFFFFF] border border-[#D9DDE3] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#202124] placeholder-[#667085]/60 focus:outline-none focus:border-[#7A1F24] focus:ring-1 focus:ring-[#7A1F24]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7A1F24] hover:bg-[#5C171B] text-[#FFFFFF] font-semibold py-2.5 px-4 rounded-lg text-xs sm:text-sm transition flex items-center justify-center space-x-1.5 disabled:opacity-50 shadow-xs cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-6 mt-6 border-t border-[#D9DDE3] flex items-center justify-between text-xs">
          <div className="text-[#667085]">
            Already have an account?{" "}
            <Link to={`/login?role=${targetRole}`} className="text-[#7A1F24] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
          <Link to="/" className="text-[#667085] hover:text-[#202124] flex items-center space-x-1 font-medium transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
