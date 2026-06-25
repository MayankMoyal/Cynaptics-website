import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllPostsAdmin } from "@/lib/mdx";
import Link from "next/link";
import DashboardMetrics from "./_components/DashboardMetrics";

export const metadata = {
  title: "Dashboard | Admin — Cynaptics",
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");

  const stats = [
    { label: "Total Posts", value: posts.length, color: "cyan" },
    { label: "Published", value: published.length, color: "emerald" },
    { label: "Drafts", value: drafts.length, color: "amber" },
  ];

  return (
    <div className="relative w-full">
      {/* Header section with radial glow */}
      <div className="relative mb-12">
        <div className="absolute -inset-x-20 -inset-y-10 bg-gradient-to-r from-cyan-500/10 via-transparent to-transparent blur-3xl rounded-full opacity-50 pointer-events-none" />
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Welcome back, {session?.user.name?.split(" ")[0]} <span className="inline-block hover:animate-pulse origin-bottom-right">👋</span>
        </h1>
        <p className="mt-2 text-zinc-400 text-sm md:text-base max-w-xl">
          Here is an overview of your blog ecosystem. You can manage existing content or publish new insights.
        </p>
      </div>

      {/* Stats row (Client Component for animations) */}
      <DashboardMetrics stats={stats} />

      {/* Quick actions & Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Content Library</h2>
          <p className="text-sm text-zinc-500 mt-0.5">All your blog posts, drafts, and published content.</p>
        </div>
        <Link
          href="/admin/upload"
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95"
        >
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-20" />
          <svg className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create New Post
        </Link>
      </div>

      {/* Post list */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-sm border-dashed py-24 flex flex-col items-center justify-center text-zinc-500">
          <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0015.5 3H15" />
            </svg>
          </div>
          <p className="text-lg text-zinc-300 font-medium">No posts found</p>
          <p className="text-sm mt-1 max-w-sm text-center">Your content library is empty. Upload your first MDX article to get started.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/50">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-zinc-950/50 text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-800/60">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Article</th>
                <th className="px-6 py-4 text-left font-medium hidden md:table-cell">Author</th>
                <th className="px-6 py-4 text-left font-medium hidden sm:table-cell">Date</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-6 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                        {post.title}
                      </span>
                      {post.tags?.length > 0 && (
                        <div className="mt-1.5 flex gap-1.5 flex-wrap">
                          {post.tags.slice(0, 3).map((t) => (
                            <span key={t} className="text-[10px] text-zinc-400 bg-zinc-800/50 rounded-md px-1.5 py-0.5 border border-zinc-700/50">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 hidden md:table-cell">
                    {post.author}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 hidden sm:table-cell">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
                        post.status === "published"
                          ? "text-emerald-300 border-emerald-500/20 bg-emerald-500/10"
                          : "text-amber-300 border-amber-500/20 bg-amber-500/10"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${post.status === "published" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/edit/${post.slug}`}
                        className="inline-flex p-2 rounded-lg text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Edit Post"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <Link
                        href={`/blogs/${post.slug}`}
                        target="_blank"
                        className="inline-flex p-2 rounded-lg text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="View Live"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
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

