import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk currently requires this to be in a file named middleware.ts
export default clerkMiddleware();

export const config = {
  matcher: [
    // Protects all routes except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};