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

    const formData = new FormData(e.currentTarget);
    const response = await analyzeMedia(formData);

    if (response.success) {
      setResult(response.analysis);
    }
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Support for all formats: PDF, MP3, JPG, MP4 */}
        <input type="file" name="file" className="block w-full border p-2" required />
        <input 
          type="text" 
          name="prompt" 
          placeholder="Ask something about this file..." 
          className="block w-full border p-2 text-black" 
          required 
        />
        <button disabled={loading} className="bg-blue-600 text-white p-2 rounded">
          {loading ? "Analyzing..." : "Analyze File"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-black">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}