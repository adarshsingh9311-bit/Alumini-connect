
const INDUSTRY_DOMAINS = [
  "Software Engineering & Cloud Computing",
  "Artificial Intelligence & Machine Learning",
  "Data Science & Analytics",
  "Cybersecurity & Information Defense",
  "Product Management & Strategy",
  "Semiconductors & Embedded Systems",
  "Finance & FinTech",
  "E-Commerce & Digital Supply Chain",
  "Consulting & Business Strategy",
  "Healthcare & HealthTech",
  "Automotive & Electric Mobility",
  "Aerospace & Defense Technology",
  "Education & EdTech",
  "Public Sector & Civil Services",
  "Other"
];
import React, { useState } from "react";
import {
  Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  useAuth } from "../../context/AuthContext";
import {
  useToast } from "../../context/ToastContext";
import {
  USER_ROLES, BRANCH_CODES, BATCH_YEARS, COLLEGE_NAME } from "../../lib/constants";
import {
  MapPin,
  Award,
  CheckSquare, GraduationCap, Briefcase, UserPlus, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") || USER_ROLES.STUDENT;
  const [targetRole, setTargetRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    full_name: "",
    roll_number: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "CSE",
    batch_year: "2024",
    phone: "",
    skills: "",
    interests: "",
    linkedin_url: "",
    github_url: "",
    other_profile_url: "",
    // Alumni specific
    current_company: "",
    current_designation: "",
    industry: "",
    location: "",
    bio: "",
    verification_note: "",
    // Additional Alumni Professional Info
    experience_years: "1-3 Years",
    is_available_for_mentorship: true
  });
  const [cvFile, setCvFile] = useState(null);
  const [cvFileName, setCvFileName] = useState("");

  function handleCvUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("CV file size exceeds 5MB limit. Please upload a smaller PDF/DOCX file.", "error");
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setFormData((prev) => ({ ...prev, resume_name: file.name }));
      addToast(`CV "${file.name}" attached successfully!`, "success");
    }
  }
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [selectedIndustryOption, setSelectedIndustryOption] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");

  function handleDetectLiveLocation() {
    if (!navigator.geolocation) {
      addToast("Geolocation is not supported by your browser.", "error");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.county || "";
          const state = data.address?.state || "";
          const country = data.address?.country || "";
          const locStr = [city, state, country].filter(Boolean).join(", ");
          setFormData((prev) => ({ ...prev, location: locStr || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          addToast("Live location detected successfully!", "success");
        } catch {
          setFormData((prev) => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          addToast("Coordinates captured successfully!", "success");
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        addToast("Location permission denied or unavailable.", "error");
        setDetectingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match. Please re-enter your password correctly.", "error");
      return;
    }

    if (formData.password.length < 6) {
      addToast("Password must be at least 6 characters long.", "error");
      return;
    }
    if (!formData.roll_number.trim()) {
      addToast("College Roll Number is required as your primary identity.", "error");
      return;
    }

    if (!formData.branch) {
      addToast("Please select your Branch / Department.", "error");
      return;
    }

    if (!formData.batch_year) {
      addToast("Please select your Graduation Year / Batch.", "error");
      return;
    }

    if (!formData.phone || formData.phone.trim().length < 10) {
      addToast("A valid 10-digit Phone Number is mandatory.", "error");
      return;
    }

    if (targetRole === USER_ROLES.STUDENT) {
      if (!cvFileName) {
        addToast("Uploading your CV / Resume is mandatory for student registration.", "error");
        return;
      }
      if (!formData.linkedin_url || !formData.linkedin_url.trim()) {
        addToast("LinkedIn Profile URL is mandatory for student verification.", "error");
        return;
      }
      if (!formData.github_url || !formData.github_url.trim()) {
        addToast("GitHub Profile URL is mandatory for student verification.", "error");
        return;
      }
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/assets/campus-hero-academic.jpg"
          alt="GL Bajaj Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2f1508]/90 via-[#472510]/80 to-[#1e0e05]/95"></div>
      </div>
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-[#ffcc4e]/40 p-8 space-y-6 relative z-10">
        <div className="text-center space-y-1.5">
          <img src="/assets/glb-gold-crest.png" alt="GL Bajaj Seal" className="w-16 h-16 object-contain mx-auto drop-shadow-md" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            G.L. Bajaj Institute of Technology & Management
          </h2>
          <p className="text-xs font-bold text-[#592106] tracking-wider uppercase">
            Alumni & Student Network Registration
          </p>
          <p className="text-xs text-[#c87e35] font-black uppercase tracking-widest">
            "Once GLB, Always GLB."
          </p>
          
        </div>
        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setTargetRole(USER_ROLES.STUDENT)}
            className={`py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              targetRole === USER_ROLES.STUDENT
                ? "bg-[#592106] text-[#ffcc4e] shadow-sm font-extrabold"
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
                ? "bg-[#592106] text-[#ffcc4e] shadow-sm font-extrabold"
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
                placeholder="Enter your full name"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
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
                placeholder="Enter college roll number"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm font-mono focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Create password (min 6 characters)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Retype Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Retype password to confirm"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? "border-red-400 focus:ring-red-400"
                      : "border-slate-300"
                  }`}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-[10px] text-red-600 font-semibold mt-1">Passwords do not match</p>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Branch / Dept <span className="text-red-500">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
              >
                {BRANCH_CODES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {targetRole === USER_ROLES.STUDENT ? "Graduation Year" : "Graduated Batch"} <span className="text-red-500">*</span>
              </label>
              <select
                name="batch_year"
                value={formData.batch_year}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
              >
                {BATCH_YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
              />
            </div>
          </div>
          {/* Student Fields */}
          {targetRole === USER_ROLES.STUDENT && (
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Technical Skills
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter skills separated by commas"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Career Interests & Goals
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="Describe your target career goals"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>
              </div>

              {/* Student Mandatory CV Upload Card */}
              <div className="p-4 rounded-2xl bg-[#faf6eb] border-2 border-dashed border-[#ffcc4e] space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <label className="text-xs font-black text-[#592106] uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#592106]" />
                      <span>Student Curriculum Vitae (CV / Resume)</span>
                      <span className="text-red-500 font-black text-sm">* (Mandatory)</span>
                    </label>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Alumni mentors verify academic progress and technical background via your resume (PDF/DOCX, max 5MB).
                    </p>
                  </div>
                  {cvFileName ? (
                    <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Attached</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      <AlertCircle className="w-3 h-3 text-red-600" />
                      <span>Mandatory</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <label className="w-full sm:w-auto cursor-pointer bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center justify-center space-x-2">
                    <Upload className="w-3.5 h-3.5 text-[#ffcc4e]" />
                    <span>Choose File (PDF/DOCX)</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="text-xs font-mono text-slate-700 bg-white px-3 py-2 rounded-xl border border-slate-200 flex-1 truncate w-full sm:w-auto">
                    {cvFileName ? `Attached: ${cvFileName}` : "No file attached yet. Uploading a CV is required."}
                  </div>
                </div>
              </div>

              {/* Student Social & Professional Profiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    LinkedIn Profile URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    name="linkedin_url"
                    value={formData.linkedin_url || ""}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    GitHub Profile URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    name="github_url"
                    value={formData.github_url || ""}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Portfolio / Other Link
                  </label>
                  <input
                    type="url"
                    name="other_profile_url"
                    value={formData.other_profile_url || ""}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.dev"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>
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
                    placeholder="Enter current organization name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
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
                    placeholder="Enter your professional job title"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] focus:border-[#592106] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Industry / Domain
                  </label>
                  <select
                    value={selectedIndustryOption}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedIndustryOption(val);
                      if (val !== "Other") {
                        setFormData((prev) => ({ ...prev, industry: val }));
                      } else {
                        setFormData((prev) => ({ ...prev, industry: customIndustry }));
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] mb-2"
                  >
                    <option value="">Select your industry domain...</option>
                    {INDUSTRY_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>

                  {selectedIndustryOption === "Other" && (
                    <input
                      type="text"
                      name="industry"
                      value={customIndustry}
                      onChange={(e) => {
                        setCustomIndustry(e.target.value);
                        setFormData((prev) => ({ ...prev, industry: e.target.value }));
                      }}
                      placeholder="Specify your industry / domain manually"
                      className="w-full bg-white border-2 border-[#ffcc4e] rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106] animate-in fade-in duration-200"
                      autoFocus
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Location / City
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLiveLocation}
                      disabled={detectingLocation}
                      className="text-[11px] font-bold text-[#592106] hover:text-[#472510] flex items-center space-x-1 transition disabled:opacity-50"
                    >
                      <MapPin className={`w-3.5 h-3.5 text-[#c87e35] ${detectingLocation ? "animate-pulse" : ""}`} />
                      <span>{detectingLocation ? "Detecting GPS..." : "Add Live Location"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter city or click Add Live Location"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#592106]"
                  />
                </div>
              </div>
              {/* Request Verification notice if record mismatch */}
              <div className="bg-[#faf6eb]/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center space-x-2 text-[#592106] font-bold text-xs">
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
              className="w-full bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold py-3.5 rounded-xl text-sm transition shadow-lg border border-[#ffcc4e]/30 flex items-center justify-center space-x-2 disabled:opacity-40"
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
          <Link to={`/login?portal=${targetRole}`} className="text-[#592106] font-bold hover:underline">
            Sign In with Roll Number
          </Link>
        </div>
      </div>
    </div>
  );
}
