import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Download, FileText, Calendar, Zap } from "lucide-react";

export default async function HistoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { userId } = await auth();
    const { id } = await params;
    if (!userId) redirect("/");

    const analysis = await prisma.analysis.findUnique({ where: { id, userId } });
    if (!analysis) notFound();

    const fileLink = analysis.fileUrl; 
    const isImage = !!analysis.fileName.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/i);

    // We add a timestamp to the URL to force the browser to refresh the image
    const cacheBusterUrl = fileLink ? `${fileLink}?t=${new Date().getTime()}` : null;

    return (
        <main className="p-10 max-w-4xl mx-auto bg-white min-h-screen shadow-sm border border-slate-100 text-black">
            {/* Header Section */}
            <div className="border-b pb-6 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-indigo-600" /> {analysis.fileName}
                    </h1>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                        <Calendar size={14} /> Analyzed on {new Date(analysis.createdAt).toLocaleDateString("en-IN")}
                    </p>
                </div>
                {fileLink && (
                    <a href={fileLink} target="_blank" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg">
                        <Download size={18} /> Download Original File
                    </a>
                )}
            </div>

            {/* PREVIEW SECTION: Forced reload logic */}
            <div className="mb-10 p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex justify-center items-center min-h-[300px]">
                {cacheBusterUrl && isImage ? (
                    <img 
                        src={cacheBusterUrl} 
                        alt="Research Input" 
                        className="max-h-[450px] w-auto rounded-lg shadow-xl border-4 border-white object-contain"
                    />
                ) : (
                    <div className="text-slate-400 text-center">
                        <p className="italic">Preview not available for this file type.</p>
                        <p className="text-xs mt-2">Use the download button to view the file.</p>
                    </div>
                )}
            </div>

            {/* AI CONTENT SECTION */}
            <div className="relative p-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold uppercase tracking-widest text-xs">
                    <Zap size={16} /> Analysis Result
                </div>
                <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed">
                    <ReactMarkdown>{analysis.content}</ReactMarkdown>
                </div>
            </div>
        </main>
    );
}