"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { setAuthToken } from "@/lib/api";
import { PyramidLogoBadge } from "@/components/pyramid-logo";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return "https://usepyramid.onrender.com";
    }
    return "http://localhost:3001";
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/guest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate as guest");
      }

      const data = await response.json();
      if (data.token) {
        setAuthToken(data.token);
      }
      if (data.user) {
        router.push("/tasks");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = getApiUrl();
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      {/* Top Logo and Header */}
      <div className="mb-6 flex items-center gap-3">
        <PyramidLogoBadge className="h-11 w-11 rounded-2xl" iconClassName="h-6 w-6" />
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Pyramid
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md rounded-[24px] border border-zinc-200/80 bg-white p-8 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Let's get back on track
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Enter your email below to login to your account.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {/* Continue as Guest Button */}
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-zinc-900 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            {loading ? "Authenticating..." : "Continue as Guest"}
          </button>

          {/* Login with Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-800 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </button>
        </div>

        {/* Footer Terms */}
        <p className="mt-8 text-center text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          By clicking continue, you agree to our{" "}
          <a
            href="#"
            className="underline transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
