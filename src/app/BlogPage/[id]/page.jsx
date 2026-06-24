import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function BlogPostPage({ params }) {
    const { id } = params;

    const { data: post, error } = await supabase
        .from("blog_posts")
        .select(`id, title, created_at, blog_blocks ( id, type, content, position )`)
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>This blog post could not be found.</p>
            </div>
        );
    }

    const sortedBlocks = [...(post.blog_blocks || [])].sort(
        (a, b) => a.position - b.position
    );

    return (
        <div className="min-h-screen px-5 py-10 md:px-20 text-white">
            <div className="max-w-3xl mx-auto">
                <Link href="/BlogPage" className="text-cyan-400 hover:underline">
                    ← Back to Blogs
                </Link>
                <h1 className="text-2xl md:text-4xl font-bold mt-6 mb-10">
                    {post.title}
                </h1>
                <div className="flex flex-col gap-6">
                    {sortedBlocks.map((block) => (
                        <div key={block.id}>
                            {block.type === "text" && (
                                <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                                    {block.content}
                                </p>
                            )}
                            {block.type === "image" && (
                                <img src={block.content} alt={post.title} className="rounded-md w-full" />
                            )}
                            {block.type === "video" && (
                                <video src={block.content} controls className="rounded-md w-full" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}