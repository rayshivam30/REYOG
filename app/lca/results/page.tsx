"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ChartContainer } from "@/components/ui/chart-container"
import { ChartTooltip } from "@/components/ui/chart-tooltip"
import {
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  Leaf,
  Droplets,
  Zap,
  Globe,
  Shield,
  TrendingDown,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Recycle,
  Factory,
  Users,
  FileText,
  Calculator,
  Target,
} from "lucide-react"
import Link from "next/link"
import { governmentDB } from "@/lib/government-database"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value?: number;
    payload: {
      name?: string;
      value?: number;
      color?: string;
    };
  }>;
  label?: string;
}

// Custom tooltip content for the waste composition chart
const ChartTooltipContent = ({ active, payload }: ChartTooltipContentProps) => {
  if (!active || !payload || !payload.length || !payload[0]?.payload) return null;
  
  const data = payload[0].payload;
  const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0);
  const displayValue = data.value ?? 0;
  
  return (
    <div className="space-y-2 p-2 bg-card border rounded-md shadow-sm">
      <p className="font-medium">{data.name || 'N/A'}</p>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">Amount:</span>
        <span className="font-medium">{displayValue.toLocaleString()} kg CO₂e</span>
      </div>
      {total > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Percentage:</span>
          <span className="font-medium">{((displayValue / total) * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

interface EmissionsData {
  category: string;
  conventional: number;
  sustainable: number;
  reduction: number;
}

export default function LCAResultsPage() {
  const [selectedMethod, setSelectedMethod] = useState<"conventional" | "sustainable">("conventional")
  const [comparisonView, setComparisonView] = useState(false)
  const [govBadges, setGovBadges] = useState<{
    electricity?: { value: number; source: string; quality: string }
    water?: { value: number; source: string; quality: string }
    mineral?: { value: number; source: string; quality: string }
  }>({})

  // Load a few mock factors from governmentDB for display badges
  useEffect(() => {
    let mounted = true
    async function load() {
      const electricityVal = await governmentDB.getElectricityEmissionFactor("United States")
      const waterVal = await governmentDB.getWaterStressFactor("North America")
      const mineralVal = await governmentDB.getMineralDepletionFactor("Aluminum")
      if (mounted) {
        setGovBadges({
          electricity: { value: electricityVal, source: "EPA Emission Factors", quality: "A" },
          water: { value: waterVal, source: "World Bank Environmental Data", quality: "A" },
          mineral: { value: mineralVal, source: "USGS Mineral Statistics", quality: "A" },
        })
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Emissions by category data with calculated reduction percentage
  const emissionsByCategory = [
    { category: 'Mining', conventional: 1200, sustainable: 800 },
    { category: 'Processing', conventional: 1800, sustainable: 1000 },
    { category: 'Transport', conventional: 600, sustainable: 400 },
    { category: 'Energy Use', conventional: 2500, sustainable: 1200 },
    { category: 'Waste', conventional: 900, sustainable: 300 },
  ].map(item => ({
    ...item,
    reduction: Math.round(((item.conventional - item.sustainable) / item.conventional) * 100)
  }));

  // Mock LCA Results Data
  const lcaResults = {
    material: "Copper",
    functionalUnit: "1 tonne of refined copper",
    analysisDate: "2024-12-15",
    methodology: "ISO 14040/14044",
    systemBoundary: "Cradle-to-gate",
    
    conventional: {
      // Climate Change
      globalWarmingPotential: 4250, // kg CO2-eq
      
      // Air Pollution
      acidificationPotential: 18.5, // kg SO2-eq
      photochemicalOzoneCreation: 2.1, // kg C2H4-eq
      particulateMatterFormation: 3.8, // kg PM2.5-eq
      ozoneDepletionPotential: 0.00012, // kg CFC-11-eq
      
      // Water-Related Impacts
      eutrophicationPotential: 12.4, // kg PO4³⁻-eq
      freshwaterEcotoxicity: 145.2, // kg 1,4-DCB-eq
      marineEcotoxicity: 89.7, // kg 1,4-DCB-eq
      waterScarcityIndicator: 2340, // m³ water-eq
      
      // Human Health
      humanToxicityPotential: 234.5, // kg 1,4-DCB-eq
      respiratoryInorganics: 0.00045, // DALYs
      occupationalRisk: "Medium",
      
      // Resource Depletion
      mineralResourceDepletion: 0.85, // kg Sb-eq
      fossilFuelDepletion: 15600, // MJ
      waterDepletion: 2340, // m³-eq
      landUseImpact: 0.12, // ha·year
      
      // Biodiversity & Ecosystem
      terrestrialEcotoxicity: 0.89, // kg 1,4-DCB-eq
      landUseChange: 0.0034, // PDF·m²·year
      habitatAlteration: "Moderate",
      
      // Circularity Metrics
      recycledInputShare: 15, // %
      byproductReuse: 25, // kg/t
      wasteDiverted: 45, // %
      recyclingCredit: -180, // kg CO2 avoided/t
      productLifetime: 25, // years
      recyclability: 85, // %
      industrialSymbiosis: 2, // exchanges
    },
    
    sustainable: {
      // Climate Change
      globalWarmingPotential: 2890, // kg CO2-eq (32% reduction)
      
      // Air Pollution
      acidificationPotential: 11.2, // kg SO2-eq (39% reduction)
      photochemicalOzoneCreation: 1.3, // kg C2H4-eq (38% reduction)
      particulateMatterFormation: 2.1, // kg PM2.5-eq (45% reduction)
      ozoneDepletionPotential: 0.000075, // kg CFC-11-eq (37% reduction)
      
      // Water-Related Impacts
      eutrophicationPotential: 7.8, // kg PO4³⁻-eq (37% reduction)
      freshwaterEcotoxicity: 89.4, // kg 1,4-DCB-eq (38% reduction)
      marineEcotoxicity: 54.2, // kg 1,4-DCB-eq (40% reduction)
      waterScarcityIndicator: 1450, // m³ water-eq (38% reduction)
      
      // Human Health
      humanToxicityPotential: 142.8, // kg 1,4-DCB-eq (39% reduction)
      respiratoryInorganics: 0.00027, // DALYs (40% reduction)
      occupationalRisk: "Low",
      
      // Resource Depletion
      mineralResourceDepletion: 0.52, // kg Sb-eq (39% reduction)
      fossilFuelDepletion: 9200, // MJ (41% reduction)
      waterDepletion: 1450, // m³-eq (38% reduction)
      landUseImpact: 0.075, // ha·year (37% reduction)
      
      // Biodiversity & Ecosystem
      terrestrialEcotoxicity: 0.51, // kg 1,4-DCB-eq (43% reduction)
      landUseChange: 0.0019, // PDF·m²·year (44% reduction)
      habitatAlteration: "Low",
      
      // Circularity Metrics
      recycledInputShare: 65, // % (333% improvement)
      byproductReuse: 78, // kg/t (212% improvement)
      wasteDiverted: 85, // % (89% improvement)
      recyclingCredit: -520, // kg CO2 avoided/t (189% improvement)
      productLifetime: 35, // years (40% improvement)
      recyclability: 95, // % (12% improvement)
      industrialSymbiosis: 8, // exchanges (300% improvement)
    }
  }

  const impactCategories = [
    { name: "Climate Change", value: 6300, unit: "kg CO₂-eq", status: "high", trend: "down", improvement: 15 },
    { name: "Acidification", value: 45, unit: "kg SO₂-eq", status: "medium", trend: "down", improvement: 12 },
    { name: "Eutrophication", value: 12, unit: "kg PO₄³⁻-eq", status: "low", trend: "down", improvement: 8 },
    { name: "Ozone Depletion", value: 0.002, unit: "kg CFC-11-eq", status: "low", trend: "stable", improvement: 0 },
    { name: "Human Toxicity", value: 850, unit: "kg 1,4-DCB-eq", status: "medium", trend: "down", improvement: 18 },
    { name: "Water Scarcity", value: 25000, unit: "m³ water-eq", status: "high", trend: "up", improvement: -5 },
  ]

  const circularityMetrics = [
    { name: "Recycled Content", current: 35, target: 50, unit: "%" },
    { name: "Recyclability", current: 85, target: 90, unit: "%" },
    { name: "Waste Diversion", current: 78, target: 85, unit: "%" },
    { name: "Material Efficiency", current: 92, target: 95, unit: "%" },
  ]

  const timelineData = [
    { year: 2020, emissions: 7200, water: 28000, waste: 1200 },
    { year: 2021, emissions: 6800, water: 26500, waste: 1100 },
    { year: 2022, emissions: 6500, water: 25800, waste: 1000 },
    { year: 2023, emissions: 6300, water: 25000, waste: 950 },
    { year: 2024, emissions: 5900, water: 24200, waste: 850 },
  ]

  const wasteComposition = [
    { name: "Tailings", value: 65, color: "#8b5cf6" },
    { name: "Slag", value: 20, color: "#3b82f6" },
    { name: "Process Water", value: 10, color: "#22c55e" },
    { name: "Other", value: 5, color: "#eab308" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Impact</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/lca">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Analysis
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">LCA Results - Aluminum</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Executive Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Executive Summary
              </CardTitle>
              <CardDescription>Comprehensive LCA results for aluminum production (10,000 t/yr)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-5 mb-1">6,300</div>
                  <div className="text-sm text-muted-foreground">kg CO₂-eq/t</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">15% reduction</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-2 mb-1">25,000</div>
                  <div className="text-sm text-muted-foreground">m³ water/t</div>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                    <span className="text-sm text-red-600">5% increase</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-3 mb-1">85%</div>
                  <div className="text-sm text-muted-foreground">Recyclability</div>
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">Target met</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-chart-4 mb-1">A-</div>
                  <div className="text-sm text-muted-foreground">Sustainability Grade</div>
                  <div className="flex items-center justify-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
                    <span className="text-sm text-yellow-600">Room for improvement</span>
                  </div>
                </div>
              </div>
              {/* Data source badges */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                {govBadges.electricity && (
                  <span className="px-2 py-1 rounded-full border bg-card">
                    Source: {govBadges.electricity.source} • Grid EF {(govBadges.electricity.value/1000).toFixed(3)} kg CO₂/kWh • Quality {govBadges.electricity.quality}
                  </span>
                )}
                {govBadges.water && (
                  <span className="px-2 py-1 rounded-full border bg-card">
                    Source: {govBadges.water.source} • Water stress {govBadges.water.value}
                  </span>
                )}
                {govBadges.mineral && (
                  <span className="px-2 py-1 rounded-full border bg-card">
                    Source: {govBadges.mineral.source} • Mineral depletion {govBadges.mineral.value} kg Sb-eq/kg
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="impact-assessment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="impact-assessment">Impact Assessment</TabsTrigger>
              <TabsTrigger value="comparison">Method Comparison</TabsTrigger>
              <TabsTrigger value="circularity">Circularity Metrics</TabsTrigger>
              <TabsTrigger value="timeline">Historical Trends</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Impact Assessment */}
            <TabsContent value="impact-assessment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Impact Categories</CardTitle>
                    <CardDescription>Detailed breakdown of environmental impacts per functional unit</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {impactCategories.map((impact, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{impact.name}</span>
                            {getStatusBadge(impact.status)}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {impact.value.toLocaleString()} {impact.unit}
                            </span>
                            <div className="flex items-center">
                              {impact.trend === "down" && <TrendingDown className="h-4 w-4 text-green-600 mr-1" />}
                              {impact.trend === "up" && <TrendingUp className="h-4 w-4 text-red-600 mr-1" />}
                              <span
                                className={
                                  impact.improvement > 0
                                    ? "text-green-600"
                                    : impact.improvement < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }
                              >
                                {impact.improvement > 0 ? "+" : ""}
                                {impact.improvement}%
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={impact.status === "high" ? 80 : impact.status === "medium" ? 50 : 25}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Waste Composition Analysis</CardTitle>
                    <CardDescription>Breakdown of waste streams by type and volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        tailings: { label: "Tailings", color: "hsl(var(--chart-1))" },
                        slag: { label: "Slag", color: "hsl(var(--chart-2))" },
                        water: { label: "Process Water", color: "hsl(var(--chart-3))" },
                        other: { label: "Other", color: "hsl(var(--chart-4))" },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={wasteComposition}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {wasteComposition.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Method Comparison */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conventional vs Sustainable Methods</CardTitle>
                  <CardDescription>
                    Comparative analysis of environmental impacts between conventional and sustainable production
                    methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      conventional: { label: "Conventional Method", color: "hsl(var(--chart-5))" },
                      sustainable: { label: "Sustainable Method", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={emissionsByCategory} 
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barGap={0}
                        barCategoryGap="20%"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis label={{ value: 'kg CO₂e', angle: -90, position: 'insideLeft' }} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="conventional" name="Conventional Method" fill="hsl(var(--chart-5))" />
                        <Bar dataKey="sustainable" name="Sustainable Method" fill="hsl(var(--chart-3))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {emissionsByCategory.map((category, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600 mb-1">-{category.reduction}%</div>
                      <div className="text-xs text-muted-foreground">
                        {category.conventional - category.sustainable} kg CO₂-eq saved
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Circularity Metrics */}
            <TabsContent value="circularity" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Circularity Performance</CardTitle>
                    <CardDescription>Key metrics for circular economy implementation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {circularityMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{metric.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {metric.current}
                            {metric.unit} / {metric.target}
                            {metric.unit}
                          </span>
                        </div>
                        <Progress value={(metric.current / metric.target) * 100} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Current: {metric.current}
                            {metric.unit}
                          </span>
                          <span>
                            Target: {metric.target}
                            {metric.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Circular Economy Opportunities</CardTitle>
                    <CardDescription>Identified opportunities for improving circularity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Industrial Symbiosis</h4>
                          <p className="text-sm text-muted-foreground">
                            Partner with cement industry to utilize slag as raw material
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Water Recycling</h4>
                          <p className="text-sm text-muted-foreground">
                            Implement closed-loop water system to reduce freshwater consumption
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Energy Recovery</h4>
                          <p className="text-sm text-muted-foreground">Capture waste heat for electricity generation</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-medium">Material Substitution</h4>
                          <p className="text-sm text-muted-foreground">
                            Increase recycled aluminum content from 35% to 50%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Historical Trends */}
            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Performance Trends</CardTitle>
                  <CardDescription>Historical data showing improvement over time (2020-2024)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      emissions: { label: "CO₂ Emissions", color: "hsl(var(--chart-5))" },
                      water: { label: "Water Usage", color: "hsl(var(--chart-2))" },
                      waste: { label: "Waste Generation", color: "hsl(var(--chart-4))" },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="emissions"
                          stroke="var(--color-emissions)"
                          name="CO₂ Emissions (kg/t)"
                        />
                        <Line type="monotone" dataKey="water" stroke="var(--color-water)" name="Water Usage (L/t)" />
                        <Line
                          type="monotone"
                          dataKey="waste"
                          stroke="var(--color-waste)"
                          name="Waste Generation (kg/t)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recommendations */}
            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-700">High Priority Actions</CardTitle>
                    <CardDescription>Immediate steps to reduce environmental impact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Switch to Renewable Energy</h4>
                        <p className="text-sm text-muted-foreground">Potential 40% reduction in carbon footprint</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Implement Heat Recovery</h4>
                        <p className="text-sm text-muted-foreground">Reduce energy consumption by 15-20%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Optimize Process Efficiency</h4>
                        <p className="text-sm text-muted-foreground">Improve yield from 85% to 92%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">Medium-Term Opportunities</CardTitle>
                    <CardDescription>Strategic improvements for long-term sustainability</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Circular Water System</h4>
                        <p className="text-sm text-muted-foreground">Reduce freshwater consumption by 60%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Advanced Material Recovery</h4>
                        <p className="text-sm text-muted-foreground">Increase recycled content to 50%</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Digital Process Optimization</h4>
                        <p className="text-sm text-muted-foreground">AI-driven process control for efficiency</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Potential Uses for Extracted Materials</CardTitle>
                  <CardDescription>
                    Recommended applications based on material properties and market demand
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">High-Grade Aluminum</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Aerospace components</li>
                        <li>• Automotive parts</li>
                        <li>• Electronics housings</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Secondary Aluminum</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Construction materials</li>
                        <li>• Packaging applications</li>
                        <li>• General manufacturing</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">By-products</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Cement industry (slag)</li>
                        <li>• Road construction (aggregates)</li>
                        <li>• Soil amendment (processed tailings)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}