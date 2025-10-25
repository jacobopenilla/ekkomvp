import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Default map options
const defaultMapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

/**
 * MapComponent - A reusable Google Maps component
 * @param {Object} props - Component props
 * @param {Array} props.markers - Array of marker objects with lat, lng, name, type
 * @param {Object} props.center - Center coordinates { lat, lng }
 * @param {number} props.zoom - Map zoom level
 * @param {Function} props.onMarkerClick - Callback when marker is clicked
 * @param {boolean} props.showUserLocation - Whether to show user's current location
 * @param {string} props.mapType - Type of map (client, entrepreneur, checkout)
 */
export function MapComponent({ 
  markers = [], 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 13, 
  onMarkerClick,
  showUserLocation = false,
  mapType = 'default'
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [map, setMap] = useState(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  // Get user's current location using browser geolocation API
  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Center map on user location if no center is provided
          if (map && (!center || (center.lat === 40.7128 && center.lng === -74.0060))) {
            map.panTo(userPos);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, [map, center]);

  // Initialize user location on component mount
  useEffect(() => {
    if (showUserLocation && isLoaded) {
      getUserLocation();
    }
  }, [showUserLocation, isLoaded, getUserLocation]);

  // Handle marker click events
  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  }, [onMarkerClick]);

  // Handle map load
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Handle map unload
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Close info window
  const closeInfoWindow = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Render marker based on type
  const renderMarker = (marker, index) => {
    const markerIcon = getMarkerIcon(marker.type);
    
    return (
      <Marker
        key={marker.id || index}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={() => handleMarkerClick(marker)}
        icon={markerIcon}
        title={marker.name}
      />
    );
  };

  // Get appropriate marker icon based on type
  const getMarkerIcon = (type) => {
    const baseIcon = {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${getMarkerColor(type)}" stroke="white" stroke-width="3"/>
          <text x="20" y="26" text-anchor="middle" fill="white" font-size="16" font-weight="bold">
            ${getMarkerEmoji(type)}
          </text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20)
    };
    return baseIcon;
  };

  // Get marker color based on type
  const getMarkerColor = (type) => {
    switch (type) {
      case 'business': return '#007AFF';
      case 'client': return '#34C759';
      case 'user': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  // Get marker emoji based on type
  const getMarkerEmoji = (type) => {
    switch (type) {
      case 'business': return '🏪';
      case 'client': return '👤';
      case 'user': return '📍';
      default: return '📍';
    }
  };

  // Show loading state
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F4F8] to-[#D4E9F0]">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-[#666]">Error loading map</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F4F8] to-[#D4E9F0]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🗺️</div>
          <p className="text-[#666]">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation && showUserLocation ? userLocation : center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={defaultMapOptions}
      >
        {/* Render user location marker if available */}
        {userLocation && showUserLocation && (
          <Marker
            position={userLocation}
            icon={getMarkerIcon('user')}
            title="Your location"
          />
        )}

        {/* Render all markers */}
        {markers.map((marker, index) => renderMarker(marker, index))}

        {/* Info window for selected marker */}
        {selectedMarker && (
          <InfoWindow
            position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
            onCloseClick={closeInfoWindow}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm">{selectedMarker.name}</h3>
              {selectedMarker.distance && (
                <p className="text-xs text-[#666] mt-1">
                  {selectedMarker.distance} km away
                </p>
              )}
              {selectedMarker.description && (
                <p className="text-xs text-[#666] mt-1">
                  {selectedMarker.description}
                </p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapComponent;

