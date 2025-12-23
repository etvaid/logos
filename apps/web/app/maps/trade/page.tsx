"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';

// LOGOS DESIGN SYSTEM
const ERA_COLORS = {
  Archaic: '#D97706',
  Classical: '#F59E0B',
  Hellenistic: '#3B82F6',
  ImperialRome: '#DC2626',
  LateAntiquity: '#7C3AED',
  Byzantine: '#059669',
};

const LANGUAGE_COLORS = {
  Greek: '#3B82F6',
  Latin: '#DC2626',
  Hebrew: '#059669',
  Syriac: '#D97706',
  Coptic: '#EC4899',
  Arabic: '#7C3AED',
};

const CONTEXT_LAYER_COLORS = {
  Political: '#DC2626',
  Economic: '#059669',
  Social: '#7C3AED',
  Religious: '#F59E0B',
  Intellectual: '#3B82F6',
};

const EVIDENCE_RELIABILITY = {
  Archaeological: { icon: '🏛️', reliability: 95 },
  Epigraphic: { icon: '🪨', reliability: 90 },
  Numismatic: { icon: '🪙', reliability: 90 },
  Papyrological: { icon: '📋', reliability: 85 },
  Literary: { icon: '📜', reliability: 75 },
  Manuscript: { icon: '📖', reliability: 70 },
};

const BACKGROUND_COLOR = '#0D0D0F';
const SECONDARY_COLOR = '#1E1E24';
const TEXT_COLOR = '#F5F4F2';
const ACCENT_GOLD = '#C9A227';

// Data Structures
interface RouteData {
  id: string;
  name: string;
  commodity: string;
  era: keyof typeof ERA_COLORS;
  volume: string;
  path: [number, number][];
  evidenceType: keyof typeof EVIDENCE_RELIABILITY;
  startCity: string;
  endCity: string;
}

interface CityData {
    name: string;
    position: [number, number];
    tradeVolume: number; // Example trade statistic
}

// Styled Slider
const CustomSlider = styled(Slider)(({ theme }) => ({
    color: ACCENT_GOLD,
    height: 8,
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: BACKGROUND_COLOR,
        border: `2px solid ${ACCENT_GOLD}`,
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: ACCENT_GOLD,
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
}));


