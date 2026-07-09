"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  return (
    <main className="relative min-h-screen bg-black flex items-center justify-center px-5 overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Red radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        <div
          className="rounded-2xl border border-red-900/40 p-10"
          style={{
            background:
              "linear-gradient(145deg, rgba(24,24,27,0.95) 0%, rgba(9,9,11,0.98) 100%)",
          }}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/40">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Your account is not authorized to access the Cynaptics admin panel.
            You need to be assigned the{" "}
            <span className="font-mono text-cyan-400">admin</span> or{" "}
            <span className="font-mono text-cyan-400">editor</span> role by a
            club administrator.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="block w-full rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              ← Back to Homepage
            </Link>
            <Link
              href="/auth/signin"
              className="block w-full rounded-xl border border-zinc-800 px-6 py-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sign in with a different account
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
