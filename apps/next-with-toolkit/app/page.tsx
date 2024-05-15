import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <h1 className="font-bold">Home</h1>
      <Link href="/login">Login</Link>
      <Link href="/signup">Sign Up</Link>
      <Link href="/reset-password">Reset Password</Link>
    </div>
  );
}