const TradeRoutes: React.FC = () => {
  const [year, setYear] = useState(500); // Initial year
  const [routeDetails, setRouteDetails] = useState<RouteData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRouteClick = (route: RouteData) => {
      setRouteDetails(route);
      setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
      setRouteDetails(null);
  };

  const handleYearChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setYear(newValue);
    }
  };

  // Demo Data
  const routes: RouteData[] = [
    {
      id: 'grainRoute',
      name: 'Grain Route Egypt → Rome',
      commodity: 'Grain',
      era: 'ImperialRome',
      volume: 'High',
      path: [[31.2357, 30.0444], [41.9028, 12.4964]], // Egypt to Rome
      evidenceType: 'Archaeological',
      startCity: 'Alexandria',
      endCity: 'Rome'
    },
    {
      id: 'silkRoute',
      name: 'Silk Route China → Rome',
      commodity: 'Silk',
      era: 'ImperialRome',
      volume: 'Medium',
      path: [[34.6667, 138.2500], [34.5667, 36.5167], [41.9028, 12.4964]], // China to Palmyra to Rome
      evidenceType: 'Literary',
      startCity: 'Unknown (China)',
      endCity: 'Rome'
    },
    {
      id: 'tinRoute',
      name: 'Tin Route Britain → Mediterranean',
      commodity: 'Tin',
      era: 'Archaic',
      volume: 'Low',
      path: [[51.5074, 0.1278], [37.9838, 23.7275]], // Britain to Athens
      evidenceType: 'Archaeological',
      startCity: 'Britain',
      endCity: 'Athens'
    },
  ];

    const cities: CityData[] = [
      { name: 'Alexandria', position: [31.2357, 30.0444], tradeVolume: 5000 },
      { name: 'Rome', position: [41.9028, 12.4964], tradeVolume: 7000 },
      { name: 'Athens', position: [37.9838, 23.7275], tradeVolume: 3000 },
    ];

    // Function to filter routes based on the current year
    const filteredRoutes = routes.filter(route => {
        const eraStartYears: { [key in keyof typeof ERA_COLORS]: number } = {
            Archaic: 800,
            Classical: 500,
            Hellenistic: 323,
            ImperialRome: 31,
            LateAntiquity: 284,
            Byzantine: 600,
        };

        const eraEndYears: { [key in keyof typeof ERA_COLORS]: number } = {
            Archaic: 500,
            Classical: 323,
            Hellenistic: 31,
            ImperialRome: 284,
            LateAntiquity: 600,
            Byzantine: 1453,
        };

        const era = route.era;
        return year >= (eraStartYears[era] || 0) && year <= (eraEndYears[era] || 1453);
    });

    // Function to calculate reliability score based on evidence
    const calculateReliability = (evidenceType: keyof typeof EVIDENCE_RELIABILITY): number => {
        return EVIDENCE_RELIABILITY[evidenceType].reliability;
    };

  return (
    <div style={{ backgroundColor: BACKGROUND_COLOR, color: TEXT_COLOR, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" align="center" style={{ padding: '20px', color: ACCENT_GOLD }}>
        Ancient Mediterranean Trade Routes ({year} BCE/CE)
      </Typography>
      <div style={{ flex: 1, display: 'flex' }}>
        <MapContainer
          center={[34.8021, 23.5185]}
          zoom={4}
          style={{ width: '80%', height: '100%', zIndex: 0 }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredRoutes.map((route) => (
              <Polyline
                  key={route.id}
                  positions={route.path}
                  color={ERA_COLORS[route.era]}
                  weight={3}
                  eventHandlers={{
                      click: () => handleRouteClick(route),
                  }}
              >
                  <Tooltip sticky>
                      <div>
                          <strong>{route.name}</strong><br />
                          Commodity: {route.commodity}<br />
                          Era: {route.era}<br />
                          Reliability: {calculateReliability(route.evidenceType)}%
                      </div>
                  </Tooltip>
              </Polyline>
          ))}
          {cities.map(city => (
                <CircleMarker
                    key={city.name}
                    center={city.position}
                    radius={Math.sqrt(city.tradeVolume) / 5}  // Adjust divisor for better scaling
                    fillColor={ACCENT_GOLD}
                    color={BACKGROUND_COLOR}
                    weight={1}
                    opacity={0.8}
                    fillOpacity={0.6}
                >
                    <Tooltip sticky>
                        <div>
                            <strong>{city.name}</strong><br />
                            Trade Volume: {city.tradeVolume}
                        </div>
                    </Tooltip>
                </CircleMarker>
            ))}
        </MapContainer>

        <div style={{ width: '20%', padding: '20px', backgroundColor: SECONDARY_COLOR }}>
          <Typography variant="h6" gutterBottom color={ACCENT_GOLD}>
            Timeline
          </Typography>
          <CustomSlider
              aria-label="Year"
              defaultValue={500}
              value={year}
              onChange={handleYearChange}
              valueLabelDisplay="auto"
              step={10}
              marks
              min={-800} // BCE
              max={1453} // End of Byzantine
          />

          <Typography variant="body2" style={{ marginTop: '20px' }}>
            Year: {year} {year < 0 ? 'BCE' : 'CE'}
          </Typography>
        </div>
      </div>

      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
          <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
              {routeDetails && (
                  <div>
                      <strong>Route Details: {routeDetails.name}</strong><br />
                      Commodity: {routeDetails.commodity}<br />
                      Era: {routeDetails.era}<br />
                      Start City: {routeDetails.startCity}<br />
                      End City: {routeDetails.endCity}<br />
                      Evidence Type: {routeDetails.evidenceType} ({EVIDENCE_RELIABILITY[routeDetails.evidenceType].reliability}%)
                  </div>
              )}
          </Alert>
      </Snackbar>
    </div>
  );
};

export default TradeRoutes;