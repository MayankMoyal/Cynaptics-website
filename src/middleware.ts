/**
 * Edge Middleware — authentication boundary for /admin routes.
 *
 * We deliberately avoid importing from `next-auth/middleware` because it
 * causes a "NextResponse already declared" SWC parse error in next@13.4.4.
 * Instead we read the NextAuth JWT session cookie directly from the request
 * and redirect unauthenticated visitors to /auth/signin.
 *
 * Authorization (role checks) happens in src/app/admin/layout.tsx
 * which runs in the Node.js runtime and has Firestore access.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // NextAuth stores the session in these cookies (one per strategy)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ??
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

