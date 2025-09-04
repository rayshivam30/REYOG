"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OfficeSearch } from "@/components/offices/office-search"
import { OfficeList } from "@/components/offices/office-list"
import { Card } from "@/components/ui/card"

// Import MapWrapper dynamically (client-side only)
const MapWrapper = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.MapWrapper), { ssr: false })
const Marker = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.Popup), { ssr: false })

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
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.2599, 77.4126]) // Default Bhopal
  const [zoom, setZoom] = useState(10)

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
        setUserLocation([filters.location.lat, filters.location.lng])
        setMapCenter([filters.location.lat, filters.location.lng])
        setZoom(13)
      }
      if (filters.radius) params.append("radius", filters.radius.toString())
  
      const response = await fetch(`/api/offices?${params}`)
      
      // Check if response is OK before parsing JSON
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }
      
      // Check content type to ensure it's JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }
      
      const data = await response.json()
      setOffices(data.offices || [])
      if (data.offices?.length > 0) {
        setSelectedOffice(data.offices[0])
      }
    } catch (error) {
      console.error("Error fetching offices:", error)
      setOffices([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOfficeSelect = (office: Office) => {
    setSelectedOffice(office)
    setMapCenter([office.latitude, office.longitude])
    setZoom(15)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Find Government Offices</h1>
          
          <div className="mb-6 sm:mb-8">
            <OfficeSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Mobile: Stack layout, Desktop: Grid layout */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Map - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
                <MapWrapper 
                  center={mapCenter} 
                  zoom={zoom}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                  touchZoom={true}
                >
                  {/* User location marker */}
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold">Your Location</h3>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Office markers */}
                  {offices.map((office) => (
                    <Marker 
                      key={office.id} 
                      position={[office.latitude, office.longitude]}
                      eventHandlers={{
                        click: () => handleOfficeSelect(office)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold text-sm">{office.name}</h3>
                          <p className="text-xs">{office.department.name}</p>
                          {office.distance && (
                            <p className="text-xs text-muted-foreground">
                              {office.distance.toFixed(1)} km away
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapWrapper>
              </Card>
            </div>

            {/* Office List - Full width on mobile, 1/3 on desktop */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                <OfficeList 
                  offices={offices} 
                  selectedOfficeId={selectedOffice?.id}
                  onSelectOffice={handleOfficeSelect}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
