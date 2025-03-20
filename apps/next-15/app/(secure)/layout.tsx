/**
 * This is an example of a client layout component with `useUserfront()`
 * that redirects unauthenticated users to the login page.
 */
"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserfront } from "@userfront/next/client";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserfront();

  useEffect(() => {
    if (isAuthenticated || isLoading || !router) return;

    // Redirect unauthenticated users to the login page
    router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  // Loading state while the authentication is being determined
  if (!isAuthenticated || isLoading) {
    return null;
  }

  return children;
}
