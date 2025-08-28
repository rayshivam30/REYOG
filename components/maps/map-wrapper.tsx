// components/maps/map-wrapper.tsx
"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef, useMemo, forwardRef } from 'react';
import { MapContainerProps, TileLayer, Marker as LeafletMarker, Popup as LeafletPopup, useMap, MapContainer as LeafletMapContainer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create a custom icon for the marker
const createMarkerIcon = () => {
  return L.divIcon({
    html: `
      <div style="position: relative; width: 30px; height: 30px;">
        <svg viewBox="0 0 24 24" width="30" height="30" style="position: absolute; top: 0; left: 0;">
          <path 
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            fill="#e74c3c"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Dynamically import the MapContainer component with SSR disabled
const MapContainer = dynamic<MapContainerProps>(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

interface MapWrapperProps extends Omit<MapContainerProps, 'center'> {
  center: [number, number];
  children?: React.ReactNode;
  onClick?: (e: L.LeafletMouseEvent) => void;
  className?: string;
  zoom?: number;
}

export const MapWrapper = forwardRef<L.Map, MapWrapperProps>(({ 
  center, 
  zoom = 13, 
  children, 
  onClick,
  className = '',
  ...props 
}, ref) => {
  const mapRef = useRef<L.Map>(null);
  
  // Forward the ref
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(mapRef.current);
      } else {
        ref.current = mapRef.current;
      }
    }
  }, [ref]);

  // Handle map click events
  useEffect(() => {
    if (!mapRef.current || !onClick) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (onClick) {
        onClick(e);
      }
    };
    
    const map = mapRef.current;
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [onClick]);

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      className={`h-full w-full ${className}`}
      style={{ height: '100%', width: '100%' }}
      {...props}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
    </MapContainer>
  );
});

MapWrapper.displayName = 'MapWrapper';

// Custom Marker component with the custom icon
export function Marker({ children, ...props }: any) {
  const icon = useMemo(() => createMarkerIcon(), []);
  return (
    <LeafletMarker icon={icon} {...props}>
      {children}
    </LeafletMarker>
  );
}

// Re-export other components
export const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Helper component to update the map view when center changes
export function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}