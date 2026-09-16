import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { USER_ROLES, BRANCH_CODES, BATCH_YEARS, COLLEGE_NAME } from "../../lib/constants";
import { GraduationCap, Briefcase, UserPlus, ArrowRight, Loader2, ShieldAlert } from "lucide-react";

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

  const [isRecordNotFound, setIsRecordNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.roll_number.trim()) {
      addToast("College Roll Number is required as your primary identity.", "error");
      return;
    }
    setLoading(true);
    try {
      await register(formData, targetRole);
      addToast(
        targetRole === USER_ROLES.STUDENT
          ? "Student account activated successfully!"
          : isRecordNotFound
          ? "Alumni registration submitted! Verification request sent to College Admin."
          : "Alumni account registered & roll-number verified!",
        "success"
      );
      if (targetRole === USER_ROLES.STUDENT) navigate("/student/dashboard");
      else navigate("/alumni/dashboard");
    } catch (err) {
      addToast(err.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <img
          src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-glblue-750/70 to-slate-950"></div>
      </div>

      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-teal-100 p-8 space-y-6 relative z-10">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 bg-glgold text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md">
            GL
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register with Roll Number</h2>
          <p className="text-xs text-glgold font-bold uppercase tracking-widest">
            "Once GLB, Always GLB."
          </p>
          <p className="text-xs text-slate-500">
            {COLLEGE_NAME} • Roll-Number-Based Identity Architecture
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setTargetRole(USER_ROLES.STUDENT)}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              targetRole === USER_ROLES.STUDENT
                ? "bg-white text-glgold shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>I am a Current Student</span>
          </button>

          <button
            type="button"
            onClick={() => setTargetRole(USER_ROLES.ALUMNI)}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              targetRole === USER_ROLES.ALUMNI
                ? "bg-white text-glblue-750 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>I am an Alumnus / Alumna</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                College Roll Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                placeholder="e.g. 220192010001"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={targetRole === USER_ROLES.STUDENT ? "rollno@glbajaj.org" : "you@company.com"}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Account Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Secure password (at least 6 chars)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Branch / Dept
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              >
                {BRANCH_CODES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {targetRole === USER_ROLES.STUDENT ? "Graduation Year" : "Graduated Batch"}
              </label>
              <select
                name="batch_year"
                value={formData.batch_year}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              >
                {BATCH_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
              />
            </div>
          </div>

          {/* Student Fields */}
          {targetRole === USER_ROLES.STUDENT && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Python, Data Structures, Machine Learning"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Career Interests & Target Goals
                </label>
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. Seeking Cloud Backend roles, Preparing for GATE, Open Source"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Alumni Fields */}
          {targetRole === USER_ROLES.ALUMNI && (
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="current_company"
                    value={formData.current_company}
                    onChange={handleChange}
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Current Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="current_designation"
                    value={formData.current_designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Industry / Domain
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Cloud & AI Architecture"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, India"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-glblue-750 focus:outline-none"
                  />
                </div>
              </div>

              {/* Request Verification notice if record mismatch */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-2 text-glgold font-bold text-xs">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Alumni Roster Verification</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  If your Roll Number is not pre-indexed in the college database, submitting this form will automatically flag your profile as "Pending Verification". College Administration will review and approve your GLB Verified Badge.
                </p>
              </div>
            </div>
          )}

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-glgold hover:bg-glgold-dark text-white font-bold py-3 rounded-xl text-sm transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Activate {targetRole === USER_ROLES.STUDENT ? "Student" : "Alumni"} Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already verified?{" "}
          <Link to={`/login?portal=${targetRole}`} className="text-glblue-750 font-bold hover:underline">
            Sign In with Roll Number
          </Link>
        </div>
      </div>
    </div>
  );
}
