"use server";

import { prisma } from "@/lib/prisma"; 
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function analyzeMedia(formData: FormData) {
    try {
        const { userId } = await auth();
        if (!userId) return { success: false, error: "Please sign in." };

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error("Backend failed.");
        const data = await response.json();

        // 3. Save to Neon (Single block, verified)
        await prisma.analysis.create({
            data: {
                fileName: (formData.get("file") as File).name,
                fileType: (formData.get("file") as File).type,
                // data.fileUrl comes from your updated FastAPI backend
                fileUrl: data.fileUrl || "", 
                prompt: formData.get("prompt") as string,
                content: data.analysis,
                userId: userId, 
            },
        });

        revalidatePath("/dashboard");
        return { success: true, analysis: data.analysis };

    } catch (error) {
        return { success: false, error: "Analysis failed." };
    }
}