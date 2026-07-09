import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { getPostBySlugAdmin, fetchMdxFromS3 } from "@/lib/mdx";
import { mdxComponents } from "@/app/blogs/[slug]/_components/MdxComponents";
import PostHero from "@/app/blogs/[slug]/_components/PostHero";

// This is a dynamic route strictly for admins to preview drafts
export const dynamic = 'force-dynamic';

export default async function PreviewPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // 1. Authorize user (Admins/Editors only)
  const session = await getServerSession(authOptions);
  if (!session || (!session.user.isAdmin && !session.user.isEditor)) {
    redirect("/"); // Or show unauthorized
  }

  // 2. Fetch metadata from Firestore (including drafts)
  const post = await getPostBySlugAdmin(params.slug);
  if (!post) notFound();

  // 3. Fetch raw MDX string from S3 (We disable fetch cache here so previews are always fresh)
  let mdxSource: string;
  try {
    const res = await fetch(post.mdxUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error("Fetch failed");
    mdxSource = await res.text();
  } catch (err) {
    console.error("[PreviewPostPage] Could not load MDX content:", err);
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm">
          Content temporarily unavailable. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* ── Preview Banner ── */}
      <div className="fixed top-0 left-0 w-full bg-amber-500/20 text-amber-300 text-xs font-mono font-medium text-center py-1.5 z-50 border-b border-amber-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(245,158,11,0.1)] flex justify-center items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        DRAFT PREVIEW MODE
      </div>

      {/* ── Cinematic header ── */}
      <PostHero post={post} />

      {/* ── Article body ── */}
      <article className="max-w-3xl mx-auto px-5 md:px-8 py-12 pt-20">
        {/* Excerpt / lead paragraph */}
        {post.excerpt && (
          <p className="text-lg text-zinc-400 leading-relaxed mb-10 pb-10 border-b border-zinc-800 font-light italic">
            {post.excerpt}
          </p>
        )}

        {/* MDX content — rendered entirely server-side */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <MDXRemote
            source={mdxSource}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </div>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-zinc-800">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author card */}
          <div className="flex items-center gap-4 rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {post.author?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono mb-0.5">Written by</p>
              <p className="font-semibold text-white">{post.author}</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
