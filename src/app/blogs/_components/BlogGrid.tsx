"use client";
import type { BlogPostMeta } from "@/lib/mdx";
import BlogCard from "./BlogCard";

interface Props {
  posts: BlogPostMeta[];
}

export default function BlogGrid({ posts }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, i) => (
        <BlogCard key={post.slug} post={post} index={i} />
      ))}
    </div>
  );
}
