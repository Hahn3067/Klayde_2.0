// src/pages/OAuthCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      // Provider sends ?code= in the URL. We exchange it for a session.
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      // Go to your Dashboard after successful sign-in
      navigate("/Dashboard", { replace: true });
    })();
  }, [navigate]);

  return null; // (optional) you could show "Signing you in..."
}
