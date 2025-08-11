"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabaseClient"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function HistoryPage() {
    const [meals, setMeals] = useState<any[]>([])

    useEffect(() => {
        async function fetchMeals() {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from("meal_history")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) {
                console.error(error)
                return
            }

            // Fetch signed URLs for each image
            const mealsWithUrls = await Promise.all(
                data.map(async (meal) => {
                    const { data: urlData } = await supabase.storage
                        .from("meal-images")
                        .createSignedUrl(meal.image_path, 3600)

                    return { ...meal, image_url: urlData?.signedUrl }
                })
            )

            setMeals(mealsWithUrls)
        }

        fetchMeals()
    }, [])

    return (
        <ProtectedRoute>
            <div className="max-w-3xl mx-auto p-6 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Meal History</h1>
                {meals.length === 0 ? (
                    <p>No meals found.</p>
                ) : (
                    meals.map((meal) => (
                        <Card key={meal.id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={meal.image_url} alt="Meal" />
                                    <AvatarFallback>🍽️</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{meal.foods?.join(", ")}</CardTitle>
                                    <p className="text-sm text-gray-500">
                                        {new Date(meal.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Calories:</strong> {meal.calories} kcal</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </ProtectedRoute>
    )
}
