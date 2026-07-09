/**
 * NextAuth App Router route handler.
 * Handles GET (session fetch, redirect) and POST (sign-in, sign-out) requests.
 *
 * Route: /api/auth/[...nextauth]
 */
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
