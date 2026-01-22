import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Download, Calendar, Zap, FileText, ExternalLink, Hash } from "lucide-react";

export default async function HistoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const { id } = await params; // Crucial fix for the Prisma error

    if (!userId) redirect("/");
    if (!id) redirect("/dashboard");

    const analysis = await prisma.analysis.findUnique({
        where: { id, userId },
    });

    if (!analysis) notFound();

    const fileLink = analysis.fileUrl;
    const isImage = !!analysis.fileName.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/i);

    return (
        <main className="w-full max-w-5xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-700">
            {/* 1. Header Card */}
            <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <FileText size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                            {analysis.fileName}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                            <Calendar size={14} />
                            {new Date(analysis.createdAt).toLocaleDateString("en-IN")}
                        </span>
                        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-tighter">
                            {analysis.fileType || "Research"}
                        </span>
                    </div>
                </div>

                {fileLink && (
                    <a href={fileLink} target="_blank" className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95">
                        <Download size={20} />
                        Download Original
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Preview (Left) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-card border border-border rounded-[2rem] p-5 shadow-sm overflow-hidden">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex justify-between px-2">
                            <span>Security Verified Preview</span>
                            <Hash size={12} />
                        </div>
                        <div className="rounded-2xl bg-background border border-border/50 h-[400px] flex items-center justify-center overflow-hidden">
                            {fileLink && isImage ? (
                                <img src={fileLink} alt="Analysis" className="max-h-full w-auto object-contain transition-transform duration-500 hover:scale-110" />
                            ) : (
                                <div className="text-center space-y-4 opacity-50">
                                    <FileText size={48} className="mx-auto" />
                                    <p className="text-xs font-bold">PREVIEW NOT SUPPORTED</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Analysis Results (Right) */}
                <div className="lg:col-span-7">
                    <div className="bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-sm relative">
                        <div className="absolute top-0 left-12 right-12 h-1 bg-primary rounded-b-full shadow-[0_0_20px_rgba(79,70,229,0.5)]" />
                        <div className="flex items-center gap-2 mb-10 text-primary font-black uppercase tracking-widest text-[10px]">
                            <Zap size={16} fill="currentColor" />
                            <span>Gemini 3 Flash Digest</span>
                        </div>
                        <div className="prose prose-indigo dark:prose-invert max-w-none 
              prose-p:text-foreground/80 prose-p:text-lg
              prose-strong:text-primary prose-strong:font-black">
                            <ReactMarkdown>{analysis.content}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}