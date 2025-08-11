import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 py-20 text-center space-y-10">
        {/* Hero Section */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Track Your Meals with{" "}
          <span className="text-primary">AI Precision</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a photo of your meal and get instant nutritional insights,
          powered by advanced AI vision. Stay on top of your health journey
          effortlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/upload">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/history">
            <Button size="lg" variant="outline">
              View History
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <section className="grid sm:grid-cols-3 gap-8 mt-20">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📸 Easy Uploads</h3>
            <p className="text-muted-foreground">
              Snap a picture of your meal, and we’ll handle the rest.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">🤖 AI-Powered Analysis</h3>
            <p className="text-muted-foreground">
              Get accurate food recognition, calorie counts, and health tips.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">📊 Progress Tracking</h3>
            <p className="text-muted-foreground">
              View your meal history and monitor your nutrition over time.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
