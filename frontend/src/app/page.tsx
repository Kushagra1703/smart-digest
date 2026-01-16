"use client";
import { useState } from "react";
import { analyzeMedia } from "@/actions/analyze";
import ReactMarkdown from "react-markdown";

export default function SmartDigestPage() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setResult(""); // Clear previous results immediately

        try {
            const formData = new FormData(e.currentTarget);
            const response = await analyzeMedia(formData);

            // DEBUG: Open Browser Console (F12) to see this
            console.log("Full Server Response:", response);

            if (response && response.success) {
                setResult(response.analysis || "AI processed it, but returned no text.");
            } else {
                alert("Error from Action: " + (response?.error || "Unknown"));
            }
        } catch (err) {
            // We cast it to Error to access the .message property safely
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            alert("System Error: " + errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold italic">SmartDigest AI</h1>
                    <p className="text-gray-400">Upload any Doc, Audio, Photo, or Video for instant research.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-xl border border-gray-800">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Choose File</label>
                        <input
                            type="file"
                            name="file"
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Analysis Prompt</label>
                        <input
                            type="text"
                            name="prompt"
                            placeholder="e.g., Summarize this document into 5 bullet points..."
                            className="w-full bg-black border border-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 py-3 rounded-lg font-bold transition"
                    >
                        {loading ? "AI is thinking..." : "Run SmartDigest"}
                    </button>
                </form>

                {/* Visible result area with high contrast for testing */}
                {result && (
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 prose prose-invert max-w-none shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Analysis Result</h2>
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                )}
            </div>
        </main>
    );
}