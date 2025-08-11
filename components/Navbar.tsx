"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const pathname = usePathname()

    const links = [
        { href: "/", label: "Home" },
        { href: "/upload", label: "Upload" },
        { href: "/history", label: "History" },
    ]

    return (
        <header className="border-b bg-background">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    🍴 Forkcast
                </Link>

                <nav className="hidden md:flex gap-6">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button>Sign Up</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
