"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// ✅ Dynamically import LocationPicker to avoid "window is not defined"
const LocationPicker = dynamic(
  () => import("@/components/maps/location-picker").then((m) => m.LocationPicker),
  { ssr: false }
)

interface Department {
  id: string
  name: string
  _count: {
    offices: number
  }
}

interface OfficeSearchProps {
  onSearch: (filters: {
    query?: string
    department?: string
    location?: { lat: number; lng: number }
    radius?: number
  }) => void
  isLoading?: boolean
}

export function OfficeSearch({ onSearch, isLoading }: OfficeSearchProps) {
  const [query, setQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [departments, setDepartments] = useState<Department[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(10)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await fetch("/api/departments")
        if (!res.ok) throw new Error("Failed to fetch departments")
        const data = await res.json()
        setDepartments(data.departments || [])
      } catch (err) {
        console.error("Failed to fetch departments:", err)
        setDepartments([])
      }
    }
    fetchDepartments()
  }, [])

  const handleSearch = () => {
    onSearch({
      query: query.trim() || undefined,
      department: selectedDepartment === "all" ? undefined : selectedDepartment,
      location: location || undefined,
      radius,
    })
  }

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation)
    setIsLocationDialogOpen(false)
  }

  const clearLocation = () => {
    setLocation(null)
  }

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg border border-border space-y-4">
      {/* Search input + button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search offices by name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="min-h-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading} className="min-h-10 w-full sm:w-auto">
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        {/* Department filter */}
        <div className="flex-1">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="min-h-10">
              <SelectValue placeholder="All departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name} ({dept._count.offices})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Radius filter */}
        <div className="w-full md:w-48">
          <Select
            value={radius.toString()}
            onValueChange={(value) => setRadius(Number(value))}
          >
            <SelectTrigger className="min-h-10">
              <SelectValue placeholder="Search radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 km</SelectItem>
              <SelectItem value="10">10 km</SelectItem>
              <SelectItem value="25">25 km</SelectItem>
              <SelectItem value="50">50 km</SelectItem>
              <SelectItem value="100">100 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location filter */}
        <div className="flex flex-col sm:flex-row gap-2 md:flex-col lg:flex-row">
          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 min-h-10 w-full sm:w-auto">
                <MapPin className="h-4 w-4" />
                {location ? "Change Location" : "Set Location"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Select Location</DialogTitle>
              </DialogHeader>
              <div className="h-[400px] w-full">
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={location || undefined}
                  className="border-0 shadow-none"
                />
              </div>
            </DialogContent>
          </Dialog>

          {location && (
            <Button variant="outline" onClick={clearLocation} className="min-h-10 w-full sm:w-auto">
              Clear Location
            </Button>
          )}
        </div>
      </div>

      {/* Active search info */}
      {location && (
        <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 p-2 rounded">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="break-all">
            Searching near: {location.lat.toFixed(4)}, {location.lng.toFixed(4)} (within {radius} km)
          </span>
        </div>
      )}
    </div>
  )
}
