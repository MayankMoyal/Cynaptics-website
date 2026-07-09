"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPostMeta } from "@/lib/mdx";

interface Props {
  post: BlogPostMeta;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function FeaturedPost({ post }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Link href={`/blogs/${post.slug}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden border border-zinc-800 group-hover:border-cyan-500/40 transition-all duration-500"
          style={{
            background:
              "linear-gradient(135deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0.95) 100%)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Hover glow */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ boxShadow: "inset 0 0 80px rgba(6,182,212,0.06)" }}
          />

          <div className="flex flex-col lg:flex-row min-h-[380px]">
            {/* Thumbnail */}
            <div className="relative lg:w-[45%] flex-shrink-0 h-56 lg:h-auto overflow-hidden">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <span className="text-5xl text-zinc-700">✦</span>
                </div>
              )}
              {/* Overlay gradient for blending into content */}
              <div className="absolute inset-0 hidden lg:block"
                style={{ background: "linear-gradient(to right, transparent 60%, rgba(9,9,11,0.95))" }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center p-8 lg:p-10 lg:pl-8 flex-1">
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-mono text-cyan-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  FEATURED
                </span>
              </div>

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-zinc-400 bg-zinc-800/60 rounded-full px-2.5 py-0.5 border border-zinc-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4 group-hover:text-cyan-50 transition-colors">
                {post.title}
              </h2>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              {/* Footer: author + date + CTA */}
              <div className="flex items-center justify-between flex-wrap gap-4 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                    {post.author?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{post.author}</p>
                    {post.publishedAt && (
                      <p className="text-xs text-zinc-500">{formatDate(post.publishedAt)}</p>
                    )}
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Read Article
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
