"use client";

import dynamic from "next/dynamic";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Dynamically import each component (named exports)
const MapWrapper = dynamic(
  () => import("@/components/maps/map-wrapper").then((m) => m.MapWrapper),
  { ssr: false }
);

const Marker = dynamic(
  () => import("@/components/maps/map-wrapper").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("@/components/maps/map-wrapper").then((m) => m.Popup),
  { ssr: false }
);

interface QueryLocationMapProps {
  latitude: number;
  longitude: number;
  title: string;
  panchayatName?: string;
}

export function QueryLocationMap({
  latitude,
  longitude,
  title,
  panchayatName,
}: QueryLocationMapProps) {
  if (!latitude || !longitude) {
    return (
      <div className="h-48 w-full rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">
          No location coordinates available
        </p>
      </div>
    );
  }

  const handleOpenGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
  };

  return (
    <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-200">
      <MapWrapper
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
        // Removed onClick
      >
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center p-1">
              <p className="font-semibold">{title}</p>
              {panchayatName && (
                <p className="text-xs text-gray-500">{panchayatName}</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapWrapper>
      <Button
        variant="secondary"
        size="sm"
        className="absolute bottom-2 right-2 z-[1000] flex items-center gap-1"
        onClick={handleOpenGoogleMaps}
      >
        <ExternalLink className="h-4 w-4" />
        Google Maps
      </Button>
    </div>
  );
}
