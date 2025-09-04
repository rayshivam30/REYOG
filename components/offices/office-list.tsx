"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, Star, Navigation } from "lucide-react"

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

interface OfficeListProps {
  offices: Office[]
  isLoading?: boolean
  onOfficeSelect?: (office: Office) => void
}

export function OfficeList({ offices, isLoading, onOfficeSelect }: OfficeListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (offices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No offices found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria or expanding the search radius.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {offices.map((office) => (
        <Card
          key={office.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onOfficeSelect?.(office)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{office.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{office.department.name}</Badge>
                  <Badge variant="outline">{office.panchayat.name}</Badge>
                </div>
              </div>
              {office.avgRating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{office.avgRating}</span>
                  <span className="text-muted-foreground">({office.ratingCount})</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm">{office.address}</span>
                {office.distance && (
                  <Badge variant="outline" className="ml-auto">
                    {office.distance} km away
                  </Badge>
                )}
              </div>

              {office.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${office.contactPhone}`} className="text-sm text-accent hover:underline">
                    {office.contactPhone}
                  </a>
                </div>
              )}

              {office.workingHours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{office.workingHours}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`,
                      "_blank",
                    )
                  }}
                  className="min-h-9 w-full sm:w-auto"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                {office.contactPhone && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(`tel:${office.contactPhone}`)
                    }}
                    className="min-h-9 w-full sm:w-auto"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Now
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
