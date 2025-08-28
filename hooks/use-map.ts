import { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import { Position, MarkerData } from '@/lib/map-utils';

type UseMapOptions = {
  initialCenter?: Position;
  initialZoom?: number;
  onClick?: (position: Position) => void;
  onMarkerClick?: (marker: MarkerData) => void;
  onBoundsChange?: (bounds: L.LatLngBounds) => void;
};

export function useMap({
  initialCenter,
  initialZoom = 13,
  onClick,
  onMarkerClick,
  onBoundsChange,
}: UseMapOptions = {}) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [center, setCenter] = useState<Position>(
    initialCenter || { lat: 23.2599, lng: 77.4126 }
  );
  const [zoom, setZoom] = useState(initialZoom);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map
  const initMap = useCallback((mapInstance: L.Map) => {
    setMap(mapInstance);
    
    // Set up event listeners
    mapInstance.on('moveend', () => {
      const center = mapInstance.getCenter();
      setCenter({ lat: center.lat, lng: center.lng });
      setZoom(mapInstance.getZoom());
      
      const newBounds = mapInstance.getBounds();
      setBounds(newBounds);
      onBoundsChange?.(newBounds);
    });
    
    // Initial bounds
    setBounds(mapInstance.getBounds());
    onBoundsChange?.(mapInstance.getBounds());
  }, [onBoundsChange]);

  // Handle map click
  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    const position = { lat: e.latlng.lat, lng: e.latlng.lng };
    onClick?.(position);
  }, [onClick]);

  // Handle marker click
  const handleMarkerClick = useCallback((marker: MarkerData) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  // Add a marker
  const addMarker = useCallback((marker: Omit<MarkerData, 'id'> & { id?: string | number }) => {
    const newMarker = {
      ...marker,
      id: marker.id || Date.now().toString(),
    };
    
    setMarkers(prev => [...prev, newMarker]);
    return newMarker.id;
  }, []);

  // Update a marker
  const updateMarker = useCallback((id: string | number, updates: Partial<MarkerData>) => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === id ? { ...marker, ...updates } : marker
      )
    );
  }, []);

  // Remove a marker
  const removeMarker = useCallback((id: string | number) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
    if (selectedMarker?.id === id) {
      setSelectedMarker(null);
    }
  }, [selectedMarker]);

  // Clear all markers
  const clearMarkers = useCallback(() => {
    setMarkers([]);
    setSelectedMarker(null);
  }, []);

  // Pan to a position
  const panTo = useCallback((position: Position, zoomLevel?: number) => {
    if (!map) return;
    
    map.flyTo([position.lat, position.lng], zoomLevel);
    setCenter(position);
    if (zoomLevel !== undefined) {
      setZoom(zoomLevel);
    }
  }, [map]);

  // Fit bounds to include all markers
  const fitBounds = useCallback((padding: [number, number] = [50, 50]) => {
    if (!map || markers.length === 0) return;
    
    const bounds = L.latLngBounds(
      markers.map(marker => [marker.position.lat, marker.position.lng])
    );
    
    map.fitBounds(bounds, {
      padding: padding as [number, number],
      maxZoom: 15,
    });
  }, [map, markers]);

  // Get current location
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser');
    }
    
    setIsLoading(true);
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });
      
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      panTo(location, 15);
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [panTo]);

  // Clean up event listeners
  useEffect(() => {
    if (!map) return;
    
    if (onClick) {
      map.on('click', handleMapClick);
    }
    
    return () => {
      if (onClick) {
        map.off('click', handleMapClick);
      }
      map.off('moveend');
    };
  }, [map, handleMapClick, onClick]);

  return {
    // State
    map,
    center,
    zoom,
    bounds,
    markers,
    selectedMarker,
    isLoading,
    
    // Actions
    initMap,
    addMarker,
    updateMarker,
    removeMarker,
    clearMarkers,
    panTo,
    fitBounds,
    getCurrentLocation,
    setSelectedMarker,
  };
}

export default useMap;
