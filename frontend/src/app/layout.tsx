import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from "next/link"; // Required for the dashboard shortcut

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartDigest - AI Research Tool",
  description: "BCA Final Year Project using Gemini & Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-between items-center p-4 border-b bg-white">
            <div className="flex items-center gap-6">
              {/* Clicking the Logo takes you Home */}
              <Link href="/">
                <h1 className="font-bold text-xl text-indigo-600 cursor-pointer">
                  SmartDigest
                </h1>
              </Link>

              {/* Dashboard Shortcut visible only when Signed In */}
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  My Research
                </Link>
              </SignedIn>
            </div>

            <div className="flex gap-4 items-center">
              <SignedOut>
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                  <SignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>

          {/* The main page content */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}