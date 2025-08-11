"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [analysis, setAnalysis] = useState<any>(null)
    const [isUploading, setIsUploading] = useState(false)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            setPreviewUrl(URL.createObjectURL(selectedFile))
        }
    }

    async function uploadImage(file: File) {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("You must be signed in to upload")

        const filename = `${user.id}/${Date.now()}_${file.name}`

        const { data, error } = await supabase.storage
            .from("meal-images")
            .upload(filename, file, { cacheControl: "3600", upsert: false })

        if (error) throw error
        return data.path
    }

    async function saveMealRecord(path: string, analysis: any) {
        const {
            data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { error } = await supabase.from("meal_history").insert({
            user_id: user.id,
            image_path: path,
            foods: analysis.foods,
            calories: analysis.calories,
            macros: analysis.macros,
            tips: analysis.tips,
        })

        if (error) throw error
    }

    async function handleAnalyze() {
        if (!file) return
        try {
            setIsUploading(true)
            toast.loading("Uploading image...")

            const path = await uploadImage(file)

            // TODO: Replace with actual AI analysis
            const aiResult = {
                foods: ["Grilled chicken", "Brown rice", "Broccoli"],
                calories: 520,
                macros: { protein: 45, carbs: 50, fats: 12 },
                tips: ["Add more greens", "Reduce oil for fewer calories"],
            }

            await saveMealRecord(path, aiResult)

            setAnalysis(aiResult)
            toast.success("Meal uploaded and analyzed!")
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <ProtectedRoute>


            <div className="max-w-3xl mx-auto p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload a Meal Photo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        {previewUrl && (
                            <Image
                                src={previewUrl}
                                alt="Preview"
                                width={400}
                                height={300}
                                className="rounded-md"
                            />
                        )}
                        <Button onClick={handleAnalyze} disabled={!file || isUploading}>
                            {isUploading ? "Processing..." : "Analyze Meal"}
                        </Button>
                    </CardContent>
                </Card>

                {analysis && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Result</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Foods:</strong> {analysis.foods.join(", ")}</p>
                            <p><strong>Calories:</strong> {analysis.calories} kcal</p>
                            <p><strong>Macros:</strong></p>
                            <ul className="list-disc list-inside">
                                <li>Protein: {analysis.macros.protein}g</li>
                                <li>Carbs: {analysis.macros.carbs}g</li>
                                <li>Fats: {analysis.macros.fats}g</li>
                            </ul>
                            <p><strong>Tips:</strong></p>
                            <ul className="list-disc list-inside">
                                {analysis.tips.map((tip: string, i: number) => (
                                    <li key={i}>{tip}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </ProtectedRoute>
    )
}
