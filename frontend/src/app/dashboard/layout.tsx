import HistorySidebar from "@/components/HistorySidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-65px)] overflow-hidden">
            {/* 1. Left Sidebar: Shows history list and "New Analysis" button */}
            <HistorySidebar />

            {/* 2. Right Main Content Area: Where your file upload and results appear */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}