"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Factory,
  Recycle,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Droplets,
  Zap,
  Globe,
  Users,
  DollarSign,
  BarChart3,
  Target,
  Leaf,
} from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sankey } from "recharts"

export default function WasteAnalysisPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("copper")

  // Waste generation data by material
  const wasteData = {
    copper: {
      totalWaste: 8500, // tonnes/year
      breakdown: [
        { type: "Overburden/Waste Rock", amount: 6800, percentage: 80, recyclable: 15, color: "#8b5cf6" },
        { type: "Tailings", amount: 1190, percentage: 14, recyclable: 45, color: "#3b82f6" },
        { type: "Slag", amount: 340, percentage: 4, recyclable: 85, color: "#22c55e" },
        { type: "Process Water", amount: 170, percentage: 2, recyclable: 75, color: "#eab308" }
      ],
      wasteIntensity: 8.5, // tonnes waste per tonne product
      recyclingRate: 35,
      landfillDiversion: 65,
      valueRecovery: 2.4 // Million USD/year
    },
    aluminum: {
      totalWaste: 12400,
      breakdown: [
        { type: "Red Mud", amount: 8680, percentage: 70, recyclable: 25, color: "#ef4444" },
        { type: "Spent Pot Lining", amount: 1240, percentage: 10, recyclable: 60, color: "#f97316" },
        { type: "Dross", amount: 1116, percentage: 9, recyclable: 90, color: "#22c55e" },
        { type: "Filter Dust", amount: 1364, percentage: 11, recyclable: 40, color: "#8b5cf6" }
      ],
      wasteIntensity: 12.4,
      recyclingRate: 42,
      landfillDiversion: 58,
      valueRecovery: 3.8
    }
  }

  // Waste stream flow data
  const wasteFlowData = [
    { stage: "Mining", input: 100, output: 85, waste: 15, efficiency: 85 },
    { stage: "Concentration", input: 85, output: 25, waste: 60, efficiency: 29 },
    { stage: "Smelting", input: 25, output: 22, waste: 3, efficiency: 88 },
    { stage: "Refining", input: 22, output: 20, waste: 2, efficiency: 91 },
    { stage: "Fabrication", input: 20, output: 18, waste: 2, efficiency: 90 }
  ]

  // Industrial symbiosis opportunities
  const symbiosisOpportunities = [
    {
      wasteStream: "Copper Slag",
      partner: "Cement Industry",
      application: "Cement Additive",
      volume: 340,
      value: 68000,
      co2Reduction: 51,
      status: "Active"
    },
    {
      wasteStream: "Tailings",
      partner: "Construction",
      application: "Aggregate Substitute",
      volume: 595,
      value: 119000,
      co2Reduction: 89,
      status: "Pilot"
    },
    {
      wasteStream: "Process Water",
      partner: "Agriculture",
      application: "Irrigation",
      volume: 128,
      value: 25600,
      co2Reduction: 12,
      status: "Planned"
    },
    {
      wasteStream: "Waste Heat",
      partner: "District Heating",
      application: "Space Heating",
      volume: 2340, // MWh
      value: 234000,
      co2Reduction: 468,
      status: "Active"
    }
  ]

  // Waste reduction timeline
  const reductionTimeline = [
    { year: 2020, conventional: 10200, sustainable: 10200, target: 9500 },
    { year: 2021, conventional: 10100, sustainable: 9800, target: 9200 },
    { year: 2022, conventional: 9950, sustainable: 9200, target: 8900 },
    { year: 2023, conventional: 9800, sustainable: 8600, target: 8600 },
    { year: 2024, conventional: 9650, sustainable: 8000, target: 8300 },
    { year: 2025, conventional: 9500, sustainable: 7400, target: 8000 }
  ]

  // Circular economy metrics
  const circularityMetrics = [
    { metric: "Material Recovery Rate", current: 68, target: 85, unit: "%" },
    { metric: "Waste-to-Resource Ratio", current: 45, target: 70, unit: "%" },
    { metric: "Industrial Symbiosis Value", current: 2.4, target: 4.2, unit: "M USD" },
    { metric: "Landfill Diversion", current: 65, target: 90, unit: "%" }
  ]

  const currentData = wasteData[selectedMaterial as keyof typeof wasteData]

  const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#eab308', '#ef4444', '#f97316']

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-professional">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/lca">
              <Button variant="ghost" size="sm" className="hover-lift">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to LCA
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  Waste Stream Analysis
                </h1>
                <p className="text-sm text-muted-foreground">Cradle-to-Gate Waste Generation Assessment</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background shadow-sm"
            >
              <option value="copper">Copper</option>
              <option value="aluminum">Aluminum</option>
            </select>
            <Badge variant="secondary" className="px-4 py-2 shadow-sm">
              <Target className="h-4 w-4 mr-2" />
              Circular Economy Focus
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-professional border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {currentData.totalWaste.toLocaleString()}
                </div>
                <div className="text-sm font-medium mb-1">Total Waste Generated</div>
                <div className="text-xs text-muted-foreground">tonnes/year</div>
              </CardContent>
            </Card>
            <Card className="shadow-professional border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {currentData.wasteIntensity}
                </div>
                <div className="text-sm font-medium mb-1">Waste Intensity</div>
                <div className="text-xs text-muted-foreground">tonnes waste/tonne product</div>
              </CardContent>
            </Card>
            <Card className="shadow-professional border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {currentData.recyclingRate}%
                </div>
                <div className="text-sm font-medium mb-1">Current Recycling Rate</div>
                <div className="text-xs text-muted-foreground">material recovery</div>
              </CardContent>
            </Card>
            <Card className="shadow-professional border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  ${currentData.valueRecovery}M
                </div>
                <div className="text-sm font-medium mb-1">Value Recovery Potential</div>
                <div className="text-xs text-muted-foreground">annual revenue</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="breakdown" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
              <TabsTrigger value="breakdown" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Waste Breakdown
              </TabsTrigger>
              <TabsTrigger value="flow-analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Droplets className="h-4 w-4 mr-2" />
                Flow Analysis
              </TabsTrigger>
              <TabsTrigger value="symbiosis" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Recycle className="h-4 w-4 mr-2" />
                Industrial Symbiosis
              </TabsTrigger>
              <TabsTrigger value="reduction" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <TrendingDown className="h-4 w-4 mr-2" />
                Waste Reduction
              </TabsTrigger>
              <TabsTrigger value="circularity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Target className="h-4 w-4 mr-2" />
                Circularity Metrics
              </TabsTrigger>
            </TabsList>

            {/* Waste Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Waste Stream Distribution</CardTitle>
                    <CardDescription>Breakdown of waste types for {selectedMaterial} production</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={currentData.breakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ type, percentage }) => `${type}: ${percentage}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="amount"
                          >
                            {currentData.breakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: any) => [`${value} tonnes`, 'Amount']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Recyclability Potential</CardTitle>
                    <CardDescription>Recovery potential for each waste stream</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData.breakdown} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="type" type="category" width={120} />
                          <Tooltip formatter={(value: any) => [`${value}%`, 'Recyclability']} />
                          <Bar dataKey="recyclable" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.breakdown.map((waste, index) => (
                  <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{waste.type}</CardTitle>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: waste.color }}></div>
                      </div>
                      <CardDescription>Annual generation and recovery potential</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                          <div className="text-2xl font-bold">{waste.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">tonnes/year</div>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                          <div className="text-2xl font-bold">{waste.percentage}%</div>
                          <div className="text-sm text-muted-foreground">of total waste</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Recyclability Potential</span>
                          <span className="font-medium">{waste.recyclable}%</span>
                        </div>
                        <Progress value={waste.recyclable} className="h-3" />
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(waste.amount * waste.recyclable / 100).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">tonnes recoverable</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Flow Analysis Tab */}
            <TabsContent value="flow-analysis" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Material Flow Through Production Stages</CardTitle>
                  <CardDescription>Tracking material efficiency and waste generation at each stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={wasteFlowData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="input" fill="#3b82f6" name="Input" />
                        <Bar dataKey="output" fill="#22c55e" name="Output" />
                        <Bar dataKey="waste" fill="#ef4444" name="Waste" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {wasteFlowData.map((stage, index) => (
                  <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-center">{stage.stage}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{stage.input}%</div>
                        <div className="text-xs text-muted-foreground">Input</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{stage.output}%</div>
                        <div className="text-xs text-muted-foreground">Output</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{stage.waste}%</div>
                        <div className="text-xs text-muted-foreground">Waste</div>
                      </div>
                      <Badge className={stage.efficiency > 80 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}>
                        {stage.efficiency}% efficient
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Industrial Symbiosis Tab */}
            <TabsContent value="symbiosis" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Industrial Symbiosis Opportunities</CardTitle>
                  <CardDescription>Cross-industry partnerships for waste-to-resource conversion</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {symbiosisOpportunities.map((opportunity, index) => (
                      <div key={index} className="p-6 border rounded-lg space-y-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                              <Recycle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{opportunity.wasteStream} → {opportunity.partner}</h4>
                              <p className="text-muted-foreground">{opportunity.application}</p>
                            </div>
                          </div>
                          <Badge className={
                            opportunity.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            opportunity.status === "Pilot" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }>
                            {opportunity.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{opportunity.volume.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">
                              {opportunity.wasteStream === "Waste Heat" ? "MWh/year" : "tonnes/year"}
                            </div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">${(opportunity.value / 1000).toFixed(0)}K</div>
                            <div className="text-sm text-muted-foreground">annual value</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{opportunity.co2Reduction}</div>
                            <div className="text-sm text-muted-foreground">tonnes CO₂ saved</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {((opportunity.value / opportunity.volume) * (opportunity.wasteStream === "Waste Heat" ? 0.1 : 1)).toFixed(0)}
                            </div>
                            <div className="text-sm text-muted-foreground">$/unit value</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-professional border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${(symbiosisOpportunities.reduce((sum, opp) => sum + opp.value, 0) / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm font-medium mb-1">Total Annual Value</div>
                    <div className="text-xs text-muted-foreground">from symbiosis partnerships</div>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {symbiosisOpportunities.reduce((sum, opp) => sum + opp.co2Reduction, 0)}
                    </div>
                    <div className="text-sm font-medium mb-1">CO₂ Reduction</div>
                    <div className="text-xs text-muted-foreground">tonnes CO₂-eq/year</div>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {symbiosisOpportunities.length}
                    </div>
                    <div className="text-sm font-medium mb-1">Active Partnerships</div>
                    <div className="text-xs text-muted-foreground">industrial symbiosis</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Waste Reduction Tab */}
            <TabsContent value="reduction" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Waste Reduction Timeline</CardTitle>
                  <CardDescription>Progress towards waste reduction targets over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={reductionTimeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`${value} tonnes`, 'Waste Generated']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="conventional" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          name="Conventional Method"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sustainable" 
                          stroke="#22c55e" 
                          strokeWidth={3}
                          name="Sustainable Method"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="target" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Target"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-professional border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">22%</div>
                    <div className="text-sm font-medium mb-1">Waste Reduction Achieved</div>
                    <div className="text-xs text-muted-foreground">vs 2020 baseline</div>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">2025</div>
                    <div className="text-sm font-medium mb-1">Target Achievement</div>
                    <div className="text-xs text-muted-foreground">projected timeline</div>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">1,650</div>
                    <div className="text-sm font-medium mb-1">Tonnes Saved</div>
                    <div className="text-xs text-muted-foreground">annual reduction</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Circularity Metrics Tab */}
            <TabsContent value="circularity" className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {circularityMetrics.map((metric, index) => (
                  <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{metric.metric}</CardTitle>
                        <Badge variant="outline" className="shadow-sm">
                          Target: {metric.target}{metric.unit}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {metric.current}{metric.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Performance</div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress to Target</span>
                          <span className="font-medium">{((metric.current / metric.target) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(metric.current / metric.target) * 100} className="h-3" />
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-medium">Gap to Target</span>
                        <Badge className={metric.current >= metric.target ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"}>
                          {metric.current >= metric.target ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {metric.current >= metric.target ? "Target Met" : `${(metric.target - metric.current).toFixed(1)} ${metric.unit} gap`}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Circular Economy Action Plan</CardTitle>
                  <CardDescription>Strategic initiatives to improve circularity performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Implement Advanced Sorting Technology",
                        impact: "Increase material recovery rate by 12%",
                        timeline: "Q2 2024",
                        investment: "$2.1M",
                        priority: "High"
                      },
                      {
                        action: "Establish Regional Symbiosis Network",
                        impact: "Add 3 new industrial partnerships",
                        timeline: "Q3 2024",
                        investment: "$0.8M",
                        priority: "Medium"
                      },
                      {
                        action: "Deploy AI-Powered Waste Optimization",
                        impact: "Reduce waste generation by 8%",
                        timeline: "Q4 2024",
                        investment: "$1.5M",
                        priority: "High"
                      },
                      {
                        action: "Upgrade Water Treatment Systems",
                        impact: "Achieve 90% water recycling",
                        timeline: "Q1 2025",
                        investment: "$3.2M",
                        priority: "Medium"
                      }
                    ].map((action, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{action.action}</span>
                          <Badge className={
                            action.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }>
                            {action.priority} Priority
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>Impact: {action.impact}</div>
                          <div>Timeline: {action.timeline}</div>
                          <div>Investment: {action.investment}</div>
                        </div>
                      </div>
                    ))}
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