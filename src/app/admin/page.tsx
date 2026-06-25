import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/mdx";
import Link from "next/link";

export const metadata = {
  title: "Dashboard | Admin — Cynaptics",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {session?.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your blog posts and content from here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Posts", value: posts.length, color: "cyan" },
          { label: "Published", value: published.length, color: "emerald" },
          { label: "Drafts", value: drafts.length, color: "amber" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
          >
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold text-${stat.color}-400`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="mb-8">
        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 border-dashed py-16 text-center text-zinc-600">
          <p className="text-lg">No posts yet</p>
          <p className="text-sm mt-1">Upload your first MDX article to get started.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Title</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Author</th>
                <th className="px-5 py-3 text-left hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      href={`/blogs/${post.slug}`}
                      target="_blank"
                      className="text-white font-medium hover:text-cyan-400 transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    {post.tags?.length > 0 && (
                      <div className="mt-1 flex gap-1 flex-wrap">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-zinc-400 hidden md:table-cell">
                    {post.author}
                  </td>
                  <td className="px-5 py-3 text-zinc-500 hidden sm:table-cell text-xs">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-mono border ${
                        post.status === "published"
                          ? "text-emerald-300 border-emerald-800/60 bg-emerald-950/50"
                          : "text-amber-300 border-amber-800/60 bg-amber-950/50"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
