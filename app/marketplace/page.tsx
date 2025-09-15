"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Star,
  TrendingUp,
  ShoppingCart,
  Package,
  MessageSquare,
  Zap,
  Award,
  Users,
  DollarSign,
  BarChart3,
  Globe,
  Leaf,
} from "lucide-react"
import Link from "next/link"

export default function MarketplacePage() {
  const [userRole, setUserRole] = useState<"buyer" | "seller" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedListing, setSelectedListing] = useState<any | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Mock marketplace data
  const listings = [
    {
      id: 1,
      title: "High-Grade Copper Wire Scrap",
      seller: "MetalWorks Inc.",
      location: "Detroit, MI",
      price: 8.5,
      unit: "per kg",
      quantity: 2500,
      material: "Copper",
      purity: "99.9%",
      rating: 4.8,
      image: "/copper-wire-scrap.jpg",
      verified: true,
      co2Saved: 1250,
      sustainability: "A+",
    },
    {
      id: 2,
      title: "Aluminum Automotive Parts",
      seller: "AutoRecycle Pro",
      location: "Phoenix, AZ",
      price: 2.1,
      unit: "per kg",
      quantity: 5000,
      material: "Aluminum",
      purity: "95%",
      rating: 4.6,
      image: "/aluminum-automotive-parts.jpg",
      verified: true,
      co2Saved: 3200,
      sustainability: "A",
    },
    {
      id: 3,
      title: "Electronic Circuit Boards",
      seller: "TechSalvage LLC",
      location: "San Jose, CA",
      price: 15.2,
      unit: "per kg",
      quantity: 800,
      material: "Mixed Metals",
      purity: "Various",
      rating: 4.9,
      image: "/electronic-circuit-boards.jpg",
      verified: true,
      co2Saved: 890,
      sustainability: "A+",
    },
    {
      id: 4,
      title: "Steel Manufacturing Byproducts",
      seller: "Industrial Metals Co.",
      location: "Pittsburgh, PA",
      price: 0.8,
      unit: "per kg",
      quantity: 15000,
      material: "Steel",
      purity: "92%",
      rating: 4.4,
      image: "/steel-manufacturing-byproducts.jpg",
      verified: false,
      co2Saved: 8500,
      sustainability: "B+",
    },
  ]

  const aiRecommendations = [
    {
      title: "High-Purity Copper for Electronics",
      match: 95,
      reason: "Perfect match for your electronics manufacturing requirements",
      supplier: "MetalWorks Inc.",
      price: 8.5,
      co2Impact: 1250,
      sustainability: "A+",
    },
    {
      title: "Recycled Aluminum Alloy",
      match: 88,
      reason: "Suitable for automotive component production",
      supplier: "AutoRecycle Pro",
      price: 2.1,
      co2Impact: 3200,
      sustainability: "A",
    },
    {
      title: "Precious Metal Recovery Boards",
      match: 82,
      reason: "High gold content matches your processing capabilities",
      supplier: "TechSalvage LLC",
      price: 15.2,
      co2Impact: 890,
      sustainability: "A+",
    },
  ]

  const marketTrends = [
    { material: "Copper", price: 8.5, change: 2.3, trend: "up" },
    { material: "Aluminum", price: 2.1, change: -1.2, trend: "down" },
    { material: "Steel", price: 0.8, change: 0.5, trend: "up" },
    { material: "Gold", price: 65.2, change: 1.8, trend: "up" },
    { material: "Silver", price: 0.85, change: -0.3, trend: "down" },
  ]

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
        {/* Header */}
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
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                    Scrap Marketplace
                  </h1>
                  <p className="text-sm text-muted-foreground">Circular Economy Trading Platform</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Role Selection */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Welcome to the Scrap Marketplace
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Connect buyers and sellers in the circular economy. Reduce waste, maximize value, and contribute to a
                sustainable future.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-primary">45K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-chart-2">$12.4M</div>
                <div className="text-sm text-muted-foreground">Materials Traded</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-chart-3">2.3M kg</div>
                <div className="text-sm text-muted-foreground">CO₂ Saved</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-chart-4">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card
                className="cursor-pointer hover-lift shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                onClick={() => setUserRole("buyer")}
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl w-fit shadow-lg">
                    <ShoppingCart className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">I'm a Buyer</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Looking for recycled materials, metals, or industrial byproducts for my operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">AI Recommendations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Quality Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Price Analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Direct Communication</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
                    Start Buying
                  </Button>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover-lift shadow-professional border-0 bg-card/80 backdrop-blur-sm overflow-hidden animate-fade-in-up"
                style={{ animationDelay: "0.1s" }}
                onClick={() => setUserRole("seller")}
              >
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl w-fit shadow-lg">
                    <Package className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-3">I'm a Seller</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    I have scrap materials, byproducts, or waste streams to sell or repurpose
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Easy Listing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Price Optimization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Buyer Matching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Logistics Support</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
                    Start Selling
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-card/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-professional">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setUserRole(null)} className="hover-lift">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Role
            </Button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-chart-2 rounded-xl flex items-center justify-center shadow-lg">
                {userRole === "buyer" ? (
                  <ShoppingCart className="h-5 w-5 text-white" />
                ) : (
                  <Package className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  {userRole === "buyer" ? "Buyer Dashboard" : "Seller Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">Marketplace Platform</p>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="px-4 py-2 shadow-sm capitalize">
            {userRole === "buyer" ? <ShoppingCart className="h-4 w-4 mr-2" /> : <Package className="h-4 w-4 mr-2" />}
            {userRole}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {userRole === "buyer" ? (
            <Tabs defaultValue="browse" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
                <TabsTrigger
                  value="browse"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Browse Materials</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="recommendations"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>AI Recommendations</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Market Analytics</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* Browse Materials */}
              <TabsContent value="browse" className="space-y-6 animate-fade-in-up">
                {/* Search and Filters */}
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                        <Search className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Find Materials</CardTitle>
                    </div>
                    <CardDescription>Search and filter available materials and byproducts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search materials, locations, or suppliers..."
                            className="pl-10 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full md:w-48 shadow-sm">
                          <SelectValue placeholder="Material Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="copper">Copper</SelectItem>
                          <SelectItem value="aluminum">Aluminum</SelectItem>
                          <SelectItem value="steel">Steel</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="mixed">Mixed Metals</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" className="shadow-sm hover-lift bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Listings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing, index) => (
                    <Card
                      key={listing.id}
                      className="shadow-professional border-0 bg-card/80 backdrop-blur-sm hover-lift overflow-hidden animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {listing.verified && (
                            <Badge className="bg-green-600 hover:bg-green-700 shadow-sm">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {listing.sustainability}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg leading-tight">{listing.title}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">
                            ${listing.price} <span className="text-sm font-normal text-muted-foreground">/kg</span>
                          </span>
                          <Badge variant="outline" className="shadow-sm">
                            {listing.quantity.toLocaleString()}kg available
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Material:</span>
                            <span className="font-medium">{listing.material}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-muted-foreground">Purity:</span>
                            <span className="font-medium">{listing.purity}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Leaf className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                              {listing.co2Saved}kg CO₂ saved
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{listing.rating}</span>
                            <span className="text-sm text-muted-foreground">({listing.seller})</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button className="flex-1 shadow-sm" onClick={() => { setSelectedListing(listings[index]); setContactOpen(true) }}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Seller
                          </Button>
                          <Button variant="outline" size="icon" className="shadow-sm hover-lift bg-transparent" onClick={() => { setSelectedListing(listings[index]); setDetailsOpen(true) }}>
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* AI Recommendations */}
              <TabsContent value="recommendations" className="space-y-6 animate-fade-in-up">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">AI-Powered Recommendations</CardTitle>
                    </div>
                    <CardDescription>
                      Based on your requirements: 10 tons copper, electronics manufacturing grade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiRecommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-6 border-0 bg-gradient-to-r from-card to-muted/20 rounded-xl shadow-sm hover-lift animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h4 className="font-semibold text-lg">{rec.title}</h4>
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-primary to-chart-2 text-white border-0"
                              >
                                {rec.match}% match
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-green-200 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300"
                              >
                                {rec.sustainability}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3 leading-relaxed">{rec.reason}</p>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-1">
                                <span className="text-muted-foreground">Supplier:</span>
                                <span className="font-medium">{rec.supplier}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-bold text-green-600">${rec.price}/kg</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Leaf className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-medium">{rec.co2Impact}kg CO₂ saved</span>
                              </div>
                            </div>
                          </div>
                          <Button className="shadow-sm hover-lift" onClick={() => setDetailsOpen(true)}>View Details</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Market Analytics */}
              <TabsContent value="analytics" className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Price Trends</CardTitle>
                      </div>
                      <CardDescription>Current market prices and recent changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {marketTrends.map((trend, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/20 to-card rounded-lg animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <span className="font-semibold text-lg">{trend.material}</span>
                            <div className="flex items-center space-x-4">
                              <span className="text-xl font-bold">${trend.price}/kg</span>
                              <div
                                className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  trend.trend === "up"
                                    ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900"
                                    : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900"
                                }`}
                              >
                                {trend.trend === "up" ? (
                                  <TrendingUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
                                )}
                                <span>{Math.abs(trend.change)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-chart-3 to-chart-4 rounded-lg">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <CardTitle className="text-xl">Material Distribution</CardTitle>
                      </div>
                      <CardDescription>Available materials in your region</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Copper", amount: "45,000 kg", color: "from-orange-500 to-red-500" },
                          { name: "Aluminum", amount: "78,000 kg", color: "from-blue-500 to-cyan-500" },
                          { name: "Steel", amount: "120,000 kg", color: "from-gray-500 to-slate-600" },
                          { name: "Electronics", amount: "12,000 kg", color: "from-purple-500 to-indigo-500" },
                        ].map((material, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-4 bg-gradient-to-r from-muted/20 to-card rounded-lg animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`h-4 w-4 rounded-full bg-gradient-to-r ${material.color}`}></div>
                              <span className="font-semibold">{material.name}</span>
                            </div>
                            <span className="text-muted-foreground font-medium">{material.amount} available</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            /* Seller Dashboard */
            <Tabs defaultValue="listings" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-card/80 backdrop-blur-sm border-0 shadow-sm">
                <TabsTrigger
                  value="listings"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>My Listings</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="create"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>Create Listing</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Sales Analytics</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              {/* My Listings */}
              <TabsContent value="listings" className="space-y-6 animate-fade-in-up">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Active Listings</CardTitle>
                    </div>
                    <CardDescription>Manage your current material listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {listings.slice(0, 2).map((listing, index) => (
                        <div
                          key={listing.id}
                          className="flex items-center justify-between p-6 border-0 bg-gradient-to-r from-card to-muted/20 rounded-xl shadow-sm hover-lift animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={listing.image || "/placeholder.svg"}
                              alt={listing.title}
                              className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                              <h4 className="font-semibold text-lg mb-1">{listing.title}</h4>
                              <p className="text-muted-foreground mb-2">
                                {listing.quantity.toLocaleString()}kg • ${listing.price}/kg
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="border-green-200 text-green-700 bg-green-50 dark:bg-green-950 dark:text-green-300"
                                >
                                  {listing.sustainability}
                                </Badge>
                                <div className="flex items-center space-x-1 text-sm text-green-600">
                                  <Leaf className="h-3 w-3" />
                                  <span>{listing.co2Saved}kg CO₂ saved</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200">
                              Active
                            </Badge>
                            <Button variant="outline" size="sm" className="shadow-sm hover-lift bg-transparent">
                              Edit
                            </Button>
                            <Button size="sm" className="shadow-sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Create Listing */}
              <TabsContent value="create" className="space-y-6 animate-fade-in-up">
                <Card className="shadow-professional border-0 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-primary to-chart-2 rounded-lg">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-xl">Create New Listing</CardTitle>
                    </div>
                    <CardDescription>List your scrap materials or byproducts for sale</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="material-title" className="text-sm font-medium">
                          Material Title
                        </Label>
                        <Input
                          id="material-title"
                          placeholder="e.g., High-Grade Copper Wire"
                          className="mt-1 shadow-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="material-type" className="text-sm font-medium">
                          Material Type
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1 shadow-sm">
                            <SelectValue placeholder="Select material type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="copper">Copper</SelectItem>
                            <SelectItem value="aluminum">Aluminum</SelectItem>
                            <SelectItem value="steel">Steel</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="quantity" className="text-sm font-medium">
                          Quantity (kg)
                        </Label>
                        <Input id="quantity" type="number" placeholder="1000" className="mt-1 shadow-sm" />
                      </div>
                      <div>
                        <Label htmlFor="price" className="text-sm font-medium">
                          Price per kg ($)
                        </Label>
                        <Input id="price" type="number" step="0.01" placeholder="8.50" className="mt-1 shadow-sm" />
                      </div>
                      <div>
                        <Label htmlFor="purity" className="text-sm font-medium">
                          Purity (%)
                        </Label>
                        <Input id="purity" type="number" placeholder="99.9" className="mt-1 shadow-sm" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">
                        Location
                      </Label>
                      <Input id="location" placeholder="City, State" className="mt-1 shadow-sm" />
                    </div>
                    <div className="flex space-x-3">
                      <Button className="shadow-sm">
                        <Package className="h-4 w-4 mr-2" />
                        Create Listing
                      </Button>
                      <Button variant="outline" className="shadow-sm hover-lift bg-transparent">
                        Save as Draft
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sales Analytics */}
              <TabsContent value="analytics" className="space-y-6 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Total Revenue",
                      value: "$24,580",
                      change: "+12% this month",
                      icon: DollarSign,
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      title: "Materials Sold",
                      value: "15,240kg",
                      change: "+8% this month",
                      icon: Package,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      title: "Active Listings",
                      value: "12",
                      change: "2 pending approval",
                      icon: BarChart3,
                      color: "from-purple-500 to-indigo-500",
                    },
                    {
                      title: "Avg. Price",
                      value: "$6.80/kg",
                      change: "+5% vs market",
                      icon: TrendingUp,
                      color: "from-orange-500 to-red-500",
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
                        <div className="text-2xl font-bold mb-2">{stat.value}</div>
                        <div className="text-sm text-green-600 font-medium">{stat.change}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
          {/* Contact Seller Modal */}
          <Dialog open={contactOpen} onOpenChange={setContactOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contact Seller</DialogTitle>
                <DialogDescription>
                  Send a quick inquiry to the seller. This is a mock dialog – no messages are sent.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Listing:</span> <span className="font-medium">{selectedListing?.title || "N/A"}</span></div>
                <div><span className="text-muted-foreground">Seller:</span> <span className="font-medium">{selectedListing?.seller || "N/A"}</span></div>
                <Input placeholder="Your message..." className="mt-2" />
              </div>
              <DialogFooter>
                <Button onClick={() => setContactOpen(false)}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Listing Details Modal */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedListing?.title || "Listing Details"}</DialogTitle>
                <DialogDescription>Quick overview of the material and circularity benefits.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-medium">{selectedListing?.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{selectedListing?.quantity?.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">${selectedListing?.price}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CO₂ Saved</span>
                  <span className="font-medium">{selectedListing?.co2Saved} kg</span>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
