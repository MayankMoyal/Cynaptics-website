import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export const revalidate = 0;

export default async function BlogPage() {
    const { data: posts, error } = await supabase
        .from("blog_posts")
        .select(`id, title, created_at, blog_blocks ( type, content, position )`)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

    if (error) console.error(error);

    return (
        <div className="min-h-screen px-5 py-10 md:px-20 text-white">
            <h1 className="text-center font-bold text-2xl md:text-5xl mb-16">
                Blogs
            </h1>

            {(!posts || posts.length === 0) && (
                <p className="text-center text-gray-400">
                    No blog posts yet. Check back soon!
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {posts?.map((post) => {
                    const sortedBlocks = [...(post.blog_blocks || [])].sort(
                        (a, b) => a.position - b.position
                    );
                    const thumbnail = sortedBlocks.find((b) => b.type === "image");

                    return (
                        <Link key={post.id} href={`/BlogPage/${post.id}`}>
                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:scale-[1.02] hover:border-cyan-400 transition-all cursor-pointer h-full flex flex-col">
                                <div className="w-full h-48 bg-gray-800">
                                    {thumbnail ? (
                                        <img src={thumbnail.content} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{post.title}</h2>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}