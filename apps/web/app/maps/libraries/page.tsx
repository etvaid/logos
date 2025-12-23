'use client';

import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { format } from 'date-fns';

const librariesSchools = [
  {
    name: 'Library of Alexandria',
    location: { lat: 31.2, lng: 29.9 },
    year: -300,
    type: 'library',
    description: 'Largest library of the ancient world.',
    importance: 1,
  },
  {
    name: 'Pergamon Library',
    location: { lat: 39.1, lng: 27.2 },
    year: -200,
    type: 'library',
    description: 'Second largest library after Alexandria.',
    importance: 0.8,
  },
  {
    name: 'Academy of Athens',
    location: { lat: 37.9, lng: 23.7 },
    year: -387,
    type: 'school',
    description: 'Founded by Plato.',
    importance: 0.7,
  },
  {
    name: 'Lyceum',
    location: { lat: 37.9, lng: 23.7 },
    year: -335,
    type: 'school',
    description: 'Founded by Aristotle.',
    importance: 0.6,
  },
  {
    name: 'School of Nisibis',
    location: { lat: 37.0, lng: 41.2 },
    year: 350,
    type: 'school',
    description: 'Important center of Nestorian learning.',
    importance: 0.5,
  },
];

const containerStyle = {
  width: '100%',
  height: '500px',
};

const mapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
};

const LibrariesSchoolsMap = () => {
  const [selectedSite, setSelectedSite] = useState(null);

  const handleMarkerClick = (site) => {
    setSelectedSite(site);
  };

  const timelineYears = [...new Set(librariesSchools.map((site) => site.year))].sort((a, b) => a - b);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <h1>Libraries & Schools of the Ancient World</h1>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 34, lng: 30 }}
          zoom={4}
          options={mapOptions}
        >
          {librariesSchools.map((site) => (
            <Marker
              key={site.name}
              position={site.location}
              options={{
                icon: {
                  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', // Simplified pin shape for better rendering
                  fillColor: site.type === 'library' ? '#C9A227' : '#3B82F6',
                  fillOpacity: 0.8,
                  strokeColor: '#0D0D0F',
                  strokeWeight: 1,
                  scale: 0.04 + site.importance * 0.02,  // Scale marker size based on importance
                  anchor: new google.maps.Point(12, 22), // Set the anchor point for the icon
                },
              }}
              onClick={() => handleMarkerClick(site)}
            />
          ))}
        </GoogleMap>
      </LoadScript>

      {selectedSite && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1E1E24', borderRadius: '5px' }}>
          <h3>{selectedSite.name}</h3>
          <p>Year: {selectedSite.year}</p>
          <p>Type: {selectedSite.type}</p>
          <p>{selectedSite.description}</p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Timeline</h2>
        <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px' }}>
          {timelineYears.map((year) => (
            <div
              key={year}
              style={{
                flexShrink: 0,
                width: '100px',
                marginRight: '10px',
                padding: '10px',
                border: '1px solid #C9A227',
                borderRadius: '5px',
                textAlign: 'center',
                backgroundColor: '#1E1E24',
              }}
            >
              {year > 0 ? year + " CE" : Math.abs(year) + " BCE"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibrariesSchoolsMap;