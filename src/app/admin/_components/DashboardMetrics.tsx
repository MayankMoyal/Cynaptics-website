"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Stat {
  label: string;
  value: number;
  color: string;
}

export default function DashboardMetrics({ stats }: { stats: Stat[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
    >
      {stats.map((stat, i) => {
        // Map color string to Tailwind classes safely
        const colorMap: Record<string, string> = {
          cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/50",
          emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400/50",
          amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400 group-hover:border-amber-400/50",
        };
        const glowMap: Record<string, string> = {
          cyan: "bg-cyan-500/20",
          emerald: "bg-emerald-500/20",
          amber: "bg-amber-500/20",
        };

        return (
          <motion.div key={stat.label} variants={item} className="relative group">
            {/* Glow effect behind the card */}
            <div className={`absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500 ${glowMap[stat.color]}`} />
            
            <div className={`relative flex flex-col justify-between h-full rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-xl transition-all duration-300 ${colorMap[stat.color]}`}>
              <div className="flex justify-between items-start">
                <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                {/* Decorative icon based on type */}
                {i === 0 && <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                {i === 1 && <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                {i === 2 && <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
              </div>
              <p className="text-5xl font-bold mt-4 tracking-tight drop-shadow-sm">
                {stat.value}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
