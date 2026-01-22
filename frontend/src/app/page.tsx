"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <section className="relative pt-20 pb-32 px-6">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full opacity-10 dark:opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8">
              <Sparkles size={16} />
              <span>BCA Final Year Project • Powered by Gemini 3 Flash</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Digest Research <br />
              <span className="text-primary italic">In Seconds.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12">
              The intelligent AI tool that analyzes documents, audio, images, and video with deep multimodal understanding.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignedOut>
                {/* Redirects to Sign Up as it is required for analysis */}
                <Link href="/sign-up" className="w-full sm:w-auto px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Start Analysis Free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </SignedOut>
              
              <SignedIn>
                {/* Your requested "Analyse" button */}
                <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-primary text-white text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                  Analyse Now
                  <Zap className="group-hover:scale-110 transition-transform" />
                </Link>
              </SignedIn>

              <Link href="/history" className="w-full sm:w-auto px-10 py-5 bg-card border border-border text-lg font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                View History
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-6 bg-card/30 border-t border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 space-y-4 bg-background rounded-3xl border border-border shadow-sm">
                <Layers className="mx-auto text-primary" size={32} />
                <h3 className="text-xl font-black">Multimodal</h3>
                <p className="text-muted-foreground text-sm font-medium">Analyze PDF, JPG, MP3, and MP4 files instantly.</p>
            </div>
            <div className="p-8 space-y-4 bg-background rounded-3xl border border-border shadow-sm">
                <Zap className="mx-auto text-primary" size={32} />
                <h3 className="text-xl font-black">Fast Analysis</h3>
                <p className="text-muted-foreground text-sm font-medium">Get deep insights and summaries in under 5 seconds.</p>
            </div>
            <div className="p-8 space-y-4 bg-background rounded-3xl border border-border shadow-sm">
                <Shield className="mx-auto text-primary" size={32} />
                <h3 className="text-xl font-black">Secure Cloud</h3>
                <p className="text-muted-foreground text-sm font-medium">All research is safely stored in Neon PostgreSQL.</p>
            </div>
        </div>
      </section>
    </main>
  );
}