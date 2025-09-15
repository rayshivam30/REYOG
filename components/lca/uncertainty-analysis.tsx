"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, BarChart3, TrendingUp, Target, Info, Calculator } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

interface UncertaintyData {
  parameter: string
  mean: number
  standardDeviation: number
  confidenceInterval: { lower: number, upper: number }
  dataQuality: 'A' | 'B' | 'C' | 'D'
  sensitivity: number
  unit: string
}

interface MonteCarloResult {
  iteration: number
  result: number
  percentile: number
}

export default function UncertaintyAnalysis() {
  const [selectedParameter, setSelectedParameter] = useState<string>("globalWarmingPotential")
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95)
  const [iterations, setIterations] = useState<number>(10000)

  // Mock uncertainty data
  const uncertaintyData: UncertaintyData[] = [
    {
      parameter: "globalWarmingPotential",
      mean: 4250,
      standardDeviation: 425,
      confidenceInterval: { lower: 3580, upper: 4920 },
      dataQuality: 'A',
      sensitivity: 0.85,
      unit: "kg CO₂-eq"
    },
    {
      parameter: "waterScarcityIndicator",
      mean: 2340,
      standardDeviation: 468,
      confidenceInterval: { lower: 1650, upper: 3030 },
      dataQuality: 'B',
      sensitivity: 0.72,
      unit: "m³ water-eq"
    },
    {
      parameter: "humanToxicityPotential",
      mean: 234.5,
      standardDeviation: 58.6,
      confidenceInterval: { lower: 165, upper: 304 },
      dataQuality: 'B',
      sensitivity: 0.68,
      unit: "kg 1,4-DCB-eq"
    },
    {
      parameter: "acidificationPotential",
      mean: 18.5,
      standardDeviation: 2.8,
      confidenceInterval: { lower: 14.2, upper: 22.8 },
      dataQuality: 'A',
      sensitivity: 0.45,
      unit: "kg SO₂-eq"
    },
    {
      parameter: "fossilFuelDepletion",
      mean: 15600,
      standardDeviation: 2340,
      confidenceInterval: { lower: 12200, upper: 19000 },
      dataQuality: 'C',
      sensitivity: 0.91,
      unit: "MJ"
    }
  ]

  // Mock Monte Carlo simulation results
  const monteCarloResults: MonteCarloResult[] = Array.from({ length: 1000 }, (_, i) => {
    const selectedData = uncertaintyData.find(d => d.parameter === selectedParameter)
    if (!selectedData) return { iteration: i, result: 0, percentile: 0 }
    
    // Generate normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const result = selectedData.mean + z0 * selectedData.standardDeviation
    
    return {
      iteration: i,
      result: Math.max(0, result),
      percentile: (i / 1000) * 100
    }
  }).sort((a, b) => a.result - b.result).map((item, index) => ({
    ...item,
    percentile: (index / 1000) * 100
  }))

  // Sensitivity analysis data
  const sensitivityData = [
    { parameter: "Electricity Consumption", impact: 0.85, uncertainty: 15, color: "#ef4444" },
    { parameter: "Fuel Consumption", impact: 0.72, uncertainty: 12, color: "#f97316" },
    { parameter: "Recycled Input Share", impact: -0.68, uncertainty: 20, color: "#22c55e" },
    { parameter: "Ore Grade", impact: 0.45, uncertainty: 25, color: "#3b82f6" },
    { parameter: "Transportation Distance", impact: 0.32, uncertainty: 18, color: "#8b5cf6" },
    { parameter: "Energy Mix", impact: 0.91, uncertainty: 10, color: "#ef4444" }
  ]

  // Data quality distribution
  const dataQualityDistribution = [
    { quality: 'A (Excellent)', count: 35, percentage: 35, color: "#22c55e" },
    { quality: 'B (Good)', count: 42, percentage: 42, color: "#eab308" },
    { quality: 'C (Fair)', count: 18, percentage: 18, color: "#f97316" },
    { quality: 'D (Poor)', count: 5, percentage: 5, color: "#ef4444" }
  ]

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'B': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'C': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'D': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const selectedData = uncertaintyData.find(d => d.parameter === selectedParameter)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Uncertainty & Sensitivity Analysis</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive uncertainty quantification and sensitivity analysis following ISO 14040 guidelines
        </p>
      </div>

      <Tabs defaultValue="uncertainty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
          <TabsTrigger value="uncertainty" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Uncertainty Analysis
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sensitivity Analysis
          </TabsTrigger>
          <TabsTrigger value="monte-carlo" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Calculator className="h-4 w-4 mr-2" />
            Monte Carlo
          </TabsTrigger>
          <TabsTrigger value="data-quality" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Target className="h-4 w-4 mr-2" />
            Data Quality
          </TabsTrigger>
        </TabsList>

        {/* Uncertainty Analysis Tab */}
        <TabsContent value="uncertainty" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {uncertaintyData.map((data, index) => (
              <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg capitalize">
                      {data.parameter.replace(/([A-Z])/g, ' $1').trim()}
                    </CardTitle>
                    <Badge className={getQualityColor(data.dataQuality)}>
                      Quality: {data.dataQuality}
                    </Badge>
                  </div>
                  <CardDescription>Statistical uncertainty analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                      <div className="text-2xl font-bold">{data.mean.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Mean Value</div>
                      <div className="text-xs text-muted-foreground">{data.unit}</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-muted/20 to-card/50 rounded-lg">
                      <div className="text-2xl font-bold">±{data.standardDeviation.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Std. Deviation</div>
                      <div className="text-xs text-muted-foreground">{((data.standardDeviation / data.mean) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>95% Confidence Interval</span>
                      <span className="font-medium">
                        {data.confidenceInterval.lower.toLocaleString()} - {data.confidenceInterval.upper.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-4 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full"></div>
                      <div 
                        className="absolute top-0 h-4 bg-primary rounded-full opacity-60"
                        style={{
                          left: `${((data.confidenceInterval.lower - data.mean + 2 * data.standardDeviation) / (4 * data.standardDeviation)) * 100}%`,
                          width: `${((data.confidenceInterval.upper - data.confidenceInterval.lower) / (4 * data.standardDeviation)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm">Sensitivity Index</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={Math.abs(data.sensitivity) * 100} className="w-20 h-2" />
                      <span className="text-sm font-medium">{Math.abs(data.sensitivity).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sensitivity Analysis Tab */}
        <TabsContent value="sensitivity" className="space-y-6">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Parameter Sensitivity Analysis</CardTitle>
              <CardDescription>
                Impact of input parameter variations on LCA results (tornado diagram)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sensitivityData}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[-1, 1]} />
                    <YAxis dataKey="parameter" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        `${(value * 100).toFixed(1)}%`,
                        name === 'impact' ? 'Impact on Result' : name
                      ]}
                    />
                    <Bar 
                      dataKey="impact" 
                      fill={(entry: any) => entry.impact > 0 ? "#ef4444" : "#22c55e"}
                      name="Sensitivity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">High Sensitivity Parameters</CardTitle>
                <CardDescription>Parameters with highest impact on results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sensitivityData
                  .filter(item => Math.abs(item.impact) > 0.6)
                  .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/20 to-card/50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.parameter}</div>
                        <div className="text-sm text-muted-foreground">±{item.uncertainty}% uncertainty</div>
                      </div>
                      <Badge className={item.impact > 0 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}>
                        {(Math.abs(item.impact) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Uncertainty vs Impact</CardTitle>
                <CardDescription>Parameter uncertainty plotted against sensitivity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={sensitivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="uncertainty" 
                        name="Uncertainty" 
                        unit="%" 
                        label={{ value: 'Uncertainty (%)', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        dataKey="impact" 
                        name="Impact" 
                        label={{ value: 'Sensitivity', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'impact' ? `${(value * 100).toFixed(1)}%` : `${value}%`,
                          name === 'impact' ? 'Sensitivity' : 'Uncertainty'
                        ]}
                        labelFormatter={(label: any) => `Parameter: ${label}`}
                      />
                      <Scatter dataKey="impact" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monte Carlo Tab */}
        <TabsContent value="monte-carlo" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Monte Carlo Simulation</h3>
              <p className="text-muted-foreground">Statistical modeling with {iterations.toLocaleString()} iterations</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedParameter}
                onChange={(e) => setSelectedParameter(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background"
              >
                {uncertaintyData.map(data => (
                  <option key={data.parameter} value={data.parameter}>
                    {data.parameter.replace(/([A-Z])/g, ' $1').trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedData.mean.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Mean</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {monteCarloResults.find(r => r.percentile >= 5)?.result.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">5th Percentile</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {monteCarloResults.find(r => r.percentile >= 50)?.result.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Median</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {monteCarloResults.find(r => r.percentile >= 95)?.result.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">95th Percentile</div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Probability Distribution</CardTitle>
              <CardDescription>Monte Carlo simulation results showing probability distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monteCarloResults.filter((_, i) => i % 10 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="result" 
                      type="number"
                      scale="linear"
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis 
                      label={{ value: 'Cumulative Probability', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'percentile' ? `${value.toFixed(1)}%` : value.toLocaleString(),
                        name === 'percentile' ? 'Probability' : 'Value'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="percentile" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                      name="Cumulative Probability"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Quality Tab */}
        <TabsContent value="data-quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Data Quality Distribution</CardTitle>
                <CardDescription>Overall quality assessment of input data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataQualityDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.quality}</span>
                        <span className="text-sm text-muted-foreground">{item.count} parameters</span>
                      </div>
                      <div className="relative">
                        <Progress value={item.percentage} className="h-3" />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quality Recommendations</CardTitle>
                <CardDescription>Suggestions for improving data quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    priority: "High",
                    recommendation: "Update 5 parameters with 'D' quality rating",
                    impact: "Reduce overall uncertainty by 15%",
                    effort: "Medium"
                  },
                  {
                    priority: "Medium",
                    recommendation: "Validate 18 parameters with 'C' quality rating",
                    impact: "Improve confidence intervals by 8%",
                    effort: "High"
                  },
                  {
                    priority: "Low",
                    recommendation: "Enhance documentation for 'B' quality parameters",
                    impact: "Better traceability and peer review",
                    effort: "Low"
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        item.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        item.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }>
                        {item.priority} Priority
                      </Badge>
                      <span className="text-sm text-muted-foreground">Effort: {item.effort}</span>
                    </div>
                    <div className="font-medium">{item.recommendation}</div>
                    <div className="text-sm text-muted-foreground">{item.impact}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Parameter Quality Assessment</CardTitle>
              <CardDescription>Detailed quality evaluation for each LCA parameter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uncertaintyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium capitalize">
                        {data.parameter.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Uncertainty: ±{((data.standardDeviation / data.mean) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getQualityColor(data.dataQuality)}>
                        {data.dataQuality}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">Sensitivity: {Math.abs(data.sensitivity).toFixed(2)}</div>
                        <Progress value={Math.abs(data.sensitivity) * 100} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}