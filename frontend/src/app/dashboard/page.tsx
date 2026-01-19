"use client";
import { useState } from "react";
import { analyzeMedia } from "@/actions/analyze";
import ReactMarkdown from "react-markdown";
import { FileSearch, Send, Loader2 } from "lucide-react";

export default function SmartDigestPage() {
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
    <div className="w-full flex flex-col items-center gap-8 py-10">
      {/* 1. Centered Analysis Box with Match Color Palette */}
      <div className="w-full max-w-2xl bg-[#0f172a] rounded-2xl p-8 shadow-2xl border border-slate-800">
        <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FileSearch size={20} />
          </div>
          New Research Analysis
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom File Input for Visibility */}
          <div className="group relative bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              name="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="text-slate-400 flex flex-col items-center gap-2">
              <span className="text-indigo-400 font-medium">Click to upload</span>
              <span className="text-xs">PDF, MP3, JPG, or MP4 supported</span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              name="prompt"
              placeholder="Ask something about this file..."
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing Document...
              </>
            ) : (
              <>
                <Send size={18} />
                Run SmartDigest
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. Result Display with Matching Indigo Accents */}
      {result && (
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b">
            <div className="w-2 h-6 bg-indigo-600 rounded-full" />
            <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
              Analysis Result
            </h3>
          </div>
          <div className="prose prose-indigo max-w-none text-slate-600 leading-relaxed">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}