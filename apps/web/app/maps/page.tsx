'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface MapLocation {
  id: string;
  name: string;
  type: 'city' | 'site' | 'battle' | 'sanctuary' | 'route';
  coordinates: [number, number]; // [latitude, longitude]
  year: number;
  description: string;
  language: 'greek' | 'latin';
  importance: number;
  relatedAuthors: string[];
  relatedWorks: string[];
  modernName?: string;
  status: 'active' | 'ruins' | 'lost' | 'founded' | 'destroyed';
}

interface Journey {
  id: string;
  name: string;
  author?: string;
  description: string;
  route: Array<{
    location: string;
    coordinates: [number, number];
    order: number;
    description: string;
  }>;
  timeRange: {
    start: number;
    end: number;
  };
  type: 'historical' | 'literary' | 'mythological';
}

interface PoliticalEntity {
  id: string;
  name: string;
  type: 'empire' | 'city-state' | 'kingdom' | 'province';
  bounds: Array<[number, number]>; // polygon coordinates
  capital?: string;
  ruler?: string;
  culture: 'greek' | 'roman' | 'persian' | 'celtic' | 'other';
  color: string;
}

interface MapData {
  locations: MapLocation[];
  politicalEntities: PoliticalEntity[];
  year: number;
}

interface CityInfo {
  name: string;
  modernName?: string;
  coordinates: [number, number];
  foundedYear?: number;
  destroyedYear?: number;
  description: string;
  notableEvents: Array<{
    year: number;
    event: string;
    description: string;
  }>;
  authors: Array<{
    name: string;
    birthYear?: number;
    deathYear?: number;
    works: string[];
  }>;
  monuments: string[];
  population?: number;
  significance: string;
}

