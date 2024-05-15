import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full max-w-80 space-y-4">
      <Link
        href="/"
        className="absolute top-0 left-0 p-4 text-sm text-gray-200 hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-200 transition-all ease-in-out duration-300"
      >
        &#8592; Go Back
      </Link>
      {children}
    </div>
  );
}
