"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/useAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useAuth();

  const redirectedFrom = searchParams.get("redirectedFrom");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setRedirecting(true);
      router.push(redirectedFrom || "/quote");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0A1828]/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">
            Log in to Gendra
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Access your custom quoting tools
          </p>

          {redirectedFrom && (
            <div className="mb-4 text-sm text-blue-400 text-center">
              Please sign in to access <strong>{redirectedFrom}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A1828] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A1828] border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : redirecting ? "Success!" : "Log In"}
            </button>
            
            {redirecting && (
              <div className="text-center text-blue-300 mt-4 text-sm flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Redirecting to {redirectedFrom || "quote"}...
              </div>
            )}

            <p className="text-center text-gray-400 text-sm mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-blue-400 hover:text-blue-300"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 