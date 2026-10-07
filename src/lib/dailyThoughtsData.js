/**
 * Curated Daily GLB Thoughts for Alumni
 * Categories: Motivation, Career, Learning, Leadership, Gratitude, Alumni & College Connection
 */

export const THOUGHT_CATEGORIES = [
  "Motivation",
  "Career",
  "Learning",
  "Leadership",
  "Gratitude",
  "Alumni & College Connection"
];

export const INITIAL_DAILY_THOUGHTS = [
  {
    id: "thought-1",
    quote: "Every new day is another opportunity to learn, grow and make a difference. Carry the GL Bajaj spirit wherever you lead.",
    author: "GLB Alumni Connect",
    publish_date: "2026-09-17",
    category: "Motivation",
    status: "published",
    featured: true,
    likes_count: 38,
    created_at: "2026-09-15T08:00:00.000Z"
  },
  {
    id: "thought-2",
    quote: "Success in engineering and leadership is not just what you build, but whom you lift along the way.",
    author: "Dean, Alumni Relations",
    publish_date: "2026-09-18",
    category: "Leadership",
    status: "scheduled",
    featured: false,
    likes_count: 24,
    created_at: "2026-09-15T08:00:00.000Z"
  },
  {
    id: "thought-3",
    quote: "Continuous curiosity is the real degree that never expires in the era of artificial intelligence.",
    author: "GLB Academic Advisory",
    publish_date: "2026-09-19",
    category: "Learning",
    status: "scheduled",
    featured: false,
    likes_count: 19,
    created_at: "2026-09-15T08:00:00.000Z"
  },
  {
    id: "thought-4",
    quote: "Your college journey doesn't end at convocation. Every graduate is an ambassador and a mentor for generations to come.",
    author: "GLB Alumni Cell",
    publish_date: "2026-09-20",
    category: "Alumni & College Connection",
    status: "scheduled",
    featured: true,
    likes_count: 42,
    created_at: "2026-09-15T08:00:00.000Z"
  },
  {
    id: "thought-5",
    quote: "Gratitude turns what we have into enough, and opens the door to mentor someone taking their first steps.",
    author: "Alumni Advisory Board",
    publish_date: "2026-09-21",
    category: "Gratitude",
    status: "scheduled",
    featured: false,
    likes_count: 15,
    created_at: "2026-09-15T08:00:00.000Z"
  },
  {
    id: "thought-6",
    quote: "Aim beyond the ordinary. The resilience you forged at GL Bajaj is your quiet superpower in every boardroom and lab.",
    author: "GLB Innovation Council",
    publish_date: "2026-09-22",
    category: "Career",
    status: "scheduled",
    featured: false,
    likes_count: 31,
    created_at: "2026-09-15T08:00:00.000Z"
  }
];

const LOCAL_STORAGE_KEY = "glb_daily_thoughts_store";

export function loadStoredThoughts() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn("Failed to load stored daily thoughts:", e);
  }
  return INITIAL_DAILY_THOUGHTS;
}

export function saveStoredThoughts(thoughts) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(thoughts));
  } catch (e) {
    console.warn("Failed to save daily thoughts:", e);
  }
}

/**
 * Deterministically get the thought for a specific date (defaults to today).
 * Ensures all alumni see the exact same thought on any given day,
 * and page reloads never change the thought.
 */
export function getThoughtForDate(targetDateStr) {
  const allThoughts = loadStoredThoughts();

  const todayStr = targetDateStr || new Date().toISOString().split("T")[0];

  // 1. Check if an explicit thought is scheduled/published for today
  const exactMatch = allThoughts.find((t) => t.publish_date === todayStr);
  if (exactMatch) return exactMatch;

  // 2. Deterministic day-of-year calculation
  const d = new Date(todayStr);
  const startOfYear = new Date(d.getFullYear(), 0, 0);
  const diff = d - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const index = Math.abs(dayOfYear) % allThoughts.length;
  return allThoughts[index] || INITIAL_DAILY_THOUGHTS[0];
}
