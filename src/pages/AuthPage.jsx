import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  async function loginWithMicrosoft() {
    await supabase.auth.signInWithOAuth({
      provider: "azure", // Microsoft via Azure Entra
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <Beaker className="w-12 h-12 text-orange-600" />
          <h1 className="text-2xl font-bold mt-4">Sign in to Klayde</h1>
          <p className="text-gray-500 text-sm mt-1">Choose your sign-in method</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </Button>

          <Button
            onClick={loginWithMicrosoft}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft"
              className="w-5 h-5"
            />
            Continue with Microsoft
          </Button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 block text-center text-sm text-gray-500 hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
