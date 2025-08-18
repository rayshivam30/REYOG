"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"

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

  useEffect(() => {
    // Fetch departments
    fetch("/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartments(data.departments || []))
      .catch((err) => console.error("Failed to fetch departments:", err))
  }, [])

  const handleSearch = () => {
    onSearch({
      query: query.trim() || undefined,
      department: selectedDepartment === "all" ? undefined : selectedDepartment,
      location: location || undefined,
      radius,
    })
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)
          onSearch({
            query: query.trim() || undefined,
            department: selectedDepartment === "all" ? undefined : selectedDepartment,
            location: newLocation,
            radius,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please check your browser settings.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search offices by name or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name} ({dept._count.offices} offices)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={radius.toString()} onValueChange={(value) => setRadius(Number.parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Search radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">Within 5 km</SelectItem>
              <SelectItem value="10">Within 10 km</SelectItem>
              <SelectItem value="25">Within 25 km</SelectItem>
              <SelectItem value="50">Within 50 km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={getCurrentLocation}>
          <MapPin className="h-4 w-4 mr-2" />
          Use My Location
        </Button>
      </div>

      {location && (
        <div className="text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 inline mr-1" />
          Searching near your location ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
        </div>
      )}
    </div>
  )
}
