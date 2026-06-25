"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Sign-in form (reads searchParams) ───────────────────────────────────────
function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const error = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    await signIn("google", { callbackUrl });
    // setLoading(false) is intentionally omitted — page will redirect on success.
  }

  return (
    <>
      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-400"
        >
          {error === "OAuthAccountNotLinked"
            ? "This email is already associated with a different sign-in method."
            : error === "AccessDenied"
            ? "Your account does not have admin or editor access."
            : "Authentication failed. Please try again."}
        </motion.div>
      )}

      {/* Google sign-in button */}
      <motion.button
        id="google-signin-btn"
        onClick={handleGoogleSignIn}
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="group relative w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:border-zinc-500 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <svg
            className="h-5 w-5 animate-spin text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <GoogleIcon />
        )}
        {loading ? "Redirecting to Google…" : "Continue with Google"}
      </motion.button>

      <p className="mt-5 text-center text-xs text-zinc-600">
        Only authorized Cynaptics accounts can access the admin panel.
        <br />
        Contact a club admin if you need access.
      </p>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignInPage() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center px-5 overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,182,212,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="rounded-2xl border border-zinc-800 p-8 md:p-10"
          style={{
            background:
              "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(9,9,11,0.98) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Logo mark */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40">
              <svg
                className="h-7 w-7 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-white">Admin Access</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Cynaptics Club · IIT Indore
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-zinc-800" />

          <p className="mb-6 text-center text-sm text-zinc-400">
            Sign in with your authorized Google account to access the blog
            management dashboard.
          </p>

          {/* SignInForm is in a Suspense boundary because useSearchParams
              requires it in the App Router. */}
          <Suspense
            fallback={
              <div className="h-12 w-full rounded-xl bg-zinc-900 animate-pulse" />
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </motion.div>
    </main>
  );
}
