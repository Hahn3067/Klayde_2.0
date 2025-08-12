import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function loginWithGoogle() {
    try {
      setErr("");
      setLoading(true);
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      // Redirects away to Google; no code runs after this until callback
    } catch (e) {
      setLoading(false);
      setErr("Could not start Google sign-in. Check provider settings.");
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Beaker className="w-12 h-12 text-orange-600" />
          <h1 className="text-2xl font-bold mt-4">Sign in to Klayde</h1>
          <p className="text-gray-500 text-sm mt-1">Use your Google account</p>
        </div>

        <Button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "Redirecting…" : "Continue with Google"}
        </Button>

        {err && (
          <p className="mt-3 text-sm text-red-600 text-center">{err}</p>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
