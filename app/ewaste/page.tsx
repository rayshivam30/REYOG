"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Camera,
  Zap,
  DollarSign,
  Recycle,
  ArrowLeft,
  Smartphone,
  Laptop,
  Monitor,
  Cpu,
  Leaf,
  Award,
  BarChart3,
  Globe,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function EWastePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Mock AI analysis results
  const mockAnalysis = {
    detectedDevices: [
      { type: "smartphone", count: 15, confidence: 0.95 },
      { type: "laptop", count: 8, confidence: 0.92 },
      { type: "tablet", count: 5, confidence: 0.88 },
      { type: "motherboard", count: 12, confidence: 0.91 },
      { type: "hard_drive", count: 20, confidence: 0.89 },
    ],
    preciousMetals: {
      gold: { amount: 2.4, unit: "grams", value: 156.8 },
      silver: { amount: 45.2, unit: "grams", value: 32.1 },
      platinum: { amount: 0.8, unit: "grams", value: 28.4 },
      palladium: { amount: 1.2, unit: "grams", value: 89.6 },
      copper: { amount: 1250, unit: "grams", value: 11.2 },
    },
    totalValue: 318.1,
    environmentalImpact: {
      co2Avoided: 145.6,
      energySaved: 2340,
      waterSaved: 890,
    },
    recommendations: [
      "Separate smartphones for specialized processing",
      "Extract motherboards for precious metal recovery",
      "Recycle plastic components through certified facilities",
      "Consider refurbishment for newer devices",
    ],
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        // Simulate AI analysis
        setIsAnalyzing(true)
        setTimeout(() => {
          setAnalysisResults(mockAnalysis)
          setIsAnalyzing(false)
        }, 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="h-5 w-5" />
      case "laptop":
        return <Laptop className="h-5 w-5" />
      case "tablet":
        return <Monitor className="h-5 w-5" />
      case "motherboard":
        return <Cpu className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-professional">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover-lift">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <Recycle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  E-Waste Analysis Service
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Detection & Recovery</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="px-4 py-2 shadow-sm">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Detection
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              AI-Powered E-Waste Analysis
            </h1>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Upload images of your electronic waste and get instant analysis of device types, precious metal content,
              and potential value using advanced computer vision and machine learning.
            </p>
          </div>

          <Tabs defaultValue="upload" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload & Analyze</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="results"
                disabled={!analysisResults}
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analysis Results</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                disabled={!analysisResults}
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Recommendations</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                      <Upload className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Upload E-Waste Images</CardTitle>
                  </div>
                  <CardDescription>
                    Take or upload clear photos of your electronic waste for AI analysis using YOLOv8 object detection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-gradient-to-br from-muted/20 to-card/50">
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded e-waste"
                            className="max-w-md mx-auto rounded-xl shadow-professional"
                          />
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="outline"
                              className="shadow-sm hover-lift bg-transparent"
                              onClick={() => {
                                setUploadedImage(null)
                                setAnalysisResults(null)
                              }}
                            >
                              Upload Different Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-primary to-chart-2 rounded-2xl w-fit shadow-lg">
                            <Upload className="h-12 w-12 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold mb-3">Upload E-Waste Images</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Drag and drop images here, or click to browse. Our AI will identify devices and estimate
                            recovery potential.
                          </p>
                          <div className="flex justify-center space-x-3">
                            <Button asChild className="shadow-sm">
                              <label htmlFor="image-upload" className="cursor-pointer">
                                <Camera className="mr-2 h-4 w-4" />
                                Choose Images
                                <input
                                  id="image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleImageUpload}
                                />
                              </label>
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-4">
                            Supported formats: JPG, PNG, WebP (Max 10MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Analysis Progress */}
                    {isAnalyzing && (
                      <Card className="shadow-professional border-0 bg-gradient-to-r from-card to-muted/20">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center text-xl">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg mr-3">
                              <Zap className="h-5 w-5 text-white animate-pulse" />
                            </div>
                            AI Analysis in Progress
                          </CardTitle>
                          <CardDescription>
                            Processing your e-waste images with advanced computer vision...
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span>YOLOv8 Object Detection</span>
                              <span className="text-primary">Processing...</span>
                            </div>
                            <Progress value={75} className="h-3 shadow-sm" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span>Precious Metal Estimation</span>
                              <span className="text-chart-2">Calculating...</span>
                            </div>
                            <Progress value={45} className="h-3 shadow-sm" />
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span>Market Price Analysis</span>
                              <span className="text-chart-3">Fetching...</span>
                            </div>
                            <Progress value={20} className="h-3 shadow-sm" />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        {
                          title: "Images Processed",
                          value: "12,847",
                          icon: Camera,
                          color: "from-blue-500 to-cyan-500",
                        },
                        {
                          title: "Devices Detected",
                          value: "89,234",
                          icon: Cpu,
                          color: "from-green-500 to-emerald-500",
                        },
                        {
                          title: "Total Value Estimated",
                          value: "$2.4M",
                          icon: DollarSign,
                          color: "from-yellow-500 to-orange-500",
                        },
                        { title: "CO₂ Avoided", value: "156t", icon: Leaf, color: "from-green-600 to-teal-600" },
                      ].map((stat, index) => (
                        <Card
                          key={index}
                          className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                              <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-sm`}>
                                <stat.icon className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-6 animate-fade-in-up">
              {analysisResults && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        title: "Total Estimated Value",
                        value: `$${analysisResults.totalValue.toFixed(2)}`,
                        color: "from-green-500 to-emerald-500",
                        icon: DollarSign,
                      },
                      {
                        title: "Devices Detected",
                        value: analysisResults.detectedDevices.reduce(
                          (sum: number, device: any) => sum + device.count,
                          0,
                        ),
                        color: "from-blue-500 to-cyan-500",
                        icon: Cpu,
                      },
                      {
                        title: "CO₂ Avoided",
                        value: `${analysisResults.environmentalImpact.co2Avoided}kg`,
                        color: "from-green-600 to-teal-600",
                        icon: Leaf,
                      },
                      {
                        title: "Confidence Score",
                        value: "92%",
                        color: "from-purple-500 to-indigo-500",
                        icon: Award,
                      },
                    ].map((stat, index) => (
                      <Card
                        key={index}
                        className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                            <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-sm`}>
                              <stat.icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{stat.value}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                          <Cpu className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Detected Devices</CardTitle>
                      </div>
                      <CardDescription>AI-identified electronic devices in your uploaded images</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults.detectedDevices.map((device: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-6 border-0 bg-gradient-to-r from-card to-muted/20 rounded-xl shadow-sm hover-lift animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-gradient-to-br from-primary to-chart-2 rounded-lg shadow-sm">
                                {getDeviceIcon(device.type)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg capitalize">
                                  {device.type.replace("_", " ")} ({device.count})
                                </h4>
                                <p className="text-muted-foreground">
                                  Confidence: {(device.confidence * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className="px-4 py-2 shadow-sm">
                              {device.count} units
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Precious Metal Content</CardTitle>
                      </div>
                      <CardDescription>Estimated precious metal recovery potential and market value</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {Object.entries(analysisResults.preciousMetals).map(([metal, data]: [string, any], index) => (
                          <Card
                            key={metal}
                            className="text-center p-6 shadow-sm border-0 bg-gradient-to-br from-muted/20 to-card/50 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="text-3xl mb-3">
                              {metal === "gold" && "🥇"}
                              {metal === "silver" && "🥈"}
                              {metal === "platinum" && "⚪"}
                              {metal === "palladium" && "⚫"}
                              {metal === "copper" && "🟤"}
                            </div>
                            <h4 className="font-semibold capitalize mb-2 text-lg">{metal}</h4>
                            <p className="text-muted-foreground mb-2">
                              {data.amount} {data.unit}
                            </p>
                            <p className="text-lg font-bold text-green-600">${data.value.toFixed(2)}</p>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                          <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Environmental Impact</CardTitle>
                      </div>
                      <CardDescription>Positive environmental effects of proper e-waste recycling</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          {
                            value: `${analysisResults.environmentalImpact.co2Avoided}kg`,
                            label: "CO₂ Emissions Avoided",
                            color: "text-green-600",
                            bgColor: "from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900",
                          },
                          {
                            value: `${analysisResults.environmentalImpact.energySaved.toLocaleString()}kWh`,
                            label: "Energy Saved",
                            color: "text-blue-600",
                            bgColor: "from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900",
                          },
                          {
                            value: `${analysisResults.environmentalImpact.waterSaved}L`,
                            label: "Water Saved",
                            color: "text-cyan-600",
                            bgColor: "from-cyan-50 to-teal-100 dark:from-cyan-950 dark:to-teal-900",
                          },
                        ].map((impact, index) => (
                          <div
                            key={index}
                            className={`text-center p-6 rounded-xl bg-gradient-to-br ${impact.bgColor} animate-fade-in-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className={`text-4xl font-bold ${impact.color} mb-3`}>{impact.value}</div>
                            <p className="text-sm font-medium text-muted-foreground">{impact.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-6 animate-fade-in-up">
              {analysisResults && (
                <>
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Processing Recommendations</CardTitle>
                      </div>
                      <CardDescription>
                        AI-generated recommendations for optimal e-waste processing and value recovery
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analysisResults.recommendations.map((recommendation: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-gradient-to-r from-muted/20 to-card/50 rounded-lg animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="h-3 w-3 bg-gradient-to-r from-primary to-chart-2 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm leading-relaxed">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Next Steps</CardTitle>
                      </div>
                      <CardDescription>Recommended actions to maximize value and environmental benefit</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Button className="shadow-sm">
                          <DollarSign className="mr-2 h-4 w-4" />
                          List on Marketplace
                        </Button>
                        <Button variant="outline" className="shadow-sm hover-lift bg-transparent">
                          <Recycle className="mr-2 h-4 w-4" />
                          Find Recycling Partners
                        </Button>
                        <Button variant="outline" className="shadow-sm hover-lift bg-transparent">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Export Analysis Report
                        </Button>
                        <Button variant="outline" className="shadow-sm hover-lift bg-transparent">
                          <Globe className="mr-2 h-4 w-4" />
                          Share Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
