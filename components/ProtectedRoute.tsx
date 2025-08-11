"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        }
    }, [loading, user, router])

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>
    }

    if (!user) return null // redirecting

    return <>{children}</>
}
