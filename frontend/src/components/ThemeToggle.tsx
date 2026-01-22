"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // 1. Prevent Hydration Mismatch
    // We only show the toggle after the page has fully loaded in the browser
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-9 h-9" />; // Placeholder to avoid layout shift
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative p-2 rounded-xl bg-slate-200 dark:bg-zinc-800 transition-all duration-500 hover:ring-2 hover:ring-primary/20"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ y: -20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.2 }}
                        className="text-violet-400"
                    >
                        <Moon size={20} fill="currentColor" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: -20, opacity: 0, rotate: 45 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: -45 }}
                        transition={{ duration: 0.2 }}
                        className="text-indigo-600"
                    >
                        <Sun size={20} fill="currentColor" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}