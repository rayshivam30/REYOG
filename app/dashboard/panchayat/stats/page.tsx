"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Building, Users, Stethoscope, GraduationCap } from "lucide-react"

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStat, setEditingStat] = useState<ServiceStat | null>(null)
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
      const response = await fetch("/api/service-stats")
      if (response.ok) {
        const data = await response.json()
        setServiceStats(data.serviceStats || {})
      }
    } catch (error) {
      console.error("Failed to fetch service stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/service-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formData.category,
          metric: formData.metric,
          value: Number.parseInt(formData.value),
          unit: formData.unit || undefined,
        }),
      })

      if (response.ok) {
        await fetchServiceStats()
        setIsDialogOpen(false)
        setEditingStat(null)
        setFormData({ category: "", metric: "", value: "", unit: "" })
      }
    } catch (error) {
      console.error("Failed to save service stat:", error)
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "hospitals":
        return <Stethoscope className="h-5 w-5 text-red-500" />
      case "schools":
        return <GraduationCap className="h-5 w-5 text-blue-500" />
      case "offices":
        return <Building className="h-5 w-5 text-gray-500" />
      default:
        return <Users className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Service Statistics</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage and update service metrics for your panchayat</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full sm:w-auto"
                onClick={() => {
                  setEditingStat(null)
                  setFormData({ category: "", metric: "", value: "", unit: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Statistic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingStat ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Hospitals, Schools, Water Supply"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric</Label>
                  <Input
                    id="metric"
                    placeholder="e.g., doctors, nurses, beds, teachers"
                    value={formData.metric}
                    onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="e.g., 5, 25, 150"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit (Optional)</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., count, percentage, liters"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="w-full sm:w-auto">{editingStat ? "Update" : "Add"} Statistic</Button>
                  <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(serviceStats).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(serviceStats).map(([category, stats]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-4">
                {getCategoryIcon(category)}
                <h2 className="text-xl font-semibold">{category}</h2>
                <Badge variant="outline">{stats.length} metrics</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((stat) => (
                  <Card key={stat.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xs sm:text-sm font-medium capitalize">{stat.metric}</CardTitle>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(stat)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl sm:text-2xl font-bold">
                        {stat.value.toLocaleString()}
                        {stat.unit && <span className="text-xs sm:text-sm font-normal text-muted-foreground"> {stat.unit}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated {new Date(stat.lastUpdated).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Service Statistics</h3>
            <p className="text-muted-foreground mb-4">Start by adding statistics for your panchayat services</p>
            <Button
              onClick={() => {
                setEditingStat(null)
                setFormData({ category: "", metric: "", value: "", unit: "" })
                setIsDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Statistic
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
