"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function analyzeMedia(formData: FormData) {
    const { userId } = await auth();

    // 1. Check Authentication
    if (!userId) {
        return { success: false, error: "You must be signed in to perform analysis." };
    }

    const file = formData.get("file") as File;
    const prompt = formData.get("prompt") as string;

    // Validate inputs
    if (!file || file.size === 0) {
        return { success: false, error: "No file selected or file is empty." };
    }
    if (!prompt) {
        return { success: false, error: "Please provide a prompt for the AI." };
    }

    try {
        // 2. Upload to Cloudinary
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadRes = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "smart_digest_research" // Organizes your uploads in Cloudinary
                },
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            ).end(buffer);
        }) as any;

        if (!uploadRes.secure_url) {
            throw new Error("Failed to get secure URL from Cloudinary");
        }

        // 3. Call FastAPI Backend with the Cloudinary URL
        const aiRes = await fetch(`${process.env.FASTAPI_BACKEND_URL}/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file_url: uploadRes.secure_url,
                prompt: prompt
            }),
        });

        if (!aiRes.ok) {
            const errorData = await aiRes.json();
            throw new Error(errorData.detail || "FastAPI Backend Error");
        }

        const data = await aiRes.json();

        // 4. Save Record to Neon Database via Prisma
        const savedAnalysis = await prisma.analysis.create({
            data: {
                userId,
                fileName: file.name,
                fileUrl: uploadRes.secure_url,
                // Extracting file extension for the UI badge
                fileType: file.name.split('.').pop()?.toUpperCase() || "FILE",
                prompt,
                content: data.analysis || "No analysis content returned.",
            },
        });

        // 5. Refresh History page data
        revalidatePath("/history");

        return {
            success: true,
            analysis: data.analysis,
            id: savedAnalysis.id
        };

    } catch (err: any) {
        console.error("Analysis Action Error:", err.message);
        return {
            success: false,
            error: err.message || "An unexpected server error occurred."
        };
    }
}