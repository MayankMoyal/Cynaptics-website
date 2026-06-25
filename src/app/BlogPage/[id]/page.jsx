"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { use } from "react";

export default function BlogPostPage({ params }) {
    const { id } = use(params);
    const [post, setPost] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchPost() {
            const ref = doc(db, "blog_posts", id);
            const snap = await getDoc(ref);

            if (!snap.exists() || snap.data().status !== "approved") {
                setNotFound(true);
                return;
            }
            setPost({ id: snap.id, ...snap.data() });
        }
        fetchPost();
    }, [id]);

    if (notFound) return (
        <div className="min-h-screen flex items-center justify-center text-white">
            <p>This blog post could not be found.</p>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
    );

    const sortedBlocks = [...(post.blocks || [])].sort((a, b) => a.position - b.position);

    return (
        <div className="min-h-screen px-5 py-10 md:px-20 text-white">
            <div className="max-w-3xl mx-auto">
                <Link href="/BlogPage" className="text-cyan-400 hover:underline">← Back to Blogs</Link>
                <h1 className="text-2xl md:text-4xl font-bold mt-6 mb-10">{post.title}</h1>
                <div className="flex flex-col gap-6">
                    {sortedBlocks.map((block, i) => (
                        <div key={i}>
                            {block.type === "text" && (
                                <p className="text-gray-200 leading-relaxed whitespace-pre-line">{block.content}</p>
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