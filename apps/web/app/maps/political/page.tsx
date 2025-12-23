'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Override default marker icon (needed for Next.js)
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface EmpireData {
  [key: string]: {
    name: string;
    color: string;
    coordinates: number[][][];
  };
}

const empires: EmpireData = {
  greekCityStates: {
    name: 'Greek City-States',
    color: '#D97706',
    coordinates: [
      [
        [36, 23],
        [40, 25],
        [39, 28],
        [36, 26],
        [36, 23],
      ],
      [
        [35, 21],
        [38, 23],
        [37, 25],
        [34, 23],
        [35, 21],
      ],
    ],
  },
  persianEmpire: {
    name: 'Persian Empire',
    color: '#F59E0B',
    coordinates: [
      [
        [30, 45],
        [40, 50],
        [38, 55],
        [28, 50],
        [30, 45],
      ],
      [
        [25, 50],
        [35, 55],
        [33, 60],
        [23, 55],
        [25, 50],
      ],
    ],
  },
  alexandersEmpire: {
    name: "Alexander's Empire",
    color: '#3B82F6',
    coordinates: [
      [
        [30, 35],
        [40, 40],
        [38, 45],
        [28, 40],
        [30, 35],
      ],
    ],
  },
  romanRepublic: {
    name: 'Roman Republic',
    color: '#DC2626',
    coordinates: [
      [
        [40, 10],
        [45, 15],
        [43, 20],
        [38, 15],
        [40, 10],
      ],
    ],
  },
  romanEmpire: {
    name: 'Roman Empire',
    color: '#DC2626',
    coordinates: [
      [
        [35, -5],
        [50, 30],
        [35, 45],
        [25, 35],
        [35, -5],
      ],
    ],
  },
  dividedEmpire: {
    name: 'Divided Empire',
    color: '#7C3AED',
    coordinates: [
      [
        [35, -5],
        [50, 15],
        [35, 30],
        [25, 20],
        [35, -5],
      ],
    ],
  },
};

const eraEmpires: { [key: number]: string[] } = {
  500: ['greekCityStates', 'persianEmpire'],
  323: ['alexandersEmpire'],
  100: ['romanRepublic'],
  1: ['romanEmpire'],
  400: ['dividedEmpire'],
};

const keyEvents: { [key: number]: string } = {
  500: 'Height of Greek City-States and Persian Empire',
  323: "Death of Alexander the Great; division of Alexander's empire",
  100: 'Roman Republic controls much of the Mediterranean',
  1: 'Start of the Roman Empire under Augustus',
  400: 'Division of the Roman Empire',
};

const center = [40, 20]; // Centered around Mediterranean
const zoom = 3;

const MapComponent = () => {
  const [year, setYear] = useState(500);

  const getDisplayedEmpires = (): EmpireData => {
    const era = Object.keys(eraEmpires).find(
      (era) => parseInt(era) <= year
    );
    if (!era) return {};
    const empireKeys = eraEmpires[parseInt(era)];
    const displayedEmpires: EmpireData = {};
    empireKeys.forEach((key) => {
      displayedEmpires[key] = empires[key];
    });
    return displayedEmpires;
  };

  const displayedEmpires = getDisplayedEmpires();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYear(parseInt(e.target.value));
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '600px', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(displayedEmpires).map(([key, empire]) => (
          <React.Fragment key={key}>
            {empire.coordinates.map((coords, index) => (
              <Polygon
                key={`${key}-${index}`}
                positions={coords}
                color={empire.color}
                fillOpacity={0.7}
              >
                <Popup>
                  <b>{empire.name}</b>
                </Popup>
              </Polygon>
            ))}
          </React.Fragment>
        ))}
      </MapContainer>

      <div style={{ padding: '20px' }}>
        <label htmlFor="year" style={{ display: 'block', marginBottom: '10px' }}>
          Year: {year}
        </label>
        <input
          type="range"
          id="year"
          min="100"
          max="500"
          step="1"
          value={year}
          onChange={handleSliderChange}
          style={{ width: '100%' }}
        />
        {keyEvents[year] && (
          <p style={{ marginTop: '10px' }}>Key Event: {keyEvents[year]}</p>
        )}
      </div>
      <style jsx global>{`
        .leaflet-popup-content {
          color: #0D0D0F;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;