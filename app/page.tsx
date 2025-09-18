"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Leaf,
  Recycle,
  BarChart3,
  Globe,
  Zap,
  Shield,
  Award,
  Users,
  TrendingUp,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import dynamic from 'next/dynamic';

// Dynamically import the IndiaMap component with no SSR
const IndiaMap = dynamic(() => import('@/components/dashboard/IndiaMap'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading map...</div>
});

// Sample data for minerals and their mines in India
const mineralData: Record<string, { name: string; mines: Mine[] }> = {
  aluminium: {
    name: 'Aluminium',
    mines: [
      { id: 1, name: 'Nalco Mines', state: 'Odisha', lat: 20.8, lng: 85.8 },
      { id: 2, name: 'Balco Mines', state: 'Chhattisgarh', lat: 22.0, lng: 82.5 },
      { id: 3, name: 'Vedanta Lanjigarh', state: 'Odisha', lat: 19.7, lng: 83.4 },
      { id: 4, name: 'Hindalco Belgaum', state: 'Karnataka', lat: 15.8, lng: 74.5 },
      { id: 5, name: 'Korba Bauxite', state: 'Chhattisgarh', lat: 22.3, lng: 82.7 },
    ]
  },
  copper: {
    name: 'Copper',
    mines: [
      { id: 1, name: 'Khetri Copper Complex', state: 'Rajasthan', lat: 28.0, lng: 75.8 },
      { id: 2, name: 'Malanjkhand Copper Project', state: 'Madhya Pradesh', lat: 22.1, lng: 80.7 },
      { id: 3, name: 'Tuticorin Smelter', state: 'Tamil Nadu', lat: 8.8, lng: 78.1 },
      { id: 4, name: 'Ghatsila Copper Mines', state: 'Jharkhand', lat: 22.6, lng: 86.5 },
      { id: 5, name: 'Singhbhum Copper Belt', state: 'Jharkhand', lat: 22.8, lng: 86.2 },
    ]
  },
  lithium: {
    name: 'Lithium',
    mines: [
      { id: 1, name: 'Mandya Lithium Deposit', state: 'Karnataka', lat: 12.5, lng: 76.9 },
      { id: 2, name: 'Marlagalla Lithium Belt', state: 'Karnataka', lat: 13.2, lng: 76.5 },
    ]
  },
  steel: {
    name: 'Steel',
    mines: [
      { id: 1, name: 'Bailadila Iron Ore Mine', state: 'Chhattisgarh', lat: 18.7, lng: 81.2 },
      { id: 2, name: 'Noamundi Iron Mine', state: 'Jharkhand', lat: 22.2, lng: 85.5 },
      { id: 3, name: 'Dalli Rajhara Mine', state: 'Chhattisgarh', lat: 20.6, lng: 81.1 },
      { id: 4, name: 'Kudremukh Iron Ore', state: 'Karnataka', lat: 13.2, lng: 75.3 },
      { id: 5, name: 'Kiriburu Iron Ore Mine', state: 'Jharkhand', lat: 22.1, lng: 85.3 },
    ]
  },
  gold: {
    name: 'Gold',
    mines: [
      { id: 1, name: 'Kolar Gold Fields', state: 'Karnataka', lat: 13.1, lng: 78.3 },
      { id: 2, name: 'Hutti Gold Mines', state: 'Karnataka', lat: 16.2, lng: 76.7 },
      { id: 3, name: 'Ramagiri Gold Field', state: 'Andhra Pradesh', lat: 13.9, lng: 77.6 },
    ]
  },
  silver: {
    name: 'Silver',
    mines: [
      { id: 1, name: 'Zawar Mines', state: 'Rajasthan', lat: 24.3, lng: 73.7 },
      { id: 2, name: 'Tundoo Lead-Zinc Mine', state: 'Jharkhand', lat: 22.9, lng: 86.2 },
      { id: 3, name: 'Rampura Agucha Mine', state: 'Rajasthan', lat: 25.6, lng: 74.7 },
    ]
  }
} as const;

