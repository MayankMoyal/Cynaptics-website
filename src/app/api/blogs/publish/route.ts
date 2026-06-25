import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/firebaseDb";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    // 1. Authorize user
    const session = await getServerSession(authOptions);
    if (!session || (!session.user.isAdmin && !session.user.isEditor)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { slug, title, author, excerpt, tags, thumbnailUrl, mdxUrl, status } = body;

    // Basic validation
    if (!slug || !title || !mdxUrl) {
      return NextResponse.json(
        { error: "Missing required fields (slug, title, mdxUrl)" },
        { status: 400 }
      );
    }

    // 3. Write to Firestore
    const postRef = doc(db, "blog_posts", slug);
    await setDoc(postRef, {
      slug,
      title,
      author: author || session.user.name || "Anonymous",
      excerpt: excerpt || "",
      tags: tags || [],
      thumbnailUrl: thumbnailUrl || null,
      mdxUrl,
      status: status || "draft",
      publishedAt: status === "published" ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      createdByUid: session.user.uid,
    }, { merge: true }); // merge true allows updating existing drafts

    // 4. On-Demand Revalidation
    revalidatePath("/blogs");
    revalidatePath(`/blogs/${slug}`);
    revalidatePath("/admin");

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("[api/blogs/publish] Error:", error);
    return NextResponse.json(
      { error: "Failed to publish blog post metadata" },
      { status: 500 }
    );
  }
}
