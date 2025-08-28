"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useEffect, useState } from "react"
import "leaflet/dist/leaflet.css"

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
})

type Position = {
  lat: number
  lng: number
}

type MarkerData = {
  id: string | number
  position: Position
  title?: string
  content?: React.ReactNode
  icon?: L.Icon | L.DivIcon
}

interface BaseMapProps {
  center?: Position
  zoom?: number
  markers?: MarkerData[]
  className?: string
  style?: React.CSSProperties
  onClick?: (position: Position) => void
  onMarkerClick?: (marker: MarkerData) => void
  scrollWheelZoom?: boolean
  zoomControl?: boolean
  dragging?: boolean
  doubleClickZoom?: boolean
  children?: React.ReactNode
}

const DEFAULT_CENTER: Position = {
  lat: 23.2599, // Default to Bhopal coordinates
  lng: 77.4126,
}

const DEFAULT_ZOOM = 13

export function BaseMap({
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  markers = [],
  className = "h-[400px] w-full",
  style,
  onClick,
  onMarkerClick,
  scrollWheelZoom = true,
  zoomControl = true,
  dragging = true,
  doubleClickZoom = true,
  children,
}: BaseMapProps) {
  const [mapCenter, setMapCenter] = useState<Position>(center)
  const [mapZoom, setMapZoom] = useState(zoom)

  // Update map center when prop changes
  useEffect(() => {
    setMapCenter(center)
  }, [center.lat, center.lng])

  // Update zoom when prop changes
  useEffect(() => {
    setMapZoom(zoom)
  }, [zoom])

  // Handle map click events if onClick handler is provided
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (onClick) {
          const { lat, lng } = e.latlng
          onClick({ lat, lng })
        }
      },
    })
    return null
  }

  // Update view when center or zoom changes
  const ChangeView = () => {
    const map = useMap()
    useEffect(() => {
      map.setView([mapCenter.lat, mapCenter.lng], mapZoom)
    }, [mapCenter, mapZoom, map])
    return null
  }

  return (
    <div className={className} style={style}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        scrollWheelZoom={scrollWheelZoom}
        zoomControl={zoomControl}
        dragging={dragging}
        doubleClickZoom={doubleClickZoom}
        className="h-full w-full"
      >
        <ChangeView />
        {onClick && <MapClickHandler />}
        
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={marker.icon}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            {marker.content && <Popup>{marker.content}</Popup>}
          </Marker>
        ))}

        {/* Render any additional map children */}
        {children}
      </MapContainer>
    </div>
  )
}

export default BaseMap
