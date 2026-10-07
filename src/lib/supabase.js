import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// Standardize to VITE_SUPABASE_PUBLISHABLE_KEY, supporting VITE_SUPABASE_ANON_KEY as fallback
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_KEY;

export const SUPABASE_CONFIG_MESSAGE = "Supabase is not configured. Please contact the administrator.";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.trim() !== "" &&
  supabasePublishableKey.trim() !== "" &&
  !supabaseUrl.includes("your-project-ref") &&
  !supabaseUrl.includes("placeholder")
);

// If configuration is valid, create client with actual credentials.
// Otherwise, create a placeholder client so imports do not crash module evaluation,
// while letting the UI gracefully validate configuration and notify the user.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient("https://placeholder.supabase.co", "placeholder-key", {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
