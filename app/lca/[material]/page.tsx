"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Leaf, ArrowRight } from "lucide-react"

export default function MaterialLanding({ params }: { params: { material: string } }) {
  const router = useRouter()
  const material = decodeURIComponent(params.material || "")

  const pretty = material
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")

  const goToWizard = () => {
    router.push(`/lca?material=${encodeURIComponent(pretty)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{pretty} LCA</h1>
                <p className="text-sm text-muted-foreground">Material-specific analysis landing</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary">ISO 14040</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">{pretty} Life Cycle Assessment</CardTitle>
              <CardDescription>
                Start an ISO 14040-aligned assessment focused on {pretty}. You can upload documents or enter data
                manually. The wizard will be prefilled for this material.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="shadow-sm" onClick={goToWizard}>
                Proceed to LCA Wizard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Link href="/lca">
                <Button size="lg" variant="outline" className="shadow-sm">
                  Choose Another Material
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
