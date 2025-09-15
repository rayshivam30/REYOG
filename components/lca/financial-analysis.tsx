"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Calculator, PieChart, BarChart3, Target } from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from "recharts"

interface FinancialMetrics {
  npv: number
  irr: number
  paybackPeriod: number
  totalInvestment: number
  annualSavings: number
  carbonPrice: number
  regulatoryCosts: number
  operationalSavings: number
}

interface CostBreakdown {
  category: string
  conventional: number
  sustainable: number
  savings: number
  unit: string
  color: string
}

export default function FinancialAnalysis() {
  const [carbonPrice, setCarbonPrice] = useState<number>(50) // $/tonne CO2
  const [discountRate, setDiscountRate] = useState<number>(8) // %
  const [analysisYears, setAnalysisYears] = useState<number>(20)

  // Financial metrics
  const financialMetrics: FinancialMetrics = {
    npv: 3.2, // Million USD
    irr: 18.5, // %
    paybackPeriod: 4.2, // years
    totalInvestment: 12.5, // Million USD
    annualSavings: 3.8, // Million USD
    carbonPrice: carbonPrice,
    regulatoryCosts: 0.8, // Million USD avoided
    operationalSavings: 3.0 // Million USD
  }

  // Cost breakdown comparison
  const costBreakdown: CostBreakdown[] = [
    {
      category: "Energy Costs",
      conventional: 8.5,
      sustainable: 5.2,
      savings: 3.3,
      unit: "Million USD/year",
      color: "#ef4444"
    },
    {
      category: "Raw Materials",
      conventional: 15.2,
      sustainable: 9.8,
      savings: 5.4,
      unit: "Million USD/year",
      color: "#f97316"
    },
    {
      category: "Waste Management",
      conventional: 2.8,
      sustainable: 1.1,
      savings: 1.7,
      unit: "Million USD/year",
      color: "#eab308"
    },
    {
      category: "Regulatory Compliance",
      conventional: 1.5,
      sustainable: 0.7,
      savings: 0.8,
      unit: "Million USD/year",
      color: "#22c55e"
    },
    {
      category: "Water Treatment",
      conventional: 1.2,
      sustainable: 0.4,
      savings: 0.8,
      unit: "Million USD/year",
      color: "#3b82f6"
    },
    {
      category: "Carbon Credits",
      conventional: 0,
      sustainable: -2.1,
      savings: 2.1,
      unit: "Million USD/year",
      color: "#8b5cf6"
    }
  ]

  // Cash flow projection
  const cashFlowData = Array.from({ length: analysisYears }, (_, i) => {
    const year = i + 1
    const conventionalCost = 29.2 * Math.pow(1.03, i) // 3% inflation
    const sustainableCost = 15.1 * Math.pow(1.03, i)
    const savings = conventionalCost - sustainableCost
    const cumulativeSavings = i === 0 ? savings : savings + (i * 14.1 * Math.pow(1.03, i-1))
    
    return {
      year,
      conventionalCost,
      sustainableCost,
      savings,
      cumulativeSavings,
      investment: i === 0 ? -12.5 : 0,
      netCashFlow: i === 0 ? savings - 12.5 : savings,
      cumulativeNetCashFlow: i === 0 ? savings - 12.5 : (i * 14.1 * Math.pow(1.03, i-1)) - 12.5
    }
  })

  // Carbon pricing scenarios
  const carbonScenarios = [
    { price: 25, npv: 1.8, irr: 12.3, payback: 6.1 },
    { price: 50, npv: 3.2, irr: 18.5, payback: 4.2 },
    { price: 75, npv: 4.6, irr: 24.1, payback: 3.1 },
    { price: 100, npv: 6.0, irr: 29.2, payback: 2.5 },
    { price: 150, npv: 8.8, irr: 38.7, payback: 1.8 }
  ]

  // Investment breakdown
  const investmentBreakdown = [
    { name: 'Equipment & Technology', value: 7.5, color: '#ef4444' },
    { name: 'Infrastructure', value: 2.8, color: '#f97316' },
    { name: 'Training & Implementation', value: 1.2, color: '#eab308' },
    { name: 'Contingency', value: 1.0, color: '#22c55e' }
  ]

  // Risk analysis
  const riskFactors = [
    {
      factor: "Technology Risk",
      probability: 15,
      impact: "Medium",
      mitigation: "Proven technology with vendor guarantees",
      financialImpact: 0.8
    },
    {
      factor: "Regulatory Changes",
      probability: 25,
      impact: "High",
      mitigation: "Compliance buffer and monitoring system",
      financialImpact: 1.5
    },
    {
      factor: "Market Price Volatility",
      probability: 40,
      impact: "Medium",
      mitigation: "Hedging strategies and flexible contracts",
      financialImpact: 1.2
    },
    {
      factor: "Implementation Delays",
      probability: 20,
      impact: "Low",
      mitigation: "Detailed project planning and contingencies",
      financialImpact: 0.5
    }
  ]

  const calculateNPV = (cashFlows: number[], discountRate: number): number => {
    return cashFlows.reduce((npv, cashFlow, index) => {
      return npv + cashFlow / Math.pow(1 + discountRate / 100, index)
    }, 0)
  }

  const calculateIRR = (cashFlows: number[]): number => {
    // Simplified IRR calculation (in practice, would use more sophisticated method)
    let rate = 0.1
    for (let i = 0; i < 100; i++) {
      const npv = calculateNPV(cashFlows, rate * 100)
      if (Math.abs(npv) < 0.01) return rate * 100
      rate += npv > 0 ? 0.01 : -0.01
    }
    return rate * 100
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Financial Analysis & Business Case</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive economic evaluation of sustainable metallurgy implementation
        </p>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-professional border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${financialMetrics.npv.toFixed(1)}M
            </div>
            <div className="text-sm font-medium mb-1">Net Present Value</div>
            <div className="text-xs text-muted-foreground">20-year projection</div>
          </CardContent>
        </Card>
        <Card className="shadow-professional border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {financialMetrics.irr.toFixed(1)}%
            </div>
            <div className="text-sm font-medium mb-1">Internal Rate of Return</div>
            <div className="text-xs text-muted-foreground">Above target 15%</div>
          </CardContent>
        </Card>
        <Card className="shadow-professional border-0 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {financialMetrics.paybackPeriod.toFixed(1)}
            </div>
            <div className="text-sm font-medium mb-1">Payback Period</div>
            <div className="text-xs text-muted-foreground">years</div>
          </CardContent>
        </Card>
        <Card className="shadow-professional border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              ${financialMetrics.annualSavings.toFixed(1)}M
            </div>
            <div className="text-sm font-medium mb-1">Annual Savings</div>
            <div className="text-xs text-muted-foreground">operational cost reduction</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cost-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
          <TabsTrigger value="cost-analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger value="carbon-pricing" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Target className="h-4 w-4 mr-2" />
            Carbon Pricing
          </TabsTrigger>
          <TabsTrigger value="investment" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <PieChart className="h-4 w-4 mr-2" />
            Investment
          </TabsTrigger>
          <TabsTrigger value="risk-analysis" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Calculator className="h-4 w-4 mr-2" />
            Risk Analysis
          </TabsTrigger>
        </TabsList>

        {/* Cost Analysis Tab */}
        <TabsContent value="cost-analysis" className="space-y-6">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Cost Comparison Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of operational costs: conventional vs sustainable methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Cost (Million USD/year)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`$${value}M`, 'Cost']} />
                    <Legend />
                    <Bar dataKey="conventional" fill="#ef4444" name="Conventional Method" />
                    <Bar dataKey="sustainable" fill="#22c55e" name="Sustainable Method" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {costBreakdown.map((item, index) => (
              <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{item.category}</CardTitle>
                  <CardDescription>Annual cost comparison</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">${item.conventional}M</div>
                      <div className="text-sm text-muted-foreground">Conventional</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${item.sustainable}M</div>
                      <div className="text-sm text-muted-foreground">Sustainable</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-muted/20 to-card/50 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">${item.savings}M</div>
                    <div className="text-sm text-muted-foreground">Annual Savings</div>
                    <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {((item.savings / item.conventional) * 100).toFixed(0)}% reduction
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cash-flow" className="space-y-6">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">20-Year Cash Flow Projection</CardTitle>
              <CardDescription>
                Projected cash flows and cumulative savings over the analysis period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashFlowData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Cash Flow (Million USD)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => [`$${value.toFixed(1)}M`, 'Cash Flow']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      name="Annual Savings"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cumulativeSavings" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Cumulative Savings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Break-even Analysis</CardTitle>
                <CardDescription>When investment pays for itself</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">{financialMetrics.paybackPeriod.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Years to break-even</div>
                <Progress value={(financialMetrics.paybackPeriod / 10) * 100} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  Investment recovered in {Math.floor(financialMetrics.paybackPeriod)} years, {Math.round((financialMetrics.paybackPeriod % 1) * 12)} months
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Total Cost of Ownership</CardTitle>
                <CardDescription>20-year TCO comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Conventional TCO</span>
                    <span className="font-bold text-red-600">$584M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sustainable TCO</span>
                    <span className="font-bold text-green-600">$315M</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium">Total Savings</span>
                    <span className="font-bold text-primary">$269M</span>
                  </div>
                </div>
                <Badge className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  46% TCO Reduction
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Return Metrics</CardTitle>
                <CardDescription>Investment return analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI (5 years)</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      152%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROIC</span>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      24.3%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Economic Value Added</span>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      $2.1M/year
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carbon Pricing Tab */}
        <TabsContent value="carbon-pricing" className="space-y-6">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Carbon Price Sensitivity Analysis</CardTitle>
              <CardDescription>
                Impact of different carbon pricing scenarios on project economics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={carbonScenarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="price" 
                      label={{ value: 'Carbon Price ($/tonne CO₂)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'NPV (Million USD)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: 'IRR (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="npv" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      name="NPV (Million USD)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="irr" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="IRR (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {carbonScenarios.map((scenario, index) => (
              <Card key={index} className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-center">${scenario.price}/tonne</CardTitle>
                  <CardDescription className="text-center">Carbon Price</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">${scenario.npv.toFixed(1)}M</div>
                    <div className="text-xs text-muted-foreground">NPV</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">{scenario.irr.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">IRR</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{scenario.payback.toFixed(1)}y</div>
                    <div className="text-xs text-muted-foreground">Payback</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Investment Tab */}
        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Investment Breakdown</CardTitle>
                <CardDescription>Total investment: ${financialMetrics.totalInvestment}M</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={investmentBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {investmentBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value}M`, 'Investment']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Funding Sources</CardTitle>
                <CardDescription>Recommended financing structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { source: "Internal Cash Flow", amount: 5.0, percentage: 40, color: "bg-green-500" },
                  { source: "Green Bonds", amount: 3.8, percentage: 30, color: "bg-blue-500" },
                  { source: "Government Grants", amount: 2.5, percentage: 20, color: "bg-purple-500" },
                  { source: "Equipment Financing", amount: 1.2, percentage: 10, color: "bg-orange-500" }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.source}</span>
                      <span className="text-sm text-muted-foreground">${item.amount}M ({item.percentage}%)</span>
                    </div>
                    <div className="relative">
                      <Progress value={item.percentage} className="h-3" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Investment Timeline</CardTitle>
              <CardDescription>Phased implementation approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { phase: "Phase 1: Planning & Design", duration: "6 months", investment: 1.5, activities: "Engineering, permits, procurement" },
                  { phase: "Phase 2: Infrastructure", duration: "12 months", investment: 4.2, activities: "Site preparation, construction, utilities" },
                  { phase: "Phase 3: Equipment Installation", duration: "8 months", investment: 5.8, activities: "Equipment delivery, installation, testing" },
                  { phase: "Phase 4: Commissioning", duration: "4 months", investment: 1.0, activities: "Training, startup, optimization" }
                ].map((phase, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{phase.phase}</span>
                      <Badge variant="outline">${phase.investment}M</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Duration: {phase.duration}</div>
                      <div>Activities: {phase.activities}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Analysis Tab */}
        <TabsContent value="risk-analysis" className="space-y-6">
          <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Financial Risk Assessment</CardTitle>
              <CardDescription>Key risks and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{risk.factor}</span>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          risk.impact === "High" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                          risk.impact === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }>
                          {risk.impact} Impact
                        </Badge>
                        <span className="text-sm text-muted-foreground">{risk.probability}% probability</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{risk.mitigation}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Potential Financial Impact</span>
                      <span className="font-medium text-red-600">${risk.financialImpact}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Risk-Adjusted Returns</CardTitle>
                <CardDescription>Financial metrics adjusted for risk</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk-Adjusted NPV</span>
                    <span className="font-bold text-green-600">$2.4M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk-Adjusted IRR</span>
                    <span className="font-bold text-blue-600">15.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Value at Risk (95%)</span>
                    <span className="font-bold text-red-600">$1.8M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sharpe Ratio</span>
                    <span className="font-bold text-purple-600">1.42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Scenario Analysis</CardTitle>
                <CardDescription>Best, base, and worst case scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { scenario: "Best Case", npv: 5.8, irr: 28.4, probability: 25, color: "text-green-600" },
                  { scenario: "Base Case", npv: 3.2, irr: 18.5, probability: 50, color: "text-blue-600" },
                  { scenario: "Worst Case", npv: 0.8, irr: 9.2, probability: 25, color: "text-red-600" }
                ].map((scenario, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-muted/20 to-card/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{scenario.scenario}</span>
                      <span className="text-sm text-muted-foreground">{scenario.probability}% probability</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">NPV: </span>
                        <span className={`font-bold ${scenario.color}`}>${scenario.npv}M</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IRR: </span>
                        <span className={`font-bold ${scenario.color}`}>{scenario.irr}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}