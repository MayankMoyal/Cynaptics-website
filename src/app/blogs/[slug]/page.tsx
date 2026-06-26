import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { getPublishedPosts, getPostBySlug, fetchMdxFromS3 } from "@/lib/mdx";
import { mdxComponents } from "./_components/MdxComponents";
import PostHero from "./_components/PostHero";

// ─── ISR ─────────────────────────────────────────────────────────────────────

export const revalidate = 3600; // revalidate each post page every hour

/** Pre-render all known published slugs at build time. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// ─── SEO ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return { title: "Post Not Found | Cynaptics" };
  }
  return {
    title: `${post.title} | Cynaptics`,
    description: post.excerpt,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.thumbnailUrl
        ? [{ url: post.thumbnailUrl, alt: post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // 1. Fetch metadata from Firestore
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  // 2. Fetch raw MDX string from S3
  let mdxSource: string;
  try {
    mdxSource = await fetchMdxFromS3(post.mdxUrl, params.slug);
  } catch (err) {
    console.error("[BlogPostPage] Could not load MDX content:", err);
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm">
          Content temporarily unavailable. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Cinematic header ── */}
      <PostHero post={post} />

      {/* ── Article body ── */}
      <article className="max-w-3xl mx-auto px-5 md:px-8 py-12">
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
