"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPostMeta } from "@/lib/mdx";

interface Props {
  post: BlogPostMeta;
  index?: number;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="h-full"
    >
      <Link href={`/blogs/${post.slug}`} className="group block h-full">
        <div
          className="relative h-full rounded-xl overflow-hidden border border-zinc-800 group-hover:border-cyan-500/30 transition-all duration-400 flex flex-col"
          style={{
            background: "rgba(18,18,20,0.9)",
          }}
        >
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden flex-shrink-0">
            {post.thumbnailUrl ? (
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <span className="text-3xl text-zinc-700">✦</span>
              </div>
            )}
            {/* Gradient bottom fade */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: "linear-gradient(to top, rgba(18,18,20,0.9) 0%, transparent 100%)",
              }}
            />
            {/* Tags overlay */}
            {post.tags?.length > 0 && (
              <div className="absolute bottom-2 left-3 flex flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800/50 rounded-full px-2 py-0.5 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-5">
            <h3 className="font-semibold text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-cyan-50 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-[9px] font-bold text-white">
                  {post.author?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <span className="text-xs text-zinc-400">{post.author}</span>
              </div>
              {post.publishedAt && (
                <span className="text-xs text-zinc-600">{formatDate(post.publishedAt)}</span>
              )}
            </div>
          </div>

          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent group-hover:via-cyan-500/50 transition-all duration-500" />
        </div>
      </Link>
    </motion.div>
  );
}
