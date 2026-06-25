import { getPublishedPosts } from "@/lib/mdx";
import BlogsHero from "./_components/BlogsHero";
import FeaturedPost from "./_components/FeaturedPost";
import BlogGrid from "./_components/BlogGrid";
import EmptyState from "./_components/EmptyState";

export const revalidate = 60; // ISR: revalidate listing every 60 seconds

export const metadata = {
  title: "Blogs | Cynaptics IIT Indore",
  description:
    "Explore the latest AI/ML research articles, tutorials, and insights from the Cynaptics Club at IIT Indore.",
};

export default async function BlogsPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen bg-black text-white">
      <BlogsHero />

      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-28">
        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* ── Featured / Latest ── */}
            {featured && (
              <section aria-label="Featured post">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono tracking-[0.2em] uppercase text-cyan-400">
                    Featured
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                </div>
                <FeaturedPost post={featured} />
              </section>
            )}

            {/* ── All Other Posts ── */}
            {rest.length > 0 && (
              <section aria-label="More articles" className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-500">
                    More Articles
                  </span>
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-xs text-zinc-600 font-mono">{rest.length}</span>
                </div>
                <BlogGrid posts={rest} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
