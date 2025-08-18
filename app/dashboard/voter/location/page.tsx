"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GoogleMap } from "@/components/maps/google-map"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Phone, Navigation, AlertTriangle, Clock, Star } from "lucide-react"

interface Office {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  contactPhone?: string
  workingHours?: string
  department: {
    name: string
  }
  avgRating: number
  ratingCount: number
  distance?: number
}

function SOSModal() {
  const emergencyNumbers = [
    { name: "Police", number: "100", color: "bg-blue-100 text-blue-800" },
    { name: "Fire Brigade", number: "101", color: "bg-red-100 text-red-800" },
    { name: "Ambulance", number: "108", color: "bg-green-100 text-green-800" },
    { name: "Disaster Management", number: "1078", color: "bg-orange-100 text-orange-800" },
  ]

  const handleSOSLog = (service: string) => {
    // Log SOS action to audit trail
    fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "SOS_ACCESSED",
        details: `User accessed ${service} emergency contact`,
      }),
    }).catch(console.error)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full">
          <AlertTriangle className="h-5 w-5 mr-2" />
          SOS Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Emergency Contacts
          </DialogTitle>
          <DialogDescription>
            Tap any number to call immediately. Your location will be logged for safety.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {emergencyNumbers.map((emergency) => (
            <div key={emergency.number} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{emergency.name}</div>
                <div className="text-sm text-muted-foreground">Emergency Service</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={emergency.color}>{emergency.number}</Badge>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSOSLog(emergency.name)
                    window.open(`tel:${emergency.number}`)
                  }}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center mt-4">Emergency calls are free from all networks</div>
      </DialogContent>
    </Dialog>
  )
}

export default function LocationTrackerPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyOffices, setNearbyOffices] = useState<Office[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null)

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)
          fetchNearbyOffices(newLocation)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoading(false)
          // Default to Bhopal if location fails
          const defaultLocation = { lat: 23.2599, lng: 77.4126 }
          setLocation(defaultLocation)
          fetchNearbyOffices(defaultLocation)
        },
      )
    }
  }

  const fetchNearbyOffices = async (userLocation: { lat: number; lng: number }) => {
    try {
      const response = await fetch(`/api/offices?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=10`)
      const data = await response.json()

      if (response.ok) {
        setNearbyOffices(data.offices || [])
      }
    } catch (error) {
      console.error("Error fetching nearby offices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const mapMarkers = nearbyOffices.map((office) => ({
    id: office.id,
    position: { lat: office.latitude, lng: office.longitude },
    title: office.name,
    info: `${office.department.name} • ${office.distance}km away`,
  }))

  // Add user location marker
  if (location) {
    mapMarkers.push({
      id: "user",
      position: location,
      title: "Your Location",
      info: "You are here",
    })
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Location Tracker</h2>
          <p className="text-muted-foreground">Find nearby government offices and emergency services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Government Offices
              </CardTitle>
              <CardDescription>
                {location ? `Showing offices within 10km of your location` : "Getting your location..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96">
                {location ? (
                  <GoogleMap
                    center={location}
                    zoom={12}
                    markers={mapMarkers}
                    onMarkerClick={(markerId) => {
                      const office = nearbyOffices.find((o) => o.id === markerId)
                      if (office) setSelectedOffice(office)
                    }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Getting your location...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Office Details */}
        <div className="space-y-4">
          {selectedOffice ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedOffice.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedOffice.department.name}</Badge>
                  {selectedOffice.avgRating > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{selectedOffice.avgRating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{selectedOffice.address}</span>
                  </div>

                  {selectedOffice.distance && (
                    <div className="text-sm text-muted-foreground">{selectedOffice.distance} km from your location</div>
                  )}

                  {selectedOffice.workingHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOffice.workingHours}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedOffice.latitude},${selectedOffice.longitude}`,
                        "_blank",
                      )
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>

                  {selectedOffice.contactPhone && (
                    <Button variant="outline" onClick={() => window.open(`tel:${selectedOffice.contactPhone}`)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Office
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Select an Office</h3>
                <p className="text-sm text-muted-foreground">Click on a marker on the map to view office details</p>
              </CardContent>
            </Card>
          )}

          {/* Nearby Offices List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nearby Offices</CardTitle>
              <CardDescription>{nearbyOffices.length} offices found within 10km</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              ) : nearbyOffices.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {nearbyOffices.slice(0, 5).map((office) => (
                    <div
                      key={office.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedOffice(office)}
                    >
                      <div className="font-medium text-sm">{office.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {office.department.name} • {office.distance}km away
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No offices found nearby</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
