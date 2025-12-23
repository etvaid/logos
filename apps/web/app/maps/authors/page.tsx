npm install react-leaflet leaflet styled-components
// AuthorOriginsMap.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

// Customize map icon
const iconBlue = new L.Icon({
  iconUrl: 'path/to/blue-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const iconRed = new L.Icon({
  iconUrl: 'path/to/red-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Styled components
const MapWrapper = styled.div`
  background-color: #0D0D0F;
  color: #F5F4F2;
  height: 100vh;
`;

interface Author {
  name: string;
  birthPlace: [number, number];
  language: 'Greek' | 'Latin';
  migration: [number, number][];
}

const authors: Author[] = [
  {
    name: 'Homer',
    birthPlace: [37.5, 27.0], // Approximate Ionia
    language: 'Greek',
    migration: [], // No known migrations
  },
  {
    name: 'Plato',
    birthPlace: [37.9838, 23.7275], // Athens
    language: 'Greek',
    migration: [],
  },
  // Add more authors here...
];

const AuthorOriginsMap = () => {
  return (
    <MapWrapper>
      <MapContainer center={[34, 18]} zoom={5} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {authors.map((author) => (
          <Marker
            key={author.name}
            position={author.birthPlace}
            icon={author.language === 'Greek' ? iconBlue : iconRed}
          >
            <Popup>
              <b>{author.name}</b> <br />
              Language: {author.language}
            </Popup>
            {author.migration.length > 0 && (
              <Polyline 
                positions={[author.birthPlace, ...author.migration]}
                color={author.language === 'Greek' ? '#3B82F6' : '#DC2626'}
              />
            )}
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default AuthorOriginsMap;
// App.tsx
import React from 'react';
import AuthorOriginsMap from './AuthorOriginsMap';

const App: React.FC = () => {
  return (
    <div>
      <AuthorOriginsMap />
    </div>
  );
};

export default App;