import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Zap, Clock, FileText, Download, Eye, LayoutGrid } from "lucide-react";

export default async function HistoryPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    // Fetching your research from Neon
    const history = await prisma.analysis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="max-w-7xl mx-auto py-12 px-6 min-h-screen transition-colors duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <LayoutGrid className="text-primary" /> Research History
                    </h1>
                    <p className="text-muted-foreground font-medium italic">All your SmartDigest insights in one place.</p>
                </div>

                {history.length > 0 && (
                    <Link href="/dashboard" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-all flex items-center gap-2">
                        <Zap size={18} fill="currentColor" /> Analyze New File
                    </Link>
                )}
            </div>

            {/* 1. Empty State: Requested "Let's Analyse" button */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-card border-2 border-dashed border-border rounded-[3rem] text-center space-y-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary rotate-3">
                        <Clock size={48} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tight">Your vault is empty</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                            Start your first research analysis to build your history.
                        </p>
                    </div>
                    <Link href="/dashboard" className="px-12 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/30 hover:opacity-90 transition-all text-lg">
                        Let's Analyse
                    </Link>
                </div>
            ) : (
                /* 2. Modern Card Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {history.map((item) => {
                        const isImage = !!item.fileName.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/i);
                        // Fix: Check if fileUrl actually exists before rendering image
                        const hasUrl = item.fileUrl && item.fileUrl.trim() !== "";

                        return (
                            <div key={item.id} className="group bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">
                                <div className="aspect-video bg-background border-b border-border flex items-center justify-center overflow-hidden relative">
                                    {isImage && hasUrl ? (
                                        <img
                                            src={item.fileUrl}
                                            alt="Research Preview"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <FileText size={48} />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Preview Unavailable</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full">
                                            {item.fileType || "File"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                            {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-foreground line-clamp-1 mb-3 group-hover:text-primary transition-colors">
                                        {item.fileName}
                                    </h3>

                                    <p className="text-sm text-muted-foreground line-clamp-2 italic mb-8 flex-1">
                                        "{item.prompt}"
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Link href={`/dashboard/${item.id}`} className="flex items-center justify-center gap-2 bg-background border border-border py-4 rounded-2xl font-black text-sm hover:border-primary hover:text-primary transition-all shadow-sm">
                                            <Eye size={18} /> Details
                                        </Link>
                                        {hasUrl && (
                                            <a href={item.fileUrl} target="_blank" className="flex items-center justify-center gap-2 bg-primary/10 text-primary py-4 rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all">
                                                <Download size={18} /> Save
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
}