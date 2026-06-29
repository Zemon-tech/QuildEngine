import { createClient } from "@supabase/supabase-js";

const getSupabaseUrl = (): string => {
  if (typeof window !== "undefined" && (window as any).__SUPABASE_URL__) {
    return (window as any).__SUPABASE_URL__;
  }
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://pzodkdliplhtpoopzcns.supabase.co"
  );
};

const getSupabasePublishableKey = (): string => {
  if (typeof window !== "undefined" && (window as any).__SUPABASE_PUBLISHABLE_KEY__) {
    return (window as any).__SUPABASE_PUBLISHABLE_KEY__;
  }
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    "sb_publishable_NIT6OKUinNG8eHik-8C2Ow_ucmbGuxH"
  );
};

/**
 * Lazy/safe initialization helper for admin-side Supabase client.
 */
export function getSupabase() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url || !key) {
    return createClient("https://placeholder.supabase.co", "sb_publishable_placeholder", {
      auth: {
        persistSession: false,
      },
    });
  }

  return createClient(url, key, {
    auth: {
      persistSession: true,
      storageKey: "sb-auth-token",
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  });
}

export const supabase = getSupabase();
