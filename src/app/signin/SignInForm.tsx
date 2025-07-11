'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/useAuth";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { supabase, session } = useAuth();
  const redirectAttempted = useRef(false);
  const loginLogged = useRef(false);

  const [redirectPath, setRedirectPath] = useState("/quote");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Get redirect path from URL parameters on component mount
  useEffect(() => {
    const redirected = searchParams.get("redirectedFrom");
    if (redirected) {
      setRedirectPath(redirected);
    }
  }, [searchParams]);

  // Log the login attempt to the database
  const logLoginAttempt = async (userId: string, userEmail: string) => {
    if (loginLogged.current) return;
    
    try {
      const { error } = await supabase.from('logins').insert({
        user_id: userId,
        email: userEmail,
      });
      
      if (error) {
        console.error('Failed to log login attempt:', error);
      } else {
        loginLogged.current = true;
      }
    } catch (err) {
      console.error('Error logging login attempt:', err);
    }
  };

  // Handle successful authentication and redirect
  const handleSuccessfulAuth = useCallback(() => {
    if (redirectAttempted.current) return;
    redirectAttempted.current = true;
    
    setRedirecting(true);
    
    // Use setTimeout to ensure the redirect happens after state updates
    setTimeout(() => {
      router.push(redirectPath || "/quote");
    }, 100);
  }, [router, redirectPath]);

  // Check for existing session and redirect if already logged in
  useEffect(() => {
    if (session && !redirecting && !redirectAttempted.current) {
      handleSuccessfulAuth();
    }
  }, [session, redirecting, handleSuccessfulAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);
    redirectAttempted.current = false;
    loginLogged.current = false;

    try {
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      // Log the successful login
      if (data?.session?.user) {
        await logLoginAttempt(data.session.user.id, data.session.user.email || email);
      }
      
      // Only trigger redirect if we have a valid session
      if (data?.session) {
        handleSuccessfulAuth();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setRedirecting(false);
      redirectAttempted.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#0A1828]/50 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">Log in to Gendra</h1>
          <p className="text-gray-400 text-center mb-8">Access your custom quoting tools</p>

          {redirectPath && redirectPath !== "/quote" && (
            <div className="mb-4 text-sm text-blue-400 text-center">
              Please sign in to access <strong>{redirectPath}</strong>
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
                Redirecting to {redirectPath}...
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