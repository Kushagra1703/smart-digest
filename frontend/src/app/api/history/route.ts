import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const history = await prisma.analysis.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        // Explicitly return JSON so the frontend doesn't get HTML
        return NextResponse.json(history);
    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json([], { status: 500 });
    }
}