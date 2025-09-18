'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

export interface Mine {
  id: number;
  name: string;
  state: string;
  lat: number;
  lng: number;
}

interface IndiaMapProps {
  mines: readonly Mine[];
  mineral: string;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ mines, mineral }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Define a color scheme for different minerals
  const getColorForMineral = (mineral: string) => {
    const colorMap: Record<string, string> = {
      'Aluminium': '#1f77b4',
      'Copper': '#ff7f0e',
      'Lithium': '#2ca02c',
      'Steel': '#d62728',
      'Gold': '#e6c229',
      'Silver': '#c7c7c7'
    };
    return colorMap[mineral] || '#1f77b4';
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return;

    // Initialize the map centered on India
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainer.current).setView([20.5937, 78.9629], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Add feature group for markers
      featureGroupRef.current = L.featureGroup().addTo(mapRef.current);
    }

    // Clear previous markers
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
      markersRef.current = [];
    }

    // Add new markers for each mine
    mines.forEach((mine) => {
      if (!mapRef.current || !featureGroupRef.current) return;

      // Create a circle marker
      const circle = L.circleMarker(
        [mine.lat, mine.lng],
        {
          radius: 8,
          fillColor: getColorForMineral(mineral),
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }
      );

      // Create a popup for the marker with a link to LCA analysis
      const popup = L.popup().setContent(`
        <div class="p-2">
          <h3 class="font-bold text-lg mb-2">${mine.name}</h3>
          <p class="mb-1"><span class="font-medium">Mineral:</span> ${mineral}</p>
          <p class="mb-3"><span class="font-medium">State:</span> ${mine.state}</p>
          <a 
            href="/lca?material=${mineral.toLowerCase()}" 
            class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            View LCA Analysis
          </a>
        </div>
      `);

      // Bind popup to the circle
      circle.bindPopup(popup);
      
      // Add to feature group
      circle.addTo(featureGroupRef.current);
      
      // Store the circle in our refs
      markersRef.current.push(circle as any); // Type assertion to bypass the type error
    });

    // Fit bounds to show all markers if there are any
    if (mines.length > 0 && featureGroupRef.current) {
      const bounds = featureGroupRef.current.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        // Don't remove the map instance here to avoid remounting on updates
        // Just clear the markers which are handled by the feature group
        if (featureGroupRef.current) {
          featureGroupRef.current.clearLayers();
        }
      }
    };
  }, [mines, mineral]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default IndiaMap;
