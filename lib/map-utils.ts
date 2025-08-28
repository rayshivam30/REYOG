import L from 'leaflet';

export type Position = {
  lat: number;
  lng: number;
};

export type Bounds = {
  northEast: Position;
  southWest: Position;
};

export type MarkerData = {
  id: string | number;
  position: Position;
  title?: string;
  content?: React.ReactNode;
  icon?: L.Icon | L.DivIcon;
};

/**
 * Calculate distance between two points in kilometers
 */
export function calculateDistance(
  pos1: Position,
  pos2: Position
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Create a custom marker icon
 */
export function createCustomIcon(
  iconUrl: string,
  iconSize: [number, number] = [25, 41],
  iconAnchor: [number, number] = [12, 41],
  popupAnchor: [number, number] = [1, -34],
  shadowUrl = '/marker-shadow.png',
  shadowSize: [number, number] = [41, 41]
): L.Icon {
  return L.icon({
    iconUrl,
    iconSize,
    iconAnchor,
    popupAnchor,
    shadowUrl,
    shadowSize,
  });
}

/**
 * Get bounds that contain all given positions
 */
export function getBounds(positions: Position[]): L.LatLngBounds {
  const bounds = new L.LatLngBounds(
    [0, 0],
    [0, 0]
  );
  
  positions.forEach(pos => {
    bounds.extend([pos.lat, pos.lng]);
  });
  
  return bounds;
}

/**
 * Format distance in a human-readable way
 */
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
}

/**
 * Get the center point of multiple positions
 */
export function getCenter(positions: Position[]): Position {
  if (positions.length === 0) {
    return { lat: 0, lng: 0 };
  }
  
  const sum = positions.reduce(
    (acc, pos) => ({
      lat: acc.lat + pos.lat,
      lng: acc.lng + pos.lng,
    }),
    { lat: 0, lng: 0 }
  );
  
  return {
    lat: sum.lat / positions.length,
    lng: sum.lng / positions.length,
  };
}

/**
 * Get the current user's location
 */
export async function getCurrentPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Get a static map image URL
 */
export function getStaticMapUrl(
  center: Position,
  zoom: number,
  size: { width: number; height: number } = { width: 600, height: 300 },
  markers: Position[] = [],
  apiKey?: string
): string {
  const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
  const params = new URLSearchParams({
    center: `${center.lat},${center.lng}`,
    zoom: zoom.toString(),
    size: `${size.width}x${size.height}`,
    scale: '2', // For retina displays
    maptype: 'roadmap',
    key: apiKey || '',
  });

  // Add markers if provided
  markers.forEach((marker, index) => {
    params.append('markers', `${marker.lat},${marker.lng}`);
  });

  return `${baseUrl}?${params.toString()}`;
}
