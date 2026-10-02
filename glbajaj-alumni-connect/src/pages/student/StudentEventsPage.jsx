import React, { useState } from "react";
import { INITIAL_EVENTS } from "../../lib/mockData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { Calendar, MapPin, Clock, CheckCircle2, Users } from "lucide-react";

export default function StudentEventsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [events, setEvents] = useState(INITIAL_EVENTS);

  function handleRsvp(eventId) {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const userId = user?.id || "user-stu-1";
          const hasRsvp = ev.rsvps?.includes(userId);
          const nextRsvps = hasRsvp
            ? ev.rsvps.filter((id) => id !== userId)
            : [...(ev.rsvps || []), userId];
          addToast(hasRsvp ? `RSVP cancelled for ${ev.title}` : `RSVP confirmed for ${ev.title}! Pass issued.`, "success");
          return { ...ev, rsvps: nextRsvps };
        }
        return ev;
      })
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Campus Events & Webinars</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Attend alumni reunions, interactive industry webinars, and departmental advisory sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => {
          const userId = user?.id || "user-stu-1";
          const isRsvp = ev.rsvps?.includes(userId);

          return (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-6 border border-teal-100 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                    {ev.category}
                  </span>
                  <span className="text-xs font-bold text-glgold">
                    {ev.rsvps?.length || 0} Attending
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-glgold shrink-0" />
                    <strong>{ev.date}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-glblue-750 shrink-0" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleRsvp(ev.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-sm ${
                  isRsvp
                    ? "bg-emerald-600 text-white"
                    : "bg-glgold hover:bg-glgold-dark text-white"
                }`}
              >
                {isRsvp ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RSVP Confirmed • Attendance Pass Issued</span>
                  </>
                ) : (
                  <span>RSVP to Confirm Attendance</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
