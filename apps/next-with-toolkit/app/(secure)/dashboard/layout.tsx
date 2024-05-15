/**
 * This is an example of a client layout component with `useUserfront()`
 * that redirects unauthenticated users to the login page.
 */
"use client";

import * as React from "react";
import { useUserfront } from "@userfront/next/client";
import { useRouter } from "next/navigation";

function Loader() {
  return (
    <div className="size-full min-h-screen flex flex-col space-y-4 items-center justify-center">
      <svg
        className="animate-spin size-10 text-black mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Loading</span>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUserfront();

  React.useEffect(() => {
    if (isAuthenticated || isLoading) return;

    // Redirect unauthenticated users to the login page
    router.push("/login");
  }, [isAuthenticated, isLoading]);

  // Show a loading spinner while the authentication is being determined
  if (!isAuthenticated || isLoading) {
    return <Loader />;
  }

  return children;
}
