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
      // 1) Make sure we really have a session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error || !session) {
        setMsg("No session found. Redirecting to sign-in…");
        setTimeout(() => navigate("/auth"), 800);
        return;
      }

      // 2) Load org + role (with brief retries for first-time users)
      setMsg("Setting up your workspace…");
      const tenant = await loadTenantForCurrentUser();

      if (!mounted) return;

      if (tenant) {
        // 3) Save tenant details for the app
        saveTenantToStorage(tenant);
        setMsg("All set! Redirecting to your dashboard…");
        // 4) Go to the app
        setTimeout(() => navigate("/Dashboard"), 400);
      } else {
        // If for some reason membership isn't ready, still continue
        // (RLS will protect data; we can try again on Dashboard)
        setMsg("Almost there… Redirecting now.");
        setTimeout(() => navigate("/Dashboard"), 600);
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
