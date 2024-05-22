/**
 * This is an example of a client layout component with `useUserfront()`
 * that redirects unauthenticated users to the login page.
 */
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserfront } from "@userfront/next/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserfront();

  React.useEffect(() => {
    if (isAuthenticated || isLoading || !router) return;

    // Redirect unauthenticated users to the login page
    router.push("/login");
  }, [isAuthenticated, isLoading, router]);

  // Show a loading spinner while the authentication is being determined
  if (!isAuthenticated || isLoading) {
    return null;
  }

  return children;
}
