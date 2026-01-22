import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartDigest - AI Research Tool",
  description: "BCA Final Year Project by Kushagra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground transition-colors duration-500`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <header className="flex justify-between items-center p-4 border-b border-border bg-card sticky top-0 z-50 transition-colors duration-500">
              <div className="flex items-center gap-8">
                <Link href="/">
                  <h1 className="font-black text-2xl text-primary cursor-pointer tracking-tighter">
                    SmartDigest
                  </h1>
                </Link>

                <SignedIn>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/dashboard"
                      className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      Analyse
                    </Link>
                    {/* Points to your new History page */}
                    <Link
                      href="/history"
                      className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                    >
                      My Research
                    </Link>
                  </nav>
                </SignedIn>
              </div>

              <div className="flex gap-4 items-center">
                <ThemeToggle />
                
                <SignedOut>
                  <div className="bg-primary text-white px-5 py-2.5 rounded-2xl text-sm font-black hover:opacity-90 transition shadow-lg shadow-primary/20">
                    <SignInButton />
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </header>

            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}