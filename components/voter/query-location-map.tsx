"use client"

import dynamic from "next/dynamic"

// Dynamically import map components to avoid SSR issues
const MapWrapper = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.MapWrapper), { ssr: false })
const Marker = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import("@/components/maps/map-wrapper").then(m => m.Popup), { ssr: false })

interface QueryLocationMapProps {
  latitude: number
  longitude: number
  title: string
  panchayatName?: string
}

export function QueryLocationMap({ latitude, longitude, title, panchayatName }: QueryLocationMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="h-48 w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">No location coordinates available</p>
      </div>
    )
  }

  return (
    <div className="h-48 w-full rounded-md overflow-hidden border border-gray-200">
      <MapWrapper 
        center={[latitude, longitude]} 
        zoom={15}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
      >
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-semibold">{title}</p>
              {panchayatName && <p className="text-xs text-gray-500">{panchayatName}</p>}
            </div>
          </Popup>
        </Marker>
      </MapWrapper>
    </div>
  )
}