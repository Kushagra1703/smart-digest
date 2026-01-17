import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
// 1. Import the Analysis type from the generated client
import { Analysis } from "prisma-client";
import { PlusCircle, History, FileText } from "lucide-react";

export default async function HistorySidebar() {
    const { userId } = await auth();

    if (!userId) return null;

    // 2. Explicitly type the history array
    const history: Analysis[] = await prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 15,
    });

    return (
        <aside className="w-72 border-r h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col">
            {/* Sidebar Header & Action */}
            <div className="p-4 border-b bg-white">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                    <PlusCircle size={18} />
                    New Analysis
                </Link>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                <div className="flex items-center gap-2 px-2 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                    <History size={14} />
                    Recent Research
                </div>

                <nav className="space-y-1">
                    {history.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                            <p className="text-sm text-slate-500">No digests found. Start by uploading a file!</p>
                        </div>
                    ) : (
                        // 3. Typed 'item' to resolve the TypeScript squiggly line
                        history.map((item: Analysis) => (
                            <Link
                                key={item.id}
                                href={`/dashboard/${item.id}`}
                                className="group flex flex-col p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
                            >
                                <span className="text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600">
                                    {item.fileName}
                                </span>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[11px] text-slate-400">
                                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono uppercase">
                                        {item.fileType.split("/")[1] || "file"}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </nav>
            </div>

            <div className="p-4 border-t bg-slate-50 text-[10px] text-slate-400 text-center">
                Logged in as research partner
            </div>
        </aside>
    );
}