"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            const q = query(
                collection(db, "blog_posts"),
                where("status", "==", "approved"),
                orderBy("created_at", "desc")
            );
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(data);
            setLoading(false);
        }
        fetchPosts();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen px-5 py-10 md:px-20 text-white">
            <h1 className="text-center font-bold text-2xl md:text-5xl mb-16">Blogs</h1>

            {posts.length === 0 && (
                <p className="text-center text-gray-400">No blog posts yet. Check back soon!</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {posts.map((post) => {
                    const sortedBlocks = [...(post.blocks || [])].sort((a, b) => a.position - b.position);
                    const thumbnail = sortedBlocks.find((b) => b.type === "image");

                    return (
                        <Link key={post.id} href={`/BlogPage/${post.id}`}>
                            <div className="border border-gray-700 rounded-lg overflow-hidden hover:scale-[1.02] hover:border-cyan-400 transition-all cursor-pointer h-full flex flex-col">
                                <div className="w-full h-48 bg-gray-800">
                                    {thumbnail ? (
                                        <img src={thumbnail.content} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
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