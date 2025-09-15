"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Trash2,
  Recycle,
  AlertTriangle,
  BarChart3,
  Leaf,
  Factory,
  Mountain,
  Droplets,
  Wind,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function WasteAnalysisPage() {
  const [selectedMaterial, setSelectedMaterial] = useState("Copper")

  // Mock waste generation data
  const wasteData = {
    totalWasteGenerated: 45600, // tonnes/year
    wasteStreams: [
      { name: "Overburden/Waste Rock", amount: 25000, percentage: 54.8, recyclable: false, hazardous: false },
      { name: "Tailings", amount: 12000, percentage: 26.3, recyclable: true, hazardous: false },
      { name: "Slag", amount: 4500, percentage: 9.9, recyclable: true, hazardous: false },
      { name: "Process Water Sludge", amount: 2100, percentage: 4.6, recyclable: false, hazardous: true },
      { name: "Dust & Particulates", amount: 1200, percentage: 2.6, recyclable: true, hazardous: false },
      { name: "Hazardous Chemicals", amount: 800, percentage: 1.8, recyclable: false, hazardous: true },
    ],
    circularityOpportunities: [
      {
        wasteStream: "Tailings",
        opportunity: "Construction Materials",
        potential: "8,400 tonnes/year",
        co2Reduction: "2,100 kg CO₂-eq",
        economicValue: "$420,000/year"
      },
      {
        wasteStream: "Slag",
        opportunity: "Cement Production",
        potential: "4,050 tonnes/year",
        co2Reduction: "1,620 kg CO₂-eq",
        economicValue: "$243,000/year"
      },
      {
        wasteStream: "Dust & Particulates",
        opportunity: "Metal Recovery",
        potential: "960 tonnes/year",
        co2Reduction: "480 kg CO₂-eq",
        economicValue: "$144,000/year"
      }
    ],
    environmentalImpact: {
      landUse: 125.5, // hectares
      waterContamination: 2.3, // risk score
      airQuality: 3.1, // impact score
      soilContamination: 1.8, // risk score
      biodiversityImpact: 2.7 // impact score
    },
    wasteManagementCosts: {
      disposal: 1250000, // $/year
      treatment: 890000,
      storage: 340000,
      monitoring: 180000,
      total: 2660000
    }
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

  const wasteTimelineData = [
    { phase: 'Extraction', waste: 28000, type: 'Overburden' },
    { phase: 'Processing', waste: 12000, type: 'Tailings' },
    { phase: 'Smelting', waste: 4500, type: 'Slag' },
    { phase: 'Refining', waste: 1100, type: 'Mixed' },
  ]

  const circularityPotentialData = [
    { category: 'Current Recycling', value: 32 },
    { category: 'Potential Recycling', value: 68 },
    { category: 'Waste to Energy', value: 15 },
    { category: 'Material Recovery', value: 45 },
  ]

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
              <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Trash2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Waste Generation Analysis
                </h1>
                <p className="text-sm text-muted-foreground">Mining & Production Phase Assessment</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="px-4 py-2 shadow-sm">
            <Mountain className="h-4 w-4 mr-2" />
            Cradle-to-Gate Analysis
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-500 to-orange-500"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Waste Generated</CardTitle>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{wasteData.totalWasteGenerated.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">tonnes/year</div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Recyclable Potential</CardTitle>
                  <Recycle className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((wasteData.wasteStreams.filter(w => w.recyclable).reduce((sum, w) => sum + w.amount, 0) / wasteData.totalWasteGenerated) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">of total waste</div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Hazardous Waste</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {wasteData.wasteStreams.filter(w => w.hazardous).reduce((sum, w) => sum + w.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">tonnes/year</div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Management Cost</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  ${(wasteData.wasteManagementCosts.total / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground">per year</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="waste-streams" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
              <TabsTrigger value="waste-streams" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Trash2 className="h-4 w-4 mr-2" />
                Waste Streams
              </TabsTrigger>
              <TabsTrigger value="circularity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Recycle className="h-4 w-4 mr-2" />
                Circularity
              </TabsTrigger>
              <TabsTrigger value="environmental" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Leaf className="h-4 w-4 mr-2" />
                Environmental
              </TabsTrigger>
              <TabsTrigger value="economics" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Economics
              </TabsTrigger>
            </TabsList>

            {/* Waste Streams Analysis */}
            <TabsContent value="waste-streams" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Waste Stream Distribution</CardTitle>
                    <CardDescription>Breakdown of waste types by volume and characteristics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={wasteData.wasteStreams}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="amount"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {wasteData.wasteStreams.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} tonnes`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Waste Generation by Phase</CardTitle>
                    <CardDescription>Waste production across mining and processing stages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={wasteTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="phase" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toLocaleString()} tonnes`, 'Waste Generated']} />
                        <Bar dataKey="waste" fill="#FF6B6B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Detailed Waste Stream Analysis</CardTitle>
                  <CardDescription>Comprehensive breakdown of each waste stream</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wasteData.wasteStreams.map((stream, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-muted/20 to-card/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">{stream.name}</h4>
                          <div className="flex space-x-2">
                            {stream.recyclable && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <Recycle className="h-3 w-3 mr-1" />
                                Recyclable
                              </Badge>
                            )}
                            {stream.hazardous && (
                              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Hazardous
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <div className="font-semibold">{stream.amount.toLocaleString()} tonnes/year</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Percentage:</span>
                            <div className="font-semibold">{stream.percentage}% of total</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <div className="font-semibold">
                              {stream.recyclable ? "Recovery Potential" : "Disposal Required"}
                            </div>
                          </div>
                        </div>
                        <Progress value={stream.percentage} className="mt-3 h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Circularity Opportunities */}
            <TabsContent value="circularity" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Circularity Potential</CardTitle>
                    <CardDescription>Current vs potential circular economy opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={circularityPotentialData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Potential']} />
                        <Bar dataKey="value" fill="#4ECDC4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Waste-to-Resource Opportunities</CardTitle>
                    <CardDescription>Identified circular economy applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wasteData.circularityOpportunities.map((opp, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{opp.wasteStream} → {opp.opportunity}</h4>
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              High Potential
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Potential:</span>
                              <div className="font-semibold">{opp.potential}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CO₂ Reduction:</span>
                              <div className="font-semibold text-green-600">{opp.co2Reduction}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Economic Value:</span>
                              <div className="font-semibold text-blue-600">{opp.economicValue}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Industrial Symbiosis Opportunities</CardTitle>
                  <CardDescription>Potential partnerships for waste utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                      <div className="flex items-center space-x-3 mb-4">
                        <Factory className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-semibold">Construction Industry</h4>
                          <p className="text-sm text-muted-foreground">Tailings as aggregate</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Potential Volume:</span>
                          <span className="font-semibold">8,400 t/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Potential:</span>
                          <span className="font-semibold text-green-600">$420K/year</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                      <div className="flex items-center space-x-3 mb-4">
                        <Mountain className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-semibold">Cement Manufacturing</h4>
                          <p className="text-sm text-muted-foreground">Slag utilization</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Potential Volume:</span>
                          <span className="font-semibold">4,050 t/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Potential:</span>
                          <span className="font-semibold text-green-600">$243K/year</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
                      <div className="flex items-center space-x-3 mb-4">
                        <Recycle className="h-8 w-8 text-purple-600" />
                        <div>
                          <h4 className="font-semibold">Metal Recovery</h4>
                          <p className="text-sm text-muted-foreground">Dust processing</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Potential Volume:</span>
                          <span className="font-semibold">960 t/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Revenue Potential:</span>
                          <span className="font-semibold text-green-600">$144K/year</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Environmental Impact */}
            <TabsContent value="environmental" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm text-center">
                  <CardHeader className="pb-3">
                    <div className="mx-auto p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit">
                      <Mountain className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Land Use</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{wasteData.environmentalImpact.landUse}</div>
                    <div className="text-sm text-muted-foreground">hectares affected</div>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm text-center">
                  <CardHeader className="pb-3">
                    <div className="mx-auto p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit">
                      <Droplets className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Water Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{wasteData.environmentalImpact.waterContamination}</div>
                    <div className="text-sm text-muted-foreground">contamination risk</div>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm text-center">
                  <CardHeader className="pb-3">
                    <div className="mx-auto p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl w-fit">
                      <Wind className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Air Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">{wasteData.environmentalImpact.airQuality}</div>
                    <div className="text-sm text-muted-foreground">impact score</div>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm text-center">
                  <CardHeader className="pb-3">
                    <div className="mx-auto p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl w-fit">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">Biodiversity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-2">{wasteData.environmentalImpact.biodiversityImpact}</div>
                    <div className="text-sm text-muted-foreground">impact score</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Environmental Impact Timeline</CardTitle>
                  <CardDescription>Projected environmental effects over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { year: 2024, landUse: 125.5, waterImpact: 2.3, airQuality: 3.1, biodiversity: 2.7 },
                      { year: 2025, landUse: 128.2, waterImpact: 2.4, airQuality: 3.2, biodiversity: 2.8 },
                      { year: 2026, landUse: 130.8, waterImpact: 2.5, airQuality: 3.3, biodiversity: 2.9 },
                      { year: 2027, landUse: 133.5, waterImpact: 2.6, airQuality: 3.4, biodiversity: 3.0 },
                      { year: 2028, landUse: 136.1, waterImpact: 2.7, airQuality: 3.5, biodiversity: 3.1 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="landUse" stroke="#4ECDC4" name="Land Use (ha)" />
                      <Line type="monotone" dataKey="waterImpact" stroke="#45B7D1" name="Water Impact" />
                      <Line type="monotone" dataKey="airQuality" stroke="#96CEB4" name="Air Quality" />
                      <Line type="monotone" dataKey="biodiversity" stroke="#FFEAA7" name="Biodiversity" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Economic Analysis */}
            <TabsContent value="economics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Waste Management Costs</CardTitle>
                    <CardDescription>Annual expenditure breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Disposal', value: wasteData.wasteManagementCosts.disposal },
                            { name: 'Treatment', value: wasteData.wasteManagementCosts.treatment },
                            { name: 'Storage', value: wasteData.wasteManagementCosts.storage },
                            { name: 'Monitoring', value: wasteData.wasteManagementCosts.monitoring },
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: $${(value/1000).toFixed(0)}K`}
                        >
                          {Object.entries(wasteData.wasteManagementCosts).slice(0, 4).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Cost']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Revenue Potential from Circularity</CardTitle>
                    <CardDescription>Potential income from waste valorization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-xl">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          $807K
                        </div>
                        <div className="text-sm text-muted-foreground">Total Annual Revenue Potential</div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={wasteData.circularityOpportunities.map(opp => ({
                          name: opp.wasteStream,
                          value: parseInt(opp.economicValue.replace(/[$,]/g, '').replace('/year', ''))
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${(value/1000).toFixed(0)}K`, 'Revenue']} />
                          <Bar dataKey="value" fill="#4ECDC4" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Cost-Benefit Analysis</CardTitle>
                  <CardDescription>Economic impact of implementing circular economy practices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-red-50 dark:bg-red-950 rounded-xl">
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        $2.66M
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">Current Annual Costs</div>
                      <div className="text-xs text-muted-foreground">Waste management expenses</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        $807K
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">Revenue Potential</div>
                      <div className="text-xs text-muted-foreground">From circular practices</div>
                    </div>
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        $1.85M
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">Net Cost Reduction</div>
                      <div className="text-xs text-muted-foreground">Potential annual savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Button size="lg" className="shadow-lg hover-lift">
              <Recycle className="mr-2 h-5 w-5" />
              Explore Circularity Options
            </Button>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
                <BarChart3 className="mr-2 h-5 w-5" />
                Find Waste Buyers
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="shadow-lg hover-lift bg-transparent">
              <Award className="mr-2 h-5 w-5" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}