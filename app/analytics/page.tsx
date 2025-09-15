"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Globe,
  Leaf,
  Users,
  DollarSign,
  Zap,
  Recycle,
  Award,
} from "lucide-react"
import Link from "next/link"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AnalyticsPage() {
  // Mock analytics data
  const globalEmissionsData = [
    { year: 2019, aluminum: 11200, copper: 3800, steel: 1850, total: 16850 },
    { year: 2020, aluminum: 10800, copper: 3600, steel: 1780, total: 16180 },
    { year: 2021, aluminum: 10200, copper: 3400, steel: 1720, total: 15320 },
    { year: 2022, aluminum: 9800, copper: 3200, steel: 1650, total: 14650 },
    { year: 2023, aluminum: 9200, copper: 3000, steel: 1580, total: 13780 },
    { year: 2024, aluminum: 8600, copper: 2800, steel: 1500, total: 12900 },
  ]

  const circularityMetrics = [
    { material: "Aluminum", recycling: 85, reuse: 12, recovery: 3 },
    { material: "Copper", recycling: 78, reuse: 15, recovery: 7 },
    { material: "Steel", recycling: 92, reuse: 5, recovery: 3 },
    { material: "Gold", recycling: 65, reuse: 25, recovery: 10 },
    { material: "Silver", recycling: 70, reuse: 20, recovery: 10 },
  ]

  const regionalData = [
    { region: "North America", emissions: 3200, recycling: 78, value: 2.4 },
    { region: "Europe", emissions: 2800, recycling: 85, value: 3.1 },
    { region: "Asia Pacific", emissions: 5400, recycling: 65, value: 4.2 },
    { region: "Latin America", emissions: 1200, recycling: 58, value: 0.8 },
    { region: "Africa", emissions: 800, recycling: 45, value: 0.5 },
  ]

  const industryComparison = [
    { industry: "Automotive", conventional: 2800, sustainable: 1900, improvement: 32 },
    { industry: "Electronics", conventional: 1200, sustainable: 750, improvement: 38 },
    { industry: "Construction", conventional: 3500, sustainable: 2400, improvement: 31 },
    { industry: "Aerospace", conventional: 1800, sustainable: 1100, improvement: 39 },
    { industry: "Packaging", conventional: 900, sustainable: 600, improvement: 33 },
  ]

  const sustainabilityRadar = [
    { metric: "Carbon Footprint", current: 75, target: 90 },
    { metric: "Water Usage", current: 65, target: 85 },
    { metric: "Waste Reduction", current: 80, target: 95 },
    { metric: "Energy Efficiency", current: 70, target: 88 },
    { metric: "Circularity", current: 85, target: 92 },
    { metric: "Biodiversity", current: 60, target: 80 },
  ]

  const marketTrends = [
    { month: "Jan", copper: 8.2, aluminum: 2.0, steel: 0.75, gold: 62.1 },
    { month: "Feb", copper: 8.5, aluminum: 2.1, steel: 0.78, gold: 63.2 },
    { month: "Mar", copper: 8.1, aluminum: 1.9, steel: 0.76, gold: 61.8 },
    { month: "Apr", copper: 8.7, aluminum: 2.2, steel: 0.8, gold: 64.5 },
    { month: "May", copper: 8.9, aluminum: 2.3, steel: 0.82, gold: 65.1 },
    { month: "Jun", copper: 8.6, aluminum: 2.1, steel: 0.79, gold: 63.9 },
  ]

  const wasteStreamAnalysis = [
    { name: "Mining Waste", value: 45, color: "#8b5cf6" },
    { name: "Processing Waste", value: 25, color: "#3b82f6" },
    { name: "Manufacturing Waste", value: 20, color: "#22c55e" },
    { name: "End-of-Life", value: 10, color: "#eab308" },
  ]

  const kpiData = [
    {
      title: "Global CO₂ Reduction",
      value: "23.5%",
      change: "+2.1%",
      trend: "up",
      icon: <Leaf className="h-5 w-5" />,
      description: "vs 2019 baseline",
    },
    {
      title: "Circularity Rate",
      value: "76.8%",
      change: "+4.3%",
      trend: "up",
      icon: <Activity className="h-5 w-5" />,
      description: "materials in circular use",
    },
    {
      title: "Market Value",
      value: "$12.4B",
      change: "+8.7%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
      description: "recycled materials market",
    },
    {
      title: "Active Users",
      value: "45,230",
      change: "+12.4%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      description: "platform participants",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-professional">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover-lift">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Global Analytics
                  </h1>
                  <p className="text-sm text-muted-foreground">Sustainability & Circularity Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Select defaultValue="2024">
                <SelectTrigger className="w-32 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="px-4 py-2 shadow-sm">
                <Globe className="h-4 w-4 mr-2" />
                Global View
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {kpiData.map((kpi, index) => (
              <Card
                key={index}
                className="shadow-professional border-0 bg-card/80 backdrop-blur-sm hover-lift overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-2 bg-gradient-to-r from-primary to-chart-2"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                  <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg shadow-sm">
                    <div className="text-white">{kpi.icon}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{kpi.value}</div>
                  <div className="flex items-center text-xs">
                    <div
                      className={`flex items-center mr-2 font-medium ${
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {kpi.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {kpi.change}
                    </div>
                    <span className="text-muted-foreground">{kpi.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="emissions" className="space-y-8">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-5 min-w-[600px] bg-card/80 backdrop-blur-sm border-0 shadow-sm">
                <TabsTrigger
                  value="emissions"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <Zap className="h-4 w-4 mb-1" />
                    <span>Emissions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="circularity"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <Recycle className="h-4 w-4 mb-1" />
                    <span>Circularity</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="regional"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <Globe className="h-4 w-4 mb-1" />
                    <span>Regional</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="industry"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <BarChart3 className="h-4 w-4 mb-1" />
                    <span>Industry</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="sustainability"
                  className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex flex-col items-center">
                    <Leaf className="h-4 w-4 mb-1" />
                    <span>Sustainability</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="emissions" className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Global Emissions Reduction Trend</CardTitle>
                    </div>
                    <CardDescription>CO₂ emissions by material type over time (kt CO₂-eq)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        aluminum: { label: "Aluminum", color: "hsl(220, 70%, 50%)" },
                        copper: { label: "Copper", color: "hsl(25, 95%, 53%)" },
                        steel: { label: "Steel", color: "hsl(142, 76%, 36%)" },
                        total: { label: "Total", color: "hsl(262, 83%, 58%)" },
                      }}
                      className="h-[300px] sm:h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={globalEmissionsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="aluminum"
                            stackId="1"
                            stroke="var(--color-aluminum)"
                            fill="var(--color-aluminum)"
                            fillOpacity={0.7}
                          />
                          <Area
                            type="monotone"
                            dataKey="copper"
                            stackId="1"
                            stroke="var(--color-copper)"
                            fill="var(--color-copper)"
                            fillOpacity={0.7}
                          />
                          <Area
                            type="monotone"
                            dataKey="steel"
                            stackId="1"
                            stroke="var(--color-steel)"
                            fill="var(--color-steel)"
                            fillOpacity={0.7}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Waste Stream Analysis</CardTitle>
                    </div>
                    <CardDescription>Distribution of waste sources in metallurgy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        mining: { label: "Mining Waste", color: "hsl(262, 83%, 58%)" },
                        processing: { label: "Processing Waste", color: "hsl(220, 70%, 50%)" },
                        manufacturing: { label: "Manufacturing Waste", color: "hsl(142, 76%, 36%)" },
                        endoflife: { label: "End-of-Life", color: "hsl(48, 96%, 53%)" },
                      }}
                      className="h-[300px] sm:h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={wasteStreamAnalysis}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine={false}
                            fontSize={12}
                          >
                            {wasteStreamAnalysis.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Market Price Trends</CardTitle>
                  </div>
                  <CardDescription>Material prices over the last 6 months ($/kg)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      copper: { label: "Copper", color: "hsl(25, 95%, 53%)" },
                      aluminum: { label: "Aluminum", color: "hsl(220, 70%, 50%)" },
                      steel: { label: "Steel", color: "hsl(142, 76%, 36%)" },
                      gold: { label: "Gold", color: "hsl(48, 96%, 53%)" },
                    }}
                    className="h-[250px] sm:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="copper" stroke="var(--color-copper)" strokeWidth={3} />
                        <Line type="monotone" dataKey="aluminum" stroke="var(--color-aluminum)" strokeWidth={3} />
                        <Line type="monotone" dataKey="steel" stroke="var(--color-steel)" strokeWidth={3} />
                        <Line type="monotone" dataKey="gold" stroke="var(--color-gold)" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="circularity" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <Recycle className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Circular Economy Performance by Material</CardTitle>
                  </div>
                  <CardDescription>Breakdown of recycling, reuse, and recovery rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      recycling: { label: "Recycling", color: "hsl(142, 76%, 36%)" },
                      reuse: { label: "Reuse", color: "hsl(220, 70%, 50%)" },
                      recovery: { label: "Recovery", color: "hsl(48, 96%, 53%)" },
                    }}
                    className="h-[350px] sm:h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={circularityMetrics} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis
                          dataKey="material"
                          type="category"
                          width={80}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="recycling" stackId="a" fill="var(--color-recycling)" />
                        <Bar dataKey="reuse" stackId="a" fill="var(--color-reuse)" />
                        <Bar dataKey="recovery" stackId="a" fill="var(--color-recovery)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card className="shadow-professional border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-800 dark:text-green-200">Best Performer</CardTitle>
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">Steel</div>
                    <div className="text-sm text-green-600 dark:text-green-400 mb-3">92% recycling rate</div>
                    <Badge className="bg-green-500 text-white hover:bg-green-600 shadow-sm">Industry Leader</Badge>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950 dark:to-cyan-900 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Most Improved</CardTitle>
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">Aluminum</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">+8% improvement YoY</div>
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600 shadow-sm">Rising Star</Badge>
                  </CardContent>
                </Card>
                <Card className="shadow-professional border-0 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-amber-800 dark:text-amber-200">Opportunity</CardTitle>
                      <Activity className="h-5 w-5 text-amber-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-2">Gold</div>
                    <div className="text-sm text-amber-600 dark:text-amber-400 mb-3">65% recycling potential</div>
                    <Badge className="bg-amber-500 text-white hover:bg-amber-600 shadow-sm">Growth Potential</Badge>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Regional Analysis */}
            <TabsContent value="regional" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Regional Performance Comparison</CardTitle>
                  </div>
                  <CardDescription>
                    Emissions, recycling rates, and market value by region
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      emissions: { label: "Emissions (kt CO₂)", color: "hsl(0, 84%, 60%)" },
                      recycling: { label: "Recycling Rate (%)", color: "hsl(142, 76%, 36%)" },
                      value: { label: "Market Value ($B)", color: "hsl(220, 70%, 50%)" },
                    }}
                    className="h-[350px] sm:h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="emissions" fill="var(--color-emissions)" />
                        <Bar dataKey="recycling" fill="var(--color-recycling)" />
                        <Bar dataKey="value" fill="var(--color-value)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {regionalData.map((region, index) => (
                  <Card
                    key={index}
                    className="shadow-professional border-0 bg-card/80 backdrop-blur-sm hover-lift overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-2 bg-gradient-to-r from-primary to-chart-2"></div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-center">{region.region}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-red-600">{region.emissions}</div>
                        <div className="text-xs text-muted-foreground">kt CO₂</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{region.recycling}%</div>
                        <div className="text-xs text-muted-foreground">recycling</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">${region.value}B</div>
                        <div className="text-xs text-muted-foreground">market value</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Industry Comparison */}
            <TabsContent value="industry" className="space-y-6 animate-fade-in-up">
              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Industry Sustainability Comparison</CardTitle>
                  </div>
                  <CardDescription>
                    Conventional vs sustainable methods across industries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      conventional: { label: "Conventional", color: "hsl(0, 84%, 60%)" },
                      sustainable: { label: "Sustainable", color: "hsl(142, 76%, 36%)" },
                    }}
                    className="h-[350px] sm:h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={industryComparison}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="industry" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="conventional" fill="var(--color-conventional)" />
                        <Bar dataKey="sustainable" fill="var(--color-sustainable)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {industryComparison.map((industry, index) => (
                  <Card
                    key={index}
                    className="shadow-professional border-0 bg-card/80 backdrop-blur-sm hover-lift overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xs sm:text-sm text-center">{industry.industry}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">
                        -{industry.improvement}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {industry.conventional - industry.sustainable} kg CO₂ saved
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Sustainability Score */}
            <TabsContent value="sustainability" className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Sustainability Performance Radar</CardTitle>
                    </div>
                    <CardDescription>Current performance vs targets across key metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        current: { label: "Current", color: "hsl(220, 70%, 50%)" },
                        target: { label: "Target", color: "hsl(142, 76%, 36%)" },
                      }}
                      className="h-[300px] sm:h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={sustainabilityRadar}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="metric" fontSize={12} />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                          <Radar
                            name="Current"
                            dataKey="current"
                            stroke="var(--color-current)"
                            fill="var(--color-current)"
                            fillOpacity={0.4}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Target"
                            dataKey="target"
                            stroke="var(--color-target)"
                            fill="var(--color-target)"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Sustainability Score Breakdown</CardTitle>
                    </div>
                    <CardDescription>Detailed performance metrics and improvement areas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sustainabilityRadar.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{metric.metric}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {metric.current}/{metric.target}
                            </span>
                            {metric.current >= metric.target ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200">
                                Target Met
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                {metric.target - metric.current} to go
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-primary to-chart-2 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${(metric.current / metric.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">Key Insights & Recommendations</CardTitle>
                  </div>
                  <CardDescription>AI-generated insights based on global sustainability data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-6 rounded-xl border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-4 text-green-800 dark:text-green-200 flex items-center">
                        <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                        Strengths
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Circularity rate exceeds industry average by 12%
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Waste reduction targets consistently met
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Strong performance in carbon footprint reduction
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950 dark:to-yellow-900 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                      <h4 className="font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center">
                        <div className="h-3 w-3 bg-amber-500 rounded-full mr-3"></div>
                        Improvement Areas
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Water usage efficiency needs attention
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Biodiversity impact mitigation required
                          </p>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Energy efficiency can be optimized further
                          </p>
                        </div>
                      </div>
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