// Define Mine type for TypeScript
type Mine = {
  id: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
};

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('aluminium');

  const materials = [
    {
      name: "Aluminum",
      icon: "🔩",
      description: "Lightweight metal for aerospace & automotive",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Copper",
      icon: "⚡",
      description: "Essential for electrical & construction",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Steel",
      icon: "🏗️",
      description: "Foundation of infrastructure & manufacturing",
      color: "from-gray-500 to-slate-600",
    },
    {
      name: "Lithium",
      icon: "🔋",
      description: "Critical for battery technology",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Gold",
      icon: "💰",
      description: "Precious metal for electronics & jewelry",
      color: "from-yellow-500 to-amber-500",
    },
    {
      name: "Silver",
      icon: "✨",
      description: "Industrial applications & electronics",
      color: "from-gray-400 to-slate-500",
    },
  ]

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Comprehensive LCA Analysis",
      description: "ISO 14040 compliant assessments with real-time calculations and detailed impact categories",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Recycle className="h-8 w-8" />,
      title: "Circularity Metrics",
      description: "Advanced circular economy indicators and actionable sustainability recommendations",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Insights",
      description: "Machine learning models for predictive environmental impact and optimization",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Database",
      description: "Access to official government and industry databases with real-time updates",
      color: "from-orange-500 to-red-500",
    },
  ]

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "500+", label: "Companies Trust Us" },
    { icon: <BarChart3 className="h-6 w-6" />, value: "10,000+", label: "LCA Analyses Completed" },
    { icon: <Award className="h-6 w-6" />, value: "ISO 14040", label: "Certified Compliance" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "35%", label: "Average CO₂ Reduction" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                MINECARE-India
              </span>
              <div className="text-xs text-muted-foreground hidden sm:block">Professional LCA Platform</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/lca" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              LCA Analysis
            </Link>
            <Link href="/ewaste" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              E-Waste Service
            </Link>
            <Link
              href="/marketplace"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link href="/analytics" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Analytics
            </Link>
          </nav>
          <div className="hidden md:block">
            <Link href="/lca">
              <Button className="shadow-lg hover-lift">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card/95 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="/lca"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LCA Analysis
              </Link>
              <Link
                href="/ewaste"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                E-Waste Service
              </Link>
              <Link
                href="/marketplace"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/analytics"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <div className="pt-4 border-t">
                <Link href="/lca" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full shadow-lg hover-lift">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-accent/5"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div className="animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 px-3 md:px-4 py-2 text-xs md:text-sm font-medium shadow-sm">
              <Shield className="h-3 md:h-4 w-3 md:w-4 mr-2" />
              <span className="hidden sm:inline">ISO 14040 Compliant • AI-Powered • Industry Leading</span>
              <span className="sm:hidden">ISO 14040 • AI-Powered</span>
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-balance mb-6 md:mb-8 leading-tight">
              AI-Driven Life Cycle Assessment for{" "}
              <span className="bg-gradient-to-r from-primary via-chart-2 to-accent bg-clip-text text-transparent">
                Sustainable Metallurgy
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-balance mb-8 md:mb-10 leading-relaxed max-w-4xl mx-auto">
              Transform your metallurgy operations with comprehensive LCA analysis, circularity metrics, and AI-powered
              sustainability insights. Built for mining and metallurgical professionals who demand precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link href="/lca">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 px-6 w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-xl hover-lift"
                  style={{
                    background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Start LCA Analysis
                  <ArrowRight className="ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5" />
                </button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-lg hover-lift bg-card/50 backdrop-blur-sm border-border"
                >
                  View Live Demo
                  <BarChart3 className="ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mx-auto mb-2 md:mb-3 p-2 md:p-3 bg-primary/10 rounded-xl w-fit">
                  <div className="text-primary scale-75 md:scale-100">{stat.icon}</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Select Your Material</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Choose from our comprehensive database of metals and minerals with real-time market data
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {materials.map((material, index) => (
              <Card
                key={index}
                className="hover-lift cursor-pointer group border-0 shadow-professional bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${material.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {material.icon}
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{material.name}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/lca?material=${material.name.toLowerCase()}`}>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full shadow-lg hover-lift"
                      style={{
                        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Analyze {material.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-muted/20 to-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">India Mineral Resources Map</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Explore the geographical distribution of key mineral resources across India
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-6xl mx-auto">
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Mineral Type</h3>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                  >
                    {materials.map((material) => (
                      <option key={material.name} value={material.name.toLowerCase()}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  
                  <div className="mt-8">
                    <h4 className="text-lg font-medium mb-3">
                      {materials.find(m => m.name.toLowerCase() === selectedMaterial)?.name} Mines in India
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {mineralData[selectedMaterial as keyof typeof mineralData]?.mines.map((mine) => (
                        <Link 
                          key={mine.id} 
                          href={`/lca?material=${selectedMaterial}`}
                          className="block hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm">
                            <h5 className="font-medium text-gray-900">{mine.name}</h5>
                            <p className="text-sm text-gray-600">{mine.state}</p>
                          </div>
                        </Link>
                      )) || (
                        <p className="text-gray-500">No mine data available for this mineral</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2 h-[500px] bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <IndiaMap 
                    mines={mineralData[selectedMaterial as keyof typeof mineralData]?.mines || []} 
                    mineral={materials.find(m => m.name.toLowerCase() === selectedMaterial)?.name || ''} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-muted/30 to-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Platform Features</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Comprehensive tools for sustainable metallurgy analysis with industry-leading accuracy
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover-lift border-0 shadow-professional bg-card/80 backdrop-blur-sm overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${feature.color}`}></div>
                <CardHeader className="pb-6">
                  <div className={`mb-4 p-4 bg-gradient-to-br ${feature.color} rounded-xl w-fit shadow-lg`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-primary via-chart-2 to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-balance">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 opacity-90 text-balance max-w-3xl mx-auto leading-relaxed">
              Join leading metallurgy professionals using EcoLCA Pro for sustainable operations and regulatory
              compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link href="/lca">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-xl hover-lift bg-white text-primary border-0 hover:bg-white/90"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base md:text-lg px-8 md:px-10 py-3 md:py-4 shadow-lg hover-lift border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
                >
                  Contact Sales
                  <Users className="ml-2 md:ml-3 h-4 md:h-5 w-4 md:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card/50 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-8 bg-gradient-to-br from-primary to-chart-2 rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EcoLCA Pro</span>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Professional LCA platform for sustainable metallurgy and mining operations. Trusted by industry leaders
                worldwide.
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  ISO 14040 Certified
                </Badge>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Platform</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/lca" className="hover:text-primary transition-colors">
                    LCA Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/ewaste" className="hover:text-primary transition-colors">
                    E-Waste Service
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-primary transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-primary transition-colors">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Resources</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-primary transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>
              &copy; 2024 EcoLCA Pro. All rights reserved. Built for sustainable metallurgy and environmental
              excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
