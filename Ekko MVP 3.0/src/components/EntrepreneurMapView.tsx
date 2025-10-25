import React, { useState } from 'react';
import { MapPin, User, Navigation, Plus } from 'lucide-react';
import { useApp } from './AppContext';
import { Button } from './ui/button';
import MapComponent from './MapComponent';

interface EntrepreneurMapViewProps {
  onNavigateToProfile: () => void;
  onNavigateToProductForm: () => void;
}

export function EntrepreneurMapView({ onNavigateToProfile, onNavigateToProductForm }: EntrepreneurMapViewProps) {
  const { orders, currentUser } = useApp();
  const [centerMap, setCenterMap] = useState(false);

  // Mock active clients with real coordinates (simulated)
  const activeClients = [
    { 
      id: 'c1', 
      lat: 40.7589, 
      lng: -73.9851, 
      name: 'Cliente 1',
      type: 'client',
      distance: '0.5 km'
    },
    { 
      id: 'c2', 
      lat: 40.7505, 
      lng: -73.9934, 
      name: 'Cliente 2',
      type: 'client',
      distance: '1.2 km'
    },
    { 
      id: 'c3', 
      lat: 40.7614, 
      lng: -73.9776, 
      name: 'Cliente 3',
      type: 'client',
      distance: '0.8 km'
    },
  ];

  // Handle marker click events
  const handleMarkerClick = (marker) => {
    console.log('Client clicked:', marker);
  };

  return (
    <div className="relative w-full h-screen bg-[#F5F5F5]">
      {/* Map Container - Now using live Google Map */}
      <div className="absolute inset-0">
        <MapComponent
          markers={activeClients}
          center={{ lat: 40.7589, lng: -73.9851 }} // Default center (Times Square area)
          zoom={13}
          onMarkerClick={handleMarkerClick}
          showUserLocation={true}
          mapType="entrepreneur"
        />
      </div>

      {/* Stats Card */}
      <div className="absolute top-8 left-6 bg-white rounded-2xl shadow-lg p-4 max-w-xs">
        <h3 className="mb-2">Actividad hoy</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl text-[#007AFF]">{activeClients.length}</div>
            <div className="text-sm text-[#666]">Clientes activos</div>
          </div>
          <div>
            <div className="text-2xl text-[#34C759]">{orders.length}</div>
            <div className="text-sm text-[#666]">Ventas totales</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between items-end px-6 pointer-events-none">
        <button
          onClick={onNavigateToProfile}
          className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto hover:scale-105 transition-transform"
        >
          <User className="w-6 h-6 text-[#007AFF]" />
        </button>

        <div className="flex items-end space-x-3 pointer-events-auto">
          <button
            onClick={() => setCenterMap(!centerMap)}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Navigation className="w-6 h-6 text-[#007AFF]" fill="#007AFF" />
          </button>

          {/* Floating Action Button - Add Product */}
          <button
            onClick={onNavigateToProductForm}
            className="bg-[#007AFF] text-white rounded-full px-6 py-3 shadow-lg flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>Ofrecer producto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
