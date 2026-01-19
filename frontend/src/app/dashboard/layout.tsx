import HistorySidebar from "@/components/HistorySidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-65px)] overflow-hidden">
            {/* 1. History Sidebar: Fixed on the left */}
            <HistorySidebar />

            {/* 2. Main Area: Centered with matched color palette */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 flex flex-col items-center justify-center">
                <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
                    {children}
                </div>
            </main>
        </div>
    );
}