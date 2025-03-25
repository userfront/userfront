

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-xl font-bold">Auth Section</h1>
            {children}
        </div>
    );
}
