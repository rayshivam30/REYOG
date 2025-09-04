"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Target } from "lucide-react"
import { MapWrapper, Marker, Popup } from "./map-wrapper"

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
}

export function LocationPicker({ onLocationSelect, initialLocation, className }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapReady, setMapReady] = useState(false)

  // Set initial location when component mounts
  useEffect(() => {
    setMapReady(true)
    if (initialLocation) {
      setSelectedLocation(initialLocation)
    }
  }, [initialLocation])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(location)
          setSelectedLocation(location)
          onLocationSelect(location)
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

  const handleMapClick = (e: any) => {
    const location = {
      lat: e.latlng.lat,
      lng: e.latlng.lng
    }
    setSelectedLocation(location)
    onLocationSelect(location)
  }

  const defaultCenter = selectedLocation || currentLocation || { lat: 23.2599, lng: 77.4126 } // Bhopal, MP

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Select Location
        </CardTitle>
        <CardDescription>Choose your location to help us route your query to the nearest office</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={getCurrentLocation} 
            className="flex-shrink-0 bg-transparent w-full sm:w-auto min-h-10"
          >
            <Target className="h-4 w-4 mr-2" />
            Use Current Location
          </Button>
          {selectedLocation && (
            <div className="flex-1 p-3 bg-muted rounded-md text-sm">
              <strong>Location:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="relative h-64 sm:h-80 touch-manipulation">
          {mapReady && (
            <MapWrapper 
              center={[defaultCenter.lat, defaultCenter.lng]} 
              zoom={13}
              className="h-full w-full rounded-lg"
              onClick={handleMapClick}
              scrollWheelZoom={false}
              touchZoom={true}
              doubleClickZoom={true}
              zoomControl={true}
            >
              {selectedLocation && (
                <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold">Selected Location</h3>
                      <p className="text-xs">{selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapWrapper>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Tap on the map to select a location, or use your current location button above
        </p>
      </CardContent>
    </Card>
  )
}
