import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import EmptyState from "../../components/common/EmptyState";
import { Calendar, MapPin, Clock, CheckCircle2, Loader2, ExternalLink } from "lucide-react";

export default function StudentEventsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setEvents(data);
        }
      } catch (err) {
        console.warn("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0C1929] font-serif">Campus Events & Webinars</h1>
        <p className="text-xs sm:text-sm text-[#718096] mt-1">
          Attend alumni reunions, interactive industry webinars, and departmental advisory sessions.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#C29B38] mb-3" />
          <p className="text-sm">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events available"
          message="No upcoming campus events or webinars are currently scheduled. Please check back later."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-6 border border-[#E7E1D4] shadow-xs hover:border-[#C29B38]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F5] text-[#8C7138] px-2.5 py-1 rounded border border-[#E7E1D4]">
                    {ev.event_type || "Event"}
                  </span>
                  <span className="text-xs font-bold text-[#8C7138]">
                    {ev.date}
                  </span>
                </div>

                <h3 className="font-extrabold text-[#0C1929] text-lg leading-snug font-serif">{ev.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E1D4] text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                    <strong>{ev.date}</strong>
                  </div>
                  {ev.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#0C1929] shrink-0" />
                      <span>{ev.time}</span>
                    </div>
                  )}
                  {ev.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {ev.registration_link ? (
                <a
                  href={ev.registration_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-xs bg-[#0C1929] hover:bg-[#1A2C42] text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Register for Event</span>
                </a>
              ) : (
                <div className="w-full py-2 rounded-xl text-xs text-center text-slate-400 bg-slate-50 border border-slate-100">
                  Open to all GL Bajaj Scholars
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
