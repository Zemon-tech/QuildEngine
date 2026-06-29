import { supabaseAdmin } from "../../lib/supabase.js";

/**
 * Service to handle backend authentication-related tasks,
 * specifically managing the user profiles mapping.
 */
export class AuthService {
  /**
   * Retrieves the learner profile from the database.
   * If a profile does not exist yet (first login), creates a default profile.
   */
  static async getOrCreateProfile(userId: string, email: string) {
    // Fetch profile from database
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // maybeSingle returns null if no rows match, safer than single

    if (error) {
      throw new Error(`Database error fetching profile: ${error.message}`);
    }

    if (profile) {
      return profile;
    }

    // If no profile exists, auto-create a default profile row
    const defaultDisplayName = email.split("@")[0] || "Learner";
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: userId,
        display_name: defaultDisplayName,
        timezone: "UTC",
        social_links: {},
        onboarding_completed: false,
      })
      .select("*")
      .single();

    if (createError) {
      throw new Error(`Database error creating default profile: ${createError.message}`);
    }

    return newProfile;
  }
}
