"use client";
import { motion } from "framer-motion";

export default function BlogsHero() {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      {/* Grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 text-xs font-mono tracking-[0.3em] uppercase text-cyan-400"
      >
        Cynaptics Club · IIT Indore
      </motion.span>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative text-6xl md:text-8xl font-black tracking-tight text-center"
      >
        <span
          style={{
            background:
              "linear-gradient(135deg, #ffffff 30%, #06b6d4 70%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          BLOGS
        </span>
      </motion.h1>

      {/* Sub-text */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-5 max-w-lg text-center text-zinc-400 text-sm md:text-base leading-relaxed"
      >
        Research articles, tutorials, and deep-dives on AI&nbsp;&&nbsp;ML
        from the minds at Cynaptics.
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-10 h-px w-48 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
      />
    </section>
  );
}
