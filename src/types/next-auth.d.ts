/**
 * NextAuth type extensions.
 *
 * Adds `isAdmin`, `isEditor`, and `uid` to the Session and JWT interfaces
 * so they are fully typed throughout the codebase.
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Firebase Firestore document ID under users/{uid}. Same as Google sub. */
      uid: string;
      /** Manually set to true in the Firebase console for super-admins. */
      isAdmin: boolean;
      /** Set to true by an admin through the admin UI. Can publish blogs. */
      isEditor: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
    isEditor: boolean;
  }
}
