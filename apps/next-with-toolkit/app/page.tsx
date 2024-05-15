import Link from "next/link";

const NavLink = (props: React.ComponentProps<typeof Link>) => (
  <Link
    {...props}
    className="px-2 text-gray-500 hover:text-gray-950 dark:hover:text-gray-50 transition-all ease-in-out duration-300"
  />
);

export default function Page() {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <h1 className="text-lg font-bold">Home</h1>
      <NavLink href="/login">Login</NavLink>
      <NavLink href="/signup">Sign Up</NavLink>
      <NavLink href="/reset-password">Reset Password</NavLink>
      <NavLink href="/dashboard">Dashboard</NavLink>
    </div>
  );
}
