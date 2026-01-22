"use client";

import { useState } from "react";
import { analyzeMedia } from "@/actions/analyze";
import ReactMarkdown from "react-markdown";
import { FileSearch, Send, Loader2, Sparkles, ShieldCheck, History } from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await analyzeMedia(formData);

    if (response.success) {
      setResult(response.analysis);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-10 py-12 px-6 transition-colors duration-500">
      
      {/* Centered Analysis Card */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
        
        <div className="relative">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-primary/10 p-4 rounded-3xl mb-4">
              <FileSearch className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              SmartDigest Analysis
            </h2>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              Upload your media for AI-powered insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group relative bg-background/50 border-2 border-dashed border-border rounded-3xl p-10 text-center hover:border-primary/50 transition-all cursor-pointer">
              <input
                type="file"
                name="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className="text-muted-foreground flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-foreground font-bold text-lg">Choose your file</p>
                  <p className="text-xs font-medium opacity-70">Supports PDF, Audio, Photo, or Video</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                name="prompt"
                placeholder="Ex: Summarize this document..."
                className="w-full p-5 rounded-2xl bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                required
              />

              <button
                disabled={loading}
                className="w-full py-5 bg-primary hover:opacity-90 disabled:bg-muted disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>AI is thinking...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Run SmartDigest</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Instant Result View */}
      {result && (
        <div className="w-full max-w-4xl bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full" />
              <h3 className="font-black text-foreground uppercase text-xs tracking-[0.2em]">Analysis Result</h3>
            </div>
            <Link href="/history" className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
              <History size={14} />
              VIEW IN HISTORY
            </Link>
          </div>
          <div className="prose prose-indigo dark:prose-invert max-w-none prose-p:text-lg">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}