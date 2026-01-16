"use server";

export async function analyzeMedia(formData: FormData) {
    try {
        // 1. Get the Backend URL from environment variables
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

        // 2. Send the FormData (file + prompt) to FastAPI
        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            body: formData,
        });

        // 3. Handle HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Failed to communicate with AI Backend");
        }

        // 4. Parse the JSON and Log for Debugging
        const data = await response.json();
        console.log("Raw Data from Backend:", data); // Check your VS Code Terminal

        // 5. Flexible Return
        return {
            success: true,
            analysis: data.analysis || data.message || "AI processed it, but returned no text."
        };

    } catch (error) {
        // 6. Safe error handling for TypeScript
        const errorMessage = error instanceof Error ? error.message : "Something went wrong during analysis";
        console.error("Analysis Action Error:", errorMessage);

        return {
            success: false,
            error: errorMessage
        };
    }
}