"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const validateForm = () => {
        if (!email.includes("@")) return "Invalid email format"
        if (password.length < 6) return "Password must be at least 6 characters"
        return ""
    }

    const handleLogin = async () => {
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setError("")
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError(error.message)
        } else {
            toast.success("Login successful!")
            router.push("/upload") // redirect to upload page after login
        }
        setLoading(false)
    }

    return (
        <div className="max-w-md mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
