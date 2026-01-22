export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-[calc(100vh-65px)] bg-background transition-colors duration-500">
            {/* Sidebar is removed from here to make the analysis page focused */}
            <main className="w-full bg-background transition-colors duration-500">
                {children}
            </main>
        </div>
    );
}