/**
 * Admin Layout — Server Component.
 *
 * This is the authorization gate. It runs AFTER the edge middleware has
 * already confirmed the user holds a valid NextAuth JWT cookie.
 *
 * Here we do the deeper check:
 *   1. Retrieve the full server session (includes isAdmin, isEditor from JWT).
 *   2. If the user has neither role → redirect to /auth/unauthorized.
 *   3. Render the admin shell around the page content.
 *
 * Admin shell includes:
 *   - A compact top bar with site branding + user info + sign-out
 *   - A left sidebar with navigation links (hidden on mobile)
 */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "Admin Panel | Cynaptics",
  robots: { index: false, follow: false }, // never index admin pages
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get full session (populated from JWT by authOptions.callbacks.session)
  const session = await getServerSession(authOptions);

  // 2. No session at all (middleware should have caught this, but defense-in-depth)
  if (!session) {
    redirect("/auth/signin");
  }

  // 3. Authenticated but no role → deny
  if (!session.user.isAdmin && !session.user.isEditor) {
    redirect("/auth/unauthorized");
  }

  // 4. Authorized — render the admin shell
  return (
    <AdminShell session={session}>
      {children}
    </AdminShell>
  );
}