export default function MapsPage() {
  const [currentYear, setCurrentYear] = useState(100); // 100 CE
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [cityInfo, setCityInfo] = useState<CityInfo | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCityPanel, setShowCityPanel] = useState(false);
  const [layers, setLayers] = useState({
    political: true,
    sites: true,
    authors: true,
    journeys: false
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Time range: 800 BCE to 600 CE
  const minYear = -800; // 800 BCE
  const maxYear = 600;  // 600 CE

  const fetchMapData = useCallback(async (year: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/atlas/map/political/${year}`);
      if (!response.ok) {
        throw new Error('Failed to fetch map data');
      }
      const data: MapData = await response.json();
      setMapData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load map data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJourneys = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/atlas/journeys');
      if (!response.ok) throw new Error('Failed to fetch journeys');
      const data: Journey[] = await response.json();
      setJourneys(data);
    } catch (err) {
      console.error('Failed to fetch journeys:', err);
      // Fallback data
      setJourneys([
        {
          id: 'odyssey',
          name: 'Odyssey of Odysseus',
          author: 'Homer',
          description: 'The legendary journey of Odysseus returning home from Troy',
          route: [
            { location: 'Troy', coordinates: [39.9577, 26.2391], order: 1, description: 'Starting point' },
            { location: 'Ithaca', coordinates: [38.4312, 20.7311], order: 10, description: 'Final destination' }
          ],
          timeRange: { start: -1200, end: -1190 },
          type: 'mythological'
        },
        {
          id: 'aeneid',
          name: 'Journey of Aeneas',
          author: 'Virgil',
          description: 'Aeneas\' journey from Troy to Italy',
          route: [
            { location: 'Troy', coordinates: [39.9577, 26.2391], order: 1, description: 'Escape from Troy' },
            { location: 'Rome', coordinates: [41.9028, 12.4964], order: 5, description: 'Foundation of Rome' }
          ],
          timeRange: { start: -1200, end: -1150 },
          type: 'mythological'
        },
        {
          id: 'caesar_gaul',
          name: 'Caesar\'s Gallic Wars',
          author: 'Julius Caesar',
          description: 'Caesar\'s military campaigns in Gaul',
          route: [
            { location: 'Rome', coordinates: [41.9028, 12.4964], order: 1, description: 'Starting point' },
            { location: 'Alesia', coordinates: [47.5369, 4.4969], order: 8, description: 'Final victory' }
          ],
          timeRange: { start: -58, end: -50 },
          type: 'historical'
        }
      ]);
    }
  }, []);

  const fetchCityInfo = useCallback(async (locationId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/atlas/city/${locationId}`);
      if (!response.ok) throw new Error('Failed to fetch city info');
      const data: CityInfo = await response.json();
      setCityInfo(data);
      setShowCityPanel(true);
    } catch (err) {
      console.error('Failed to fetch city info:', err);
      // Fallback city info based on location
      setCityInfo({
        name: selectedLocation?.name || 'Unknown City',
        coordinates: selectedLocation?.coordinates || [0, 0],
        description: selectedLocation?.description || 'A significant location in the ancient world.',
        notableEvents: [
          { year: currentYear, event: 'Notable Event', description: 'Significant historical occurrence' }
        ],
        authors: [
          { name: 'Ancient Author', works: ['Classical Work'] }
        ],
        monuments: ['Ancient Monument', 'Historical Site'],
        significance: 'Important cultural and political center'
      });
      setShowCityPanel(true);
    }
  }, [selectedLocation, currentYear]);

  useEffect(() => {
    fetchMapData(currentYear);
    fetchJourneys();
  }, [currentYear, fetchMapData, fetchJourneys]);

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
    fetchMapData(newYear);
  };

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
    setShowPopup(true);
  };

  const handleLayerToggle = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const toggleTimeAnimation = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentYear(prev => {
          const next = prev + (10 * playSpeed);
          if (next > maxYear) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return maxYear;
          }
          return next;
        });
      }, 500);
    }
  };

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const renderMap = () => {
    return (
      <div className="relative w-full h-full bg-[#1a1a2e] rounded-lg overflow-hidden border border-[#C9A962]/20">
        {/* Map Placeholder - In production, this would be Leaflet or Mapbox */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#16213e] to-[#0f172a]">
          {/* Mediterranean Sea */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-64 bg-[#2563eb]/20 rounded-full opacity-50"></div>
          
          {/* Land masses (simplified) */}
          <div className="absolute top-1/3 left-1/3 w-48 h-32 bg-[#C9A962]/10 rounded-lg opacity-30"></div>
          <div className="absolute top-1/2 right-1/4 w-36 h-24 bg-[#C9A962]/10 rounded-lg opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/2 w-40 h-20 bg-[#C9A962]/10 rounded-lg opacity-30"></div>
        </div>

        {/* Locations */}
        {mapData?.locations
          .filter(loc => layers.sites && Math.abs(loc.year - currentYear) <= 50)
          .map((location, index) => (
          <div
            key={location.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              left: `${50 + (location.coordinates[1] * 2)}%`,
              top: `${50 + (location.coordinates[0] * -1.5)}%`
            }}
            onClick={() => handleLocationClick(location)}
          >
            <div className={`w-3 h-3 rounded-full border-2 border-white group-hover:scale-150 transition-transform ${
              location.type === 'city' ? 'bg-[#C9A962]' :
              location.type === 'site' ? 'bg-[#5BA4E8]' :
              location.type === 'battle' ? 'bg-[#E85B5B]' :
              'bg-gray-400'
            }`}></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/70 px-2 py-1 rounded font-serif">
              {location.name}
            </div>
          </div>
        ))}

        {/* Journey Routes */}
        {layers.journeys && selectedJourney && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {selectedJourney.route.slice(0, -1).map((point, index) => {
              const nextPoint = selectedJourney.route[index + 1];
              if (!nextPoint) return null;
              
              const x1 = 50 + (point.coordinates[1] * 2);
              const y1 = 50 + (point.coordinates[0] * -1.5);
              const x2 = 50 + (nextPoint.coordinates[1] * 2);
              const y2 = 50 + (nextPoint.coordinates[0] * -1.5);
              
              return (
                <line
                  key={index}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#C9A962"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.8"
                />
              );
            })}
          </svg>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-2"></div>
              <p className="text-[#F5F3EF]/70 text-sm">Loading map data...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-