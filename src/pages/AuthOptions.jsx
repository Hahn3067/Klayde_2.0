import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { SiMicrosoft } from "react-icons/si";

export default function AuthOptions() {
  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  async function loginWithMicrosoft() {
    await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        <div className="space-y-4">
          <Button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100"
          >
            <FcGoogle size={22} /> Sign in with Google
          </Button>

          <Button
            onClick={loginWithMicrosoft}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-100"
          >
            <SiMicrosoft size={22} color="#0078D4" /> Sign in with Microsoft
          </Button>
        </div>
      </div>
    </div>
  );
}
