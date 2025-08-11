"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

export function Navbar() {
    const pathname = usePathname()
    const [user, setUser] = useState<any>(null)

    // Check auth state on mount + listen for changes
    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser()
            setUser(data.user)
        }
        getUser()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    const links = [
        { href: "/", label: "Home" },
        { href: "/upload", label: "Upload" },
        { href: "/history", label: "History" },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

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
                    {user ? (
                        <>
                            <span className="hidden sm:inline text-sm text-muted-foreground">
                                {user.email}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
