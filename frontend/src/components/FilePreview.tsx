"use client"; // This allows the component to handle browser events like onError

import { Eye, FileWarning } from "lucide-react";

export default function FilePreview({ url, isImage }: { url: string | null; isImage: boolean }) {
    if (!url || !isImage) {
        return (
            <div className="text-slate-400 flex flex-col items-center gap-2 text-center p-6">
                <FileWarning size={32} className="text-slate-300" />
                <p className="text-sm italic">
                    Preview only available for images. Use the download button above.
                </p>
            </div>
        );
    }

    return (
        <img 
            src={url} 
            alt="Research upload" 
            className="max-h-[500px] w-auto object-contain p-2 shadow-sm"
            onError={(e) => {
                // If the image fails to load, we hide it to prevent a broken icon
                e.currentTarget.style.display = 'none';
            }}
        />
    );
}