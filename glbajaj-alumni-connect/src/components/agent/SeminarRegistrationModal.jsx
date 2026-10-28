import React, { useState } from "react";
import { X, CheckCircle2, User, Mail, Phone, GraduationCap, Building2, Sparkles, AlertCircle } from "lucide-react";
import { registerStudentForSeminarWorkflow } from "../../lib/agentService";
import { useToast } from "../../context/ToastContext";

export default function SeminarRegistrationModal({ isOpen, onClose, seminar, onRegistered }) {
  const { addToast } = useToast();
  const [name, setName] = useState("Tanmay Singhal");
  const [age, setAge] = useState("21");
  const [year, setYear] = useState("3rd Year");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [email, setEmail] = useState("tanmay.s@glbajaj.ac.in");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !seminar) return null;

  const isFull = seminar.booked_slots >= seminar.total_slots;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isFull) {
      addToast("Sorry, this seminar has reached full capacity!", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const studentData = {
        name,
        age: Number(age),
        year,
        branch,
        mobile,
        college_email: email
      };
      const response = await registerStudentForSeminarWorkflow(seminar.id, studentData);
      setResult(response);
      addToast("Seat slot reserved! Confirmation packet dispatched to college email.", "success");
      if (onRegistered) {
        onRegistered(response);
      }
    } catch (err) {
      console.error(err);
      addToast("Registration failed. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/60">
            <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
            <span>Autonomous Registration Broker</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {result ? (
          /* Confirmation Success View */
          <div className="py-6 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Seat Successfully Reserved!</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                The agent has verified your academic credentials and locked in your slot for:
              </p>
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1">
                <p className="font-bold text-slate-900">{seminar.title}</p>
                <p className="text-slate-500">Speaker: {seminar.speaker_name} ({seminar.speaker_company})</p>
                <p className="text-[#592106] font-semibold">Time: {seminar.date} • {seminar.time_slot}</p>
              </div>
            </div>

            {/* Stage Alerts Queued */}
            <div className="bg-[#faf6eb] border border-[#ffcc4e]/50 p-3.5 rounded-2xl text-left text-xs space-y-1.5">
              <span className="font-bold text-[#592106] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ffcc4e]" />
                <span>3-Stage Omnichannel Alerts Queued:</span>
              </span>
              <ul className="text-slate-700 list-disc list-inside space-y-1 pl-1">
                <li><span className="font-semibold text-emerald-700">T_0:</span> Instant confirmation + .ics calendar invitation dispatched.</li>
                <li><span className="font-semibold text-blue-700">T-24h:</span> Pre-reading material &amp; syllabus primer scheduled.</li>
                <li><span className="font-semibold text-amber-700">T-1h:</span> High-priority direct Meet room launch link queued.</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl font-bold bg-[#592106] text-white hover:bg-[#431804] transition shadow-md"
            >
              Back to Seminar Hub
            </button>
          </div>
        ) : (
          /* Input Registration Form */
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Student Seat Reservation</h3>
              <p className="text-xs text-slate-500">
                Registering for: <span className="font-bold text-[#592106]">{seminar.title}</span>
              </p>
            </div>

            {isFull && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Capacity reached (50/50). Registrations are currently closed.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Student Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="40"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Year</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  >
                    <option value="1st Year">1st Year B.Tech</option>
                    <option value="2nd Year">2nd Year B.Tech</option>
                    <option value="3rd Year">3rd Year B.Tech</option>
                    <option value="4th Year">4th Year B.Tech</option>
                    <option value="MCA / Postgrad">MCA / Postgrad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch / Specialization</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile (WhatsApp Alert)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official College Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@glbajaj.ac.in"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#592106] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isFull}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#592106] text-white hover:bg-[#431804] disabled:opacity-50 transition shadow-md flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <span>Claim My Seat Slot</span>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}