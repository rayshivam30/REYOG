"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, Edit, Building, Users, Stethoscope, GraduationCap,
  Droplet, Route, Trash2, RefreshCw, AlertCircle, CheckCircle2,
  BarChart3, PieChart, LineChart, Download, Share2, Loader2
} from "lucide-react"
import { Loading } from "@/components/ui/loading"
import { CardSkeleton } from "@/components/ui/content-skeleton"

interface ServiceStat {
  id: string
  category: string
  metric: string
  value: number
  unit?: string
  lastUpdated: string
}

interface GroupedStats {
  [category: string]: ServiceStat[]
}

export default function ServiceStatsPage() {
  const [serviceStats, setServiceStats] = useState<GroupedStats>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<ServiceStat | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [statToDelete, setStatToDelete] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    metric: "",
    value: "",
    unit: "",
  })

  useEffect(() => {
    fetchServiceStats()
  }, [])

  const fetchServiceStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/service-stats")
      if (response.ok) {
        const data = await response.json()
        setServiceStats(data.serviceStats || {})
      } else {
        setErrorMessage("Failed to load service statistics")
      }
    } catch (error) {
      console.error("Failed to fetch service stats:", error)
      setErrorMessage("Network error while loading statistics")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const endpoint = editingStat ? `/api/service-stats/${editingStat.id}` : "/api/service-stats"
      const method = editingStat ? "PUT" : "POST"
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formData.category,
          metric: formData.metric,
          value: Number(formData.value),
          unit: formData.unit || undefined,
        }),
      })

      if (response.ok) {
        await fetchServiceStats()
        setIsDialogOpen(false)
        setEditingStat(null)
        setFormData({ category: "", metric: "", value: "", unit: "" })
        setSuccessMessage(editingStat ? "Statistic updated successfully" : "New statistic added successfully")
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || "Failed to save statistic")
      }
    } catch (error) {
      console.error("Failed to save service stat:", error)
      setErrorMessage("Network error while saving statistic")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (stat: ServiceStat) => {
    setEditingStat(stat)
    setFormData({
      category: stat.category,
      metric: stat.metric,
      value: stat.value.toString(),
      unit: stat.unit || "",
    })
    setIsDialogOpen(true)
  }
  
  const handleDelete = async (id: string) => {
    setStatToDelete(id)
    setDeleteConfirmOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!statToDelete) return
    
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/service-stats/${statToDelete}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        await fetchServiceStats()
        setSuccessMessage("Statistic deleted successfully")
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message || "Failed to delete statistic")
      }
    } catch (error) {
      console.error("Failed to delete service stat:", error)
      setErrorMessage("Network error while deleting statistic")
    } finally {
      setDeleteConfirmOpen(false)
      setStatToDelete(null)
      setIsSubmitting(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "hospitals":
      case "healthcare":
      case "health":
        return <Stethoscope className="h-5 w-5 text-red-500" />
      case "schools":
      case "education":
        return <GraduationCap className="h-5 w-5 text-blue-500" />
      case "water":
      case "sanitation":
        return <Droplet className="h-5 w-5 text-cyan-500" />
      case "infrastructure":
      case "roads":
        return <Route className="h-5 w-5 text-amber-500" />
      case "population":
      case "demographics":
        return <Users className="h-5 w-5 text-green-500" />
      default:
        return <Building className="h-5 w-5 text-gray-500" />
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hospitals":
      case "healthcare":
      case "health":
        return "bg-red-100 text-red-800 border-red-200"
      case "schools":
      case "education":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "water":
      case "sanitation":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "infrastructure":
      case "roads":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "population":
      case "demographics":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  
  const categories = Object.keys(serviceStats)
  
  return (
    <div className="ml-4">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Panchayat Statistics</h1>
            <p className="text-muted-foreground">
              Manage and view service statistics for your panchayat
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchServiceStats}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Statistic
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingStat ? "Edit Statistic" : "Add New Statistic"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStat 
                      ? "Update the details of this service statistic" 
                      : "Enter the details for the new service statistic"}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Healthcare, Education"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metric">Metric Name</Label>
                    <Input
                      id="metric"
                      value={formData.metric}
                      onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                      placeholder="e.g. Number of Hospitals"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="value">Value</Label>
                      <Input
                        id="value"
                        type="number"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="e.g. 10"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit (Optional)</Label>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g. km, %"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        setEditingStat(null)
                        setFormData({ category: "", metric: "", value: "", unit: "" })
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingStat ? "Updating..." : "Saving..."}
                        </>
                      ) : (
                        <>{editingStat ? "Update" : "Save"}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Success and Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-start gap-2 animate-in fade-in-50 slide-in-from-top-5">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">{successMessage}</p>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 flex items-start gap-2 animate-in fade-in-50 slide-in-from-top-5">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <p className="font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
        
        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="flex items-center justify-between py-1">
              <TabsList className="bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="all" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  All Categories
                </TabsTrigger>
                
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* All Categories Tab */}
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : Object.keys(serviceStats).length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <Building className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium">No statistics available</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Start adding statistics to track services in your panchayat
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)} 
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Statistic
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(serviceStats).map(([category, stats]) => (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <h2 className="text-xl font-semibold">{category}</h2>
                      <Badge className={`${getCategoryColor(category)} border ml-2`}>
                        {stats.length} {stats.length === 1 ? "metric" : "metrics"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stats.map((stat) => (
                        <Card key={stat.id} className="overflow-hidden border-border/60 transition-all hover:shadow-md">
                          <CardHeader className="bg-muted/30 pb-3">
                            <CardTitle className="text-lg font-medium">{stat.metric}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex items-baseline">
                              <span className="text-3xl font-bold">{stat.value.toLocaleString()}</span>
                              {stat.unit && <span className="text-lg ml-1 text-muted-foreground">{stat.unit}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Last updated: {formatDate(stat.lastUpdated)}
                            </p>
                          </CardContent>
                          <CardFooter className="border-t bg-muted/30 py-2 px-4 flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(stat)}
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(stat.id)}
                              className="h-8 px-2 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Individual Category Tabs */}
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      <h2 className="text-xl font-semibold">{category}</h2>
                      <Badge className={`${getCategoryColor(category)} border ml-2`}>
                        {serviceStats[category].length} {serviceStats[category].length === 1 ? "metric" : "metrics"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => {
                          setFormData({ ...formData, category })
                          setIsDialogOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add to {category}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceStats[category].map((stat) => (
                      <Card key={stat.id} className="overflow-hidden border-border/60 transition-all hover:shadow-md">
                        <CardHeader className="bg-muted/30 pb-3">
                          <CardTitle className="text-lg font-medium">{stat.metric}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold">{stat.value.toLocaleString()}</span>
                            {stat.unit && <span className="text-lg ml-1 text-muted-foreground">{stat.unit}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last updated: {formatDate(stat.lastUpdated)}
                          </p>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30 py-2 px-4 flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(stat)}
                            className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(stat.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this statistic? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Deleting this statistic will permanently remove it from your panchayat records.
            </p>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
