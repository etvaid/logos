import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Override default marker icon (necessary for custom markers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Type definitions
interface MonasteryData {
  name: string;
  location: [number, number]; // [latitude, longitude]
  textsPreserved: string[];
  dating: string;
  currentLocation: string;
  language: 'Greek' | 'Latin';
  manuscriptCount: number; // Used for sizing markers
}

interface TransmissionRoute {
  from: string;
  to: string;
  path: [number, number][]; // Array of [latitude, longitude] points
}


const ManuscriptSurvivalMap: React.FC = () => {
  const [selectedMonastery, setSelectedMonastery] = useState<MonasteryData | null>(null);

  // Data: Monastery locations, texts, and language
  const monasteries: MonasteryData[] = [
    {
      name: 'Monte Cassino',
      location: [41.4905, 13.8100],
      textsPreserved: ['Tacitus', 'Apuleius'],
      dating: '8th-12th centuries',
      currentLocation: 'Various libraries',
      language: 'Latin',
      manuscriptCount: 50,
    },
    {
      name: 'Bobbio',
      location: [44.7739, 9.2003],
      textsPreserved: ['Cicero (palimpsests)'],
      dating: '7th-11th centuries',
      currentLocation: 'Vatican Library, Ambrosiana',
      language: 'Latin',
      manuscriptCount: 30,
    },
    {
      name: 'St. Gall',
      location: [47.4252, 9.3742],
      textsPreserved: ['Various classical texts'],
      dating: '8th-12th centuries',
      currentLocation: 'Stiftsbibliothek St. Gallen',
      language: 'Latin',
      manuscriptCount: 75,
    },
    {
      name: 'Constantinople',
      location: [41.0082, 28.9784],
      textsPreserved: ['Large Greek corpus'],
      dating: '4th-15th centuries',
      currentLocation: 'Various libraries globally',
      language: 'Greek',
      manuscriptCount: 120,
    },
    {
      name: 'Cordoba',
      location: [37.8833, -4.7792],
      textsPreserved: ['Arabic translations of Greek works'],
      dating: '8th-13th centuries',
      currentLocation: 'Escorial Library, etc.',
      language: 'Greek', // Technically Arabic translations, but origin is Greek
      manuscriptCount: 60,
    },
  ];

  // Data: Transmission routes
  const transmissionRoutes: TransmissionRoute[] = [
    {
      from: 'Monte Cassino',
      to: 'Vatican Library',
      path: [[41.4905, 13.8100], [41.9029, 12.4534]],
    },
    {
      from: 'Bobbio',
      to: 'Ambrosiana',
      path: [[44.7739, 9.2003], [45.4642, 9.1895]],
    },
    {
      from: 'Constantinople',
      to: 'Venice',
      path: [[41.0082, 28.9784], [45.4408, 12.3155]],
    },
    {
      from: 'Cordoba',
      to: 'Toledo',
      path: [[37.8833, -4.7792], [39.8629, -4.0280]],
    }
  ];


  // Determine marker color based on language
  const getMarkerColor = (language: 'Greek' | 'Latin'): string => {
    switch (language) {
      case 'Greek':
        return '#3B82F6'; // From the Logos Design System for Greek
      case 'Latin':
        return '#DC2626'; // From the Logos Design System for Latin
      default:
        return '#FFFFFF';
    }
  };

  const handleMonasteryClick = (monastery: MonasteryData) => {
    setSelectedMonastery(monastery);
  };

  const mapCenter: [number, number] = [45, 15]; // Approximate center of Europe

  const mapStyle = {
    height: '800px', // Adjust as needed
    width: '100%',
    backgroundColor: '#0D0D0F',
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <h1>Manuscript Survival Map</h1>
      <p>A map showing the locations of monasteries that preserved classical texts during the Middle Ages.</p>

      <MapContainer center={mapCenter} zoom={4} style={mapStyle} scrollWheelZoom={true}>
        <TileLayer
          url="https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {monasteries.map((monastery, index) => (
          <Marker
            key={index}
            position={monastery.location}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `<div style="width: ${10 + Math.sqrt(monastery.manuscriptCount) * 2}px; height: ${10 + Math.sqrt(monastery.manuscriptCount) * 2}px; border-radius: 50%; background-color: ${getMarkerColor(monastery.language)}; border: 1px solid #F5F4F2;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
            eventHandlers={{
              click: () => {
                handleMonasteryClick(monastery);
              },
            }}
          >
             {/* Removed popup for now to use the side panel instead */}
          </Marker>
        ))}

        {transmissionRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.path}
            color="#C9A227" // Accent Gold
            weight={2}
            opacity={0.7}
            dashArray="5, 5"
          />
        ))}

      </MapContainer>

      {/* Side Panel for Monastery Details */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1E1E24', borderRadius: '5px' }}>
        {selectedMonastery ? (
          <>
            <h3>{selectedMonastery.name}</h3>
            <p><strong>Texts Preserved:</strong> {selectedMonastery.textsPreserved.join(', ')}</p>
            <p><strong>Dating:</strong> {selectedMonastery.dating}</p>
            <p><strong>Current Location:</strong> {selectedMonastery.currentLocation}</p>
            <p><strong>Language:</strong> {selectedMonastery.language}</p>
          </>
        ) : (
          <p>Click on a monastery to view details.</p>
        )}
      </div>
      <p style={{marginTop: '15px', fontSize: '0.8em', color: '#9CA3AF'}}>Note: Marker size is proportional to the square root of the manuscript count for visualization purposes.</p>
    </div>
  );
};

export default ManuscriptSurvivalMap;