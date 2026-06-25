"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { BlogPostMeta } from "@/lib/mdx";

interface Props {
  post: BlogPostMeta;
}

export default function EditForm({ post }: Props) {
  const router = useRouter();
  
  const [title, setTitle] = useState(post.title || "");
  const [slug, setSlug] = useState(post.slug || "");
  const [author, setAuthor] = useState(post.author || "");
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [tags, setTags] = useState(post.tags?.join(", ") || "");
  
  const [mdxFile, setMdxFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  
  // Notice: We don't auto-generate slug on edit to prevent accidental URL breakage,
  // but if the user wants to change it manually, they can.
  
  const handleUpload = async (status: "draft" | "published") => {
    if (!title || !slug) {
      alert("Title and Slug are required.");
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      setStatusMsg("Preparing to update...");

      let finalMdxUrl = post.mdxUrl;
      let finalThumbUrl = post.thumbnailUrl;

      // 1. Upload MDX if a new one was selected
      if (mdxFile) {
        setProgress(20);
        setStatusMsg("Uploading new MDX to S3...");
        const mdxRes = await fetch("/api/upload/presign", {
          method: "POST",
          body: JSON.stringify({ fileName: mdxFile.name, fileType: mdxFile.type || "text/mdx", folder: "posts", slug })
        });
        const mdxData = await mdxRes.json();
        
        await fetch(mdxData.presignedUrl, {
          method: "PUT",
          body: mdxFile,
          headers: { "Content-Type": mdxFile.type || "text/mdx" }
        });
        finalMdxUrl = mdxData.publicUrl;
      }

      // 2. Upload Thumbnail if a new one was selected
      if (thumbFile) {
        setProgress(50);
        setStatusMsg("Uploading new Image to S3...");
        const thumbRes = await fetch("/api/upload/presign", {
          method: "POST",
          body: JSON.stringify({ fileName: thumbFile.name, fileType: thumbFile.type, folder: "images", slug })
        });
        const thumbData = await thumbRes.json();
        
        await fetch(thumbData.presignedUrl, {
          method: "PUT",
          body: thumbFile,
          headers: { "Content-Type": thumbFile.type }
        });
        finalThumbUrl = thumbData.publicUrl;
      }

      // 3. Save to Firestore
      setProgress(85);
      setStatusMsg(`Updating database (${status})...`);
      const tagArray = tags.split(",").map(t => t.trim()).filter(Boolean);
      
      const publishRes = await fetch("/api/blogs/publish", {
        method: "POST",
        body: JSON.stringify({
          slug,
          title,
          author,
          excerpt,
          tags: tagArray,
          thumbnailUrl: finalThumbUrl,
          mdxUrl: finalMdxUrl,
          status,
        })
      });

      if (!publishRes.ok) throw new Error("Failed to update database");

      setProgress(100);
      setStatusMsg("Done!");
      
      setTimeout(() => {
        if (status === "draft") {
          router.push("/admin");
        } else {
          router.push(`/blogs/${slug}`);
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      alert("Update failed. Check console.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Post</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-6">Metadata</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                  disabled={uploading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">URL Slug <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ""))}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm font-mono placeholder:text-zinc-600"
                    disabled={uploading}
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">Warning: Changing this creates a new post.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Excerpt (Short Summary)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all resize-none placeholder:text-zinc-600"
                  disabled={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                  disabled={uploading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar for Files & Actions */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-white mb-2">Files</h2>
            <p className="text-xs text-zinc-500 mb-5">Leave empty to keep existing files.</p>
            
            <div className="space-y-5">
              {/* MDX File Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Update MDX Article</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".mdx,.md"
                    onChange={(e) => setMdxFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${mdxFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-950/50 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5'}`}>
                    <svg className={`w-8 h-8 mb-2 ${mdxFile ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-cyan-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className={`text-sm font-medium ${mdxFile ? 'text-emerald-300' : 'text-zinc-400 group-hover:text-cyan-300'}`}>
                      {mdxFile ? mdxFile.name : "Select new .mdx"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Update Cover Image</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${thumbFile ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-950/50 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5'}`}>
                    <svg className={`w-8 h-8 mb-2 ${thumbFile ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-cyan-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={`text-sm font-medium ${thumbFile ? 'text-emerald-300' : 'text-zinc-400 group-hover:text-cyan-300'}`}>
                      {thumbFile ? thumbFile.name : "Select new image"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-3">
            {uploading ? (
              <div className="w-full py-2">
                <div className="flex justify-between text-xs font-medium text-zinc-400 mb-2">
                  <span>{statusMsg}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    className="h-full bg-cyan-500" 
                  />
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleUpload("published")}
                  disabled={!title || !slug}
                  className="w-full relative group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-20 group-disabled:hidden" />
                  Update & Publish
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpload("draft")}
                    disabled={!title || !slug}
                    className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Draft
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
