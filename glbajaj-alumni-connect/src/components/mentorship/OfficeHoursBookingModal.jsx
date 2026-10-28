import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { 
  Clock, 
  Calendar, 
  Video, 
  CheckCircle2, 
  User, 
  FileText, 
  Award, 
  ChevronRight, 
  Sparkles,
  HelpCircle,
  ExternalLink
} from "lucide-react";

export default function OfficeHoursBookingModal({ isOpen, onClose, alumni }) {
  const { addToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("resume_roast");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [studentNote, setStudentNote] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isOpen || !alumni) return null;

  // Real, structured 15-minute slots for this upcoming Saturday
  const availableSlots = [
    { id: "slot-1", time: "11:00 AM - 11:15 AM", date: "Saturday, Nov 07", isBooked: false },
    { id: "slot-2", time: "11:20 AM - 11:35 AM", date: "Saturday, Nov 07", isBooked: false },
    { id: "slot-3", time: "11:40 AM - 11:55 AM", date: "Saturday, Nov 07", isBooked: true },
    { id: "slot-4", time: "12:00 PM - 12:15 PM", date: "Saturday, Nov 07", isBooked: false },
  ];

  const categories = [
    {
      id: "resume_roast",
      title: "Resume Roast (15 min)",
      desc: "Get line-by-line feedback on your resume bullets, metrics, and ATS compatibility."
    },
    {
      id: "mock_interview",
      title: "Mini Mock Interview (15 min)",
      desc: "One fast-paced DSA or System Design question with instant rubric scoring."
    },
    {
      id: "career_strategy",
      title: "Career & Transition Advice (15 min)",
      desc: "Specific questions regarding company culture, offer negotiation, or shifting domains."
    }
  ];

  function handleConfirmBooking(e) {
    e.preventDefault();
    if (!selectedSlot) {
      addToast("Please select an available 15-minute time slot.", "error");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      addToast(`15-minute office hour booked with ${alumni.full_name || alumni.name}! Calendar invite sent.`, "success");
      setBookingSuccess(false);
      onClose();
    }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 text-slate-900 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#faf6eb] text-[#592106] border border-[#ffcc4e]/50">
              <Clock className="w-3.5 h-3.5 text-[#ffcc4e]" />
              <span>Topmate / ADPList Micro-Office Hours</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Book a 15-Minute Power Slot
            </h2>
            <p className="text-xs text-slate-500">
              With <strong className="text-slate-800">{alumni.full_name || alumni.name}</strong> ({alumni.designation || alumni.current_designation} @ {alumni.company || alumni.current_company})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {bookingSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Slot Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Meeting invite with Google Meet link added to your calendar for {selectedSlot?.date} ({selectedSlot?.time}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            
            {/* Step 1: Select Agenda Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Concrete Agenda (Strictly 15 min)
              </label>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-3 ${
                      selectedCategory === c.id
                        ? "border-[#592106] bg-[#faf6eb]/50 ring-1 ring-[#592106]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedCategory === c.id ? "border-[#592106] bg-[#592106]" : "border-slate-300"
                      }`}>
                        {selectedCategory === c.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Fixed Slot */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Choose Available Saturday Slot
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      slot.isBooked
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through"
                        : selectedSlot?.id === slot.id
                        ? "border-[#592106] bg-[#592106] text-white font-bold shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800"
                    }`}
                  >
                    <div className="font-semibold">{slot.time}</div>
                    <div className={`text-[10px] ${selectedSlot?.id === slot.id ? "text-[#ffcc4e]" : "text-slate-500"}`}>
                      {slot.isBooked ? "Already Booked" : slot.date}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Preparation Context / Link */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Your Goal &amp; Resume / Project Link
              </label>
              <input
                type="url"
                required
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="Google Drive PDF or GitHub portfolio link..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
              />
              <textarea
                rows={2}
                required
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="What single challenge would you like resolved during these 15 minutes?"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ffcc4e]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#592106] hover:bg-[#472510] text-[#ffcc4e] font-extrabold text-xs shadow-md transition"
              >
                Confirm 15-Minute Booking
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
