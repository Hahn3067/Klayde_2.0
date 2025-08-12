import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { loadTenantForCurrentUser, saveTenantToStorage } from "@/lib/tenant";
import { useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Finishing sign-in…");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) Turn Google's code in the URL into a Supabase session
        setMsg("Completing secure sign-in…");
        await supabase.auth.exchangeCodeForSession();

        if (!mounted) return;

        // 2) Double-check we have a session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setMsg("No session found. Redirecting to sign-in…");
          setTimeout(() => navigate("/login", { replace: true }), 600);
          return;
        }

        // 3) (Optional) Load org/role; ok if not ready yet
        setMsg("Setting up your workspace…");
        const tenant = await loadTenantForCurrentUser().catch(() => null);
        if (!mounted) return;
        if (tenant) saveTenantToStorage(tenant);

        // 4) Go to dashboard (lowercase path)
        setMsg("All set! Redirecting to your dashboard…");
        setTimeout(() => navigate("/dashboard", { replace: true }), 400);
      } catch (e) {
        console.error("OAuth error:", e);
        setMsg("Sign-in failed. Sending you to login…");
        setTimeout(() => navigate("/login", { replace: true }), 800);
      }
    })();

    return () => { mounted = false; };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center text-gray-700">
        <div className="animate-pulse mb-2">🔐</div>
        <p className="text-base">{msg}</p>
      </div>
    </div>
  );
}
