import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapStyle.css'; // Import your styled components or CSS

const PoliticalControlMap: React.FC = () => {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const animateMap = () => {
      // Placeholder for animation logic handling political changes
      // For example, using mapRef to access the map instance and update states

      // Example of how you might manage time transitions
      let currentYear = 490;
      const transitions = [
        { year: 490, event: 'Persian Wars', color: '#F59E0B', territories: [] },
        { year: 323, event: 'Alexander’s death', color: '#3B82F6', territories: [] },
        { year: 31, event: 'Roman dominance', color: '#DC2626', territories: [] },
        { year: 395, event: 'Empire split', color: '#7C3AED', territories: [] },
        { year: 476, event: 'Western fall', color: '#7C3AED', territories: [] },
        { year: 1453, event: 'Constantinople fall', color: '#059669', territories: [] },
      ];
      let transitionIndex = 0;

      const interval = setInterval(() => {
        if (transitionIndex < transitions.length) {
          const { year, territories, color } = transitions[transitionIndex];

          // Update map polygons/markers with territories and color
          // Example: setTerritoryColor(territories, color);
          mapRef.current?.setStyle({ color }); // pseudo-code

          currentYear = year;
          transitionIndex++;
        } else {
          clearInterval(interval);
        }
      }, 2000); // Adjust for desired transition speed

    };

    animateMap();

    return () => {
      // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="political-map-container">
      <MapContainer center={[34.0522, 14.2437]} zoom={4} scrollWheelZoom={false} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          paperattribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {/* Define more Polygons and Markers as needed for battles and cities */}

        <CircleMarker 
          center={[34.0522, 14.2437]} // Change the lat/lng based on real data
          radius={10}
          pathOptions={{ color: '#DC2626' }} // Battle marker style example
        >
          <tooltip>Battle of Marathon (490 BCE)</tooltip>
        </CircleMarker>
      </MapContainer>
    </div>
  );
};

export default PoliticalControlMap;