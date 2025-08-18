"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleMap } from "./google-map"
import { MapPin, Target } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
  initialLocation?: { lat: number; lng: number }
  className?: string
}

export function LocationPicker({ onLocationSelect, initialLocation, className }: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
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
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={getCurrentLocation} className="flex-shrink-0 bg-transparent">
            <Target className="h-4 w-4 mr-2" />
            Use Current Location
          </Button>
          {selectedLocation && (
            <div className="flex-1 p-2 bg-muted rounded-md text-sm">
              Location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </div>
          )}
        </div>

        <div className="relative h-64">
          <GoogleMap
            center={defaultCenter}
            zoom={13}
            markers={
              selectedLocation
                ? [
                    {
                      id: "selected",
                      position: selectedLocation,
                      title: "Selected Location",
                      info: "Your selected location",
                    },
                  ]
                : []
            }
            className="w-full h-full"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Click on the map to select a location, or use your current location
        </p>
      </CardContent>
    </Card>
  )
}
