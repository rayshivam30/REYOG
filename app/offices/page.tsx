"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OfficeSearch } from "@/components/offices/office-search"
import { OfficeList } from "@/components/offices/office-list"
import { GoogleMap } from "@/components/maps/google-map"

interface Office {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  contactPhone?: string
  contactEmail?: string
  workingHours?: string
  department: {
    id: string
    name: string
  }
  panchayat: {
    id: string
    name: string
  }
  avgRating: number
  ratingCount: number
  distance?: number
}

export default function OfficesPage() {
  const [offices, setOffices] = useState<Office[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Load all offices initially
    handleSearch({})
  }, [])

  const handleSearch = async (filters: {
    query?: string
    department?: string
    location?: { lat: number; lng: number }
    radius?: number
  }) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.query) params.append("q", filters.query)
      if (filters.department) params.append("dept", filters.department)
      if (filters.location) {
        params.append("lat", filters.location.lat.toString())
        params.append("lng", filters.location.lng.toString())
        setUserLocation(filters.location)
      }
      if (filters.radius) params.append("radius", filters.radius.toString())

      const response = await fetch(`/api/offices?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOffices(data.offices || [])
      } else {
        console.error("Failed to fetch offices:", data.error)
        setOffices([])
      }
    } catch (error) {
      console.error("Error fetching offices:", error)
      setOffices([])
    } finally {
      setIsLoading(false)
    }
  }

  // Create map markers
  const mapMarkers = offices.map((office) => ({
    id: office.id,
    position: { lat: office.latitude, lng: office.longitude },
    title: office.name,
    info: `${office.department.name} • ${office.avgRating > 0 ? `${office.avgRating}★` : "No ratings"}`,
  }))

  // Add user location marker if available
  if (userLocation) {
    mapMarkers.push({
      id: "user",
      position: userLocation,
      title: "Your Location",
      info: "You are here",
    })
  }

  // Default center (Bhopal, MP)
  const mapCenter =
    userLocation || selectedOffice
      ? { lat: userLocation?.lat || selectedOffice!.latitude, lng: userLocation?.lng || selectedOffice!.longitude }
      : { lat: 23.2599, lng: 77.4126 }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Government Offices</h1>
          <p className="text-muted-foreground">Find and connect with government offices in your area</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search and List */}
          <div className="lg:col-span-2 space-y-6">
            <OfficeSearch onSearch={handleSearch} isLoading={isLoading} />
            <OfficeList offices={offices} isLoading={isLoading} onOfficeSelect={setSelectedOffice} />
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Office Locations</h3>
                  <p className="text-sm text-muted-foreground">
                    {offices.length} offices {userLocation ? "near you" : "in the area"}
                  </p>
                </div>
                <div className="relative h-96">
                  <GoogleMap
                    center={mapCenter}
                    zoom={userLocation ? 12 : 10}
                    markers={mapMarkers}
                    onMarkerClick={(markerId) => {
                      const office = offices.find((o) => o.id === markerId)
                      if (office) setSelectedOffice(office)
                    }}
                    className="w-full h-full"
                  />
                </div>
                {selectedOffice && (
                  <div className="p-4 border-t bg-muted/50">
                    <h4 className="font-medium text-sm">{selectedOffice.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{selectedOffice.address}</p>
                    <p className="text-xs text-muted-foreground">{selectedOffice.department.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
