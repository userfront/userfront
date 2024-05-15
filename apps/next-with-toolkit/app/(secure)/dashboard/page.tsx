/**
 * This is an example of a client page with `useUserfront()`.
 */
"use client";

import * as React from "react";
import { LogoutButton, useUserfront } from "@userfront/next/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUserfront();

  return (
    <div className="flex flex-col p-4 space-y-4">
      <span>Hello, {user.email}</span>
      <LogoutButton />
      <Link href="/server">Server Example with Data Fetching &#8594;</Link>
    </div>
  );
}
