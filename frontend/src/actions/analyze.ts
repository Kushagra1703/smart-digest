"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function analyzeMedia(formData: FormData) {
    try {
        // 1. Get the current user's ID from Clerk
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: "You must be signed in to analyze files." };
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        // 2. Call your FastAPI Backend
        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Backend failed to process file.");
        const data = await response.json();

        // 3. Save the result to Neon with the real userId
        await prisma.analysis.create({
            data: {
                fileName: (formData.get("file") as File).name,
                fileType: (formData.get("file") as File).type,
                prompt: formData.get("prompt") as string,
                content: data.analysis,
                userId: userId, // Link to Clerk
            },
        });

        // 4. Update the UI history sidebar
        revalidatePath("/dashboard");

        return { success: true, analysis: data.analysis };

    } catch (error) {
        console.error("Analysis Error:", error);
        return { success: false, error: "Something went wrong during analysis." };
    }
}