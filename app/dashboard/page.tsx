'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the IndiaMap component with no SSR
const IndiaMap = dynamic(() => import('@/components/dashboard/IndiaMap'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

// Sample data for minerals and their mines in India
const mineralData = {
  aluminium: {
    name: 'Aluminium',
    mines: [
      { id: 1, name: 'Nalco Mines', state: 'Odisha', lat: 20.8, lng: 85.8 },
      { id: 2, name: 'Balco Mines', state: 'Chhattisgarh', lat: 22.0, lng: 82.5 },
      { id: 3, name: 'Vedanta Lanjigarh', state: 'Odisha', lat: 19.7, lng: 83.4 },
      { id: 4, name: 'Hindalco Belgaum', state: 'Karnataka', lat: 15.8, lng: 74.5 },
      { id: 5, name: 'Korba Bauxite', state: 'Chhattisgarh', lat: 22.3, lng: 82.7 },
    ]
  },
  copper: {
    name: 'Copper',
    mines: [
      { id: 1, name: 'Khetri Copper Complex', state: 'Rajasthan', lat: 28.0, lng: 75.8 },
      { id: 2, name: 'Malanjkhand Copper Project', state: 'Madhya Pradesh', lat: 22.1, lng: 80.7 },
      { id: 3, name: 'Tuticorin Smelter', state: 'Tamil Nadu', lat: 8.8, lng: 78.1 },
      { id: 4, name: 'Ghatsila Copper Mines', state: 'Jharkhand', lat: 22.6, lng: 86.5 },
      { id: 5, name: 'Singhbhum Copper Belt', state: 'Jharkhand', lat: 22.8, lng: 86.2 },
    ]
  },
  lithium: {
    name: 'Lithium',
    mines: [
      { id: 1, name: 'Mandya Lithium Deposit', state: 'Karnataka', lat: 12.5, lng: 76.9 },
      { id: 2, name: 'Marlagalla Lithium Belt', state: 'Karnataka', lat: 13.2, lng: 76.5 },
    ]
  },
  steel: {
    name: 'Steel',
    mines: [
      { id: 1, name: 'Bailadila Iron Ore Mine', state: 'Chhattisgarh', lat: 18.7, lng: 81.2 },
      { id: 2, name: 'Noamundi Iron Mine', state: 'Jharkhand', lat: 22.2, lng: 85.5 },
      { id: 3, name: 'Dalli Rajhara Mine', state: 'Chhattisgarh', lat: 20.6, lng: 81.1 },
      { id: 4, name: 'Kudremukh Iron Ore', state: 'Karnataka', lat: 13.2, lng: 75.3 },
      { id: 5, name: 'Kiriburu Iron Ore Mine', state: 'Jharkhand', lat: 22.1, lng: 85.3 },
    ]
  },
  gold: {
    name: 'Gold',
    mines: [
      { id: 1, name: 'Kolar Gold Fields', state: 'Karnataka', lat: 13.1, lng: 78.3 },
      { id: 2, name: 'Hutti Gold Mines', state: 'Karnataka', lat: 16.2, lng: 76.7 },
      { id: 3, name: 'Ramagiri Gold Field', state: 'Andhra Pradesh', lat: 13.9, lng: 77.6 },
    ]
  },
  silver: {
    name: 'Silver',
    mines: [
      { id: 1, name: 'Zawar Mines', state: 'Rajasthan', lat: 24.3, lng: 73.7 },
      { id: 2, name: 'Tundoo Lead-Zinc Mine', state: 'Jharkhand', lat: 22.9, lng: 86.2 },
      { id: 3, name: 'Rampura Agucha Mine', state: 'Rajasthan', lat: 25.6, lng: 74.7 },
    ]
  }
};

export default function DashboardPage() {
  const [selectedMineral, setSelectedMineral] = useState<keyof typeof mineralData>('aluminium');
  const mines = mineralData[selectedMineral].mines;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">India Mineral Resources Map</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Your Material</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="mb-4">
              <label htmlFor="mineral-select" className="block text-sm font-medium text-gray-700 mb-2">
                Mineral Type
              </label>
              <select
                id="mineral-select"
                value={selectedMineral}
                onChange={(e) => setSelectedMineral(e.target.value as keyof typeof mineralData)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(mineralData).map(([key, mineral]) => (
                  <option key={key} value={key}>
                    {mineral.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Mines in India for {mineralData[selectedMineral].name}</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {mines.map((mine) => (
                  <div key={mine.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <h4 className="font-medium">{mine.name}</h4>
                    <p className="text-sm text-gray-600">{mine.state}</p>
                  </div>
                ))}
                {mines.length === 0 && (
                  <p className="text-gray-500">No mine data available</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 h-[500px] bg-gray-100 rounded-md overflow-hidden">
            <IndiaMap mines={mines} mineral={mineralData[selectedMineral].name} />
          </div>
        </div>
      </div>
    </div>
  );
}
