/**
 * Data-access utilities for the MDX blog system.
 *
 * - Firestore (via firebaseDb): holds slim metadata documents (title, slug, author …)
 * - S3 (via fetch): holds the full .mdx file content
 *
 * Timestamps are serialised to ISO strings so documents can be safely passed
 * from Server Components to Client Components as plain props.
 */

import { db } from "@/lib/firebaseDb";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPostMeta {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  tags: string[];
  /** Public HTTPS URL pointing to the thumbnail image stored in S3. */
  thumbnailUrl: string;
  /** Public HTTPS URL pointing to the .mdx file stored in S3. */
  mdxUrl: string;
  status: "draft" | "published";
  /** ISO 8601 string; null if the field is absent in Firestore. */
  publishedAt: string | null;
  createdAt: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toIso(ts: { toDate?: () => Date } | null | undefined): string | null {
  return ts?.toDate?.()?.toISOString() ?? null;
}

function docToMeta(id: string, data: Record<string, unknown>): BlogPostMeta {
  return {
    slug: id,
    title: (data.title as string) ?? "",
    author: (data.author as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    thumbnailUrl: (data.thumbnailUrl as string) ?? "",
    mdxUrl: (data.mdxUrl as string) ?? "",
    status: (data.status as BlogPostMeta["status"]) ?? "draft",
    publishedAt: toIso(data.publishedAt as Parameters<typeof toIso>[0]),
    createdAt: toIso(data.createdAt as Parameters<typeof toIso>[0]),
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/**
 * Returns all published posts ordered by publish date (newest first).
 * Used by the /blogs listing page — no MDX is fetched here.
 */
export async function getPublishedPosts(): Promise<BlogPostMeta[]> {
  try {
    const q = query(
      collection(db, "blog_posts"),
      where("status", "==", "published"),
      orderBy("publishedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) =>
      docToMeta(d.id, d.data() as Record<string, unknown>)
    );
  } catch (err) {
    console.error("[mdx] Failed to fetch blog posts:", err);
    return [];
  }
}

/**
 * Returns a single published post's metadata by slug.
 * Returns null when the post is absent or not yet published.
 */
export async function getPostBySlug(
  slug: string
): Promise<BlogPostMeta | null> {
  try {
    const ref = doc(db, "blog_posts", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    if (data.status !== "published") return null;
    return docToMeta(snap.id, data);
  } catch (err) {
    console.error(`[mdx] Failed to fetch post "${slug}":`, err);
    return null;
  }
}

/**
 * Returns ALL posts (including drafts) for admin use.
 */
export async function getAllPostsAdmin(): Promise<BlogPostMeta[]> {
  try {
    const q = query(
      collection(db, "blog_posts"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) =>
      docToMeta(d.id, d.data() as Record<string, unknown>)
    );
  } catch (err) {
    console.error("[mdx] Failed to fetch admin posts:", err);
    return [];
  }
}

// ─── S3 Content Fetcher ───────────────────────────────────────────────────────

/**
 * Fetches the raw MDX string from a public S3 URL.
 * Results are cached by Next.js fetch for 1 hour (ISR-compatible).
 */
export async function fetchMdxFromS3(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(
      `[mdx] S3 fetch failed (${res.status}): ${res.statusText} — ${url}`
    );
  }
  return res.text();
}
