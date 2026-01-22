"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Plus, History, FileText, Search, Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function HistorySidebar() {
    const router = useRouter();
    const params = useParams();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fix the "2 F5" issue by refreshing data on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/history"); // Ensure you have this endpoint
                const data = await res.json();
                setHistory(data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        router.refresh(); // Sync server components
    }, [router, params.id]); // Re-run if ID changes to keep sidebar synced

    return (
        <aside className="w-72 h-screen flex flex-col bg-card border-r border-border transition-colors duration-500">
            {/* New Analysis Button */}
            <div className="p-4">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
                >
                    <Plus size={18} />
                    <span>New Analysis</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4 px-2">
                    <History size={14} />
                    <span>Recent Research</span>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : history.length > 0 ? (
                    history.map((item) => (
                        <Link
                            key={item.id}
                            href={`/dashboard/${item.id}`}
                            className={clsx(
                                "flex flex-col p-3 rounded-lg transition-all group",
                                params.id === item.id
                                    ? "bg-primary/10 border-l-4 border-primary"
                                    : "hover:bg-slate-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            <span className={clsx(
                                "text-sm font-semibold truncate",
                                params.id === item.id ? "text-primary" : "text-foreground"
                            )}>
                                {item.fileName}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase mt-1">
                                {item.fileType || "File"} • {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-400 text-sm italic">
                        No history found
                    </div>
                )}
            </div>

            {/* User/Profile Section placeholder */}
            <div className="p-4 border-t border-border bg-background/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        K
                    </div>
                    <span className="text-sm font-medium">Kushagra</span>
                </div>
            </div>
        </aside>
    );
}