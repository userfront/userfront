import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-80 space-y-4">
        <Link
          href="/"
          className="px-2 text-sm opacity-50 hover:opacity-100 transition-all ease-in-out duration-300"
        >
          &#8592; Go Back
        </Link>
        {children}
      </div>
    </div>
  );
}
