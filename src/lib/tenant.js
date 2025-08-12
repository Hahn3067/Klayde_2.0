import { supabase } from "@/lib/supabaseClient";

/**
 * Load the current user's org & role from the memberships table.
 * Includes a short retry because the auth trigger may take ~100–500ms
 * to create the membership on a brand-new user.
 */
export async function loadTenantForCurrentUser({ retries = 10, delayMs = 300 } = {}) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) {
    console.error("getUser error:", userErr);
    return null;
  }
  if (!user) return null;

  for (let attempt = 0; attempt < retries; attempt++) {
    const { data, error } = await supabase
      .from("memberships")
      .select("organization_id, role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("loadTenant query error:", error);
      // Don’t retry on auth/permission errors; break
      break;
    }

    if (data && data.length > 0) {
      // If user ever has multiple orgs, you can change which one you pick here.
      return { organization_id: data[0].organization_id, role: data[0].role };
    }

    // No membership yet — wait a bit and try again
    await new Promise(r => setTimeout(r, delayMs));
  }
  return null;
}

export function saveTenantToStorage({ organization_id, role }) {
  try {
    localStorage.setItem("orgId", organization_id);
    localStorage.setItem("userRole", role);
  } catch (e) {
    console.warn("Could not write tenant to storage:", e);
  }
}
