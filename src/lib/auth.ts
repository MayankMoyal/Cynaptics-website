/**
 * Shared NextAuth configuration.
 *
 * Imported by:
 *  - src/app/api/auth/[...nextauth]/route.ts  (the actual route handler)
 *  - Any Server Component that calls getServerSession(authOptions)
 *
 * Strategy: JWT (stateless, no adapter needed).
 *
 * Firestore `users/{uid}` schema:
 *   uid          string    — Google subject ID
 *   email        string
 *   displayName  string
 *   photoURL     string | null
 *   is_admin     boolean   — manually flipped to `true` in the Firebase console
 *   editor       boolean   — set via the admin UI (allows publishing blogs)
 *   createdAt    Timestamp
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/firebaseDb";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ─── Firestore helper ────────────────────────────────────────────────────────

async function fetchUserRoles(
  uid: string
): Promise<{ isAdmin: boolean; isEditor: boolean }> {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return { isAdmin: false, isEditor: false };
    const data = snap.data();
    return {
      isAdmin: (data.is_admin as boolean) ?? false,
      isEditor: (data.editor as boolean) ?? false,
    };
  } catch (err) {
    console.error("[auth] fetchUserRoles error:", err);
    return { isAdmin: false, isEditor: false };
  }
}

async function upsertUser(uid: string, user: {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}): Promise<void> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      // First-ever sign-in: create the document.
      // is_admin and editor both start as false.
      await setDoc(ref, {
        uid,
        email: user.email ?? null,
        displayName: user.name ?? null,
        photoURL: user.image ?? null,
        is_admin: false,
        editor: false,
        createdAt: serverTimestamp(),
      });
    }
    // We intentionally do NOT overwrite is_admin/editor on subsequent logins.
  } catch (err) {
    console.error("[auth] upsertUser error:", err);
    // Don't throw — a Firestore failure must not block sign-in.
  }
}

// ─── Auth options ────────────────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: { strategy: "jwt" },

  callbacks: {
    /**
     * Called after a successful provider sign-in.
     * We upsert the Firestore user document here.
     * Returning `false` would reject the sign-in.
     */
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;
      // `user.id` is the Google provider account ID, identical to token.sub
      await upsertUser(user.id, user);
      return true;
    },

    /**
     * Called whenever a JWT is created (sign-in) or accessed (request).
     * On initial sign-in (`user` param is present), we fetch roles from
     * Firestore and embed them in the token so subsequent requests are
     * role-aware without hitting Firestore every time.
     *
     * On `trigger === "update"` (explicit session refresh), we re-fetch
     * so admin role changes propagate without requiring a full sign-out.
     */
    async jwt({ token, user, trigger }) {
      if (user) {
        // Initial sign-in — hydrate roles into the token.
        const roles = await fetchUserRoles(token.sub!);
        token.isAdmin = roles.isAdmin;
        token.isEditor = roles.isEditor;
      }

      if (trigger === "update") {
        // Explicit refresh requested (e.g., admin grants editor access).
        const roles = await fetchUserRoles(token.sub!);
        token.isAdmin = roles.isAdmin;
        token.isEditor = roles.isEditor;
      }

      return token;
    },

    /**
     * Shapes the session object exposed to client components.
     * Picks fields from the JWT and maps them onto `session.user`.
     */
    async session({ session, token }) {
      session.user.uid = token.sub ?? "";
      session.user.isAdmin = token.isAdmin ?? false;
      session.user.isEditor = token.isEditor ?? false;
      return session;
    },
  },
};
