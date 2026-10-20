"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

type GoHomeButtonProps = {
    /**
     * Positioning classes. Defaults to the top-right corner of the nearest
     * `relative` parent. Pass your own (e.g. "fixed top-[20px] right-3") when a
     * page needs a different spot.
     */
    className?: string;
};

export default function GoHomeButton({
    className = "absolute top-1.5 right-3 z-20",
}: GoHomeButtonProps) {
    const pathname = usePathname();

    // The home page already has its own navbar link.
    if (pathname === "/") return null;

    return (
        <Link
            href="/"
            aria-label="Go to home page"
            title="Go to Home"
            className={`${className} flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
        >
            <Home size={16} />
        </Link>
    );
}
