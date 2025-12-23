import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// LOGOS Design System Colors
const ERA_COLORS = {
  'Archaic': '#D97706',
  'Classical': '#F59E0B', 
  'Hellenistic': '#3B82F6',
  'Imperial Rome': '#DC2626',
  'Late Antiquity': '#7C3AED',
  'Byzantine': '#059669'
};

const EVIDENCE_ICONS = {
  'Archaeological': '🏛️',
  'Epigraphic': '🪨', 
  'Papyrological': '📋',
  'Literary': '📜'
};

const SITE_TYPES = {
  'city': '🏛️',
  'temple': '⛪',
  'villa': '🏠',
  'shipwreck': '🚢',
  'cemetery': '⚱️',
  'fort': '⚔️'
};

interface ArchaeologicalSite {
  id: string;
  name: string;
  coordinates: [number, number];
  primaryEra: keyof typeof ERA_COLORS;
  siteType: keyof typeof SITE_TYPES;
  status: 'active' | 'completed' | 'ongoing' | 'planned';
  discoveries: string[];
  textsFound: number;
  inscriptions: number;
  reliability: number;
  description: string;
  keyFinds: string[];
  logosConnections: number;
  images: string[];
  excavationYears: string;
  leadArchaeologist?: string;
}

const ARCHAEOLOGICAL_SITES: ArchaeologicalSite[] = [
  {
    id: 'pompeii',
    name: 'Pompeii',
    coordinates: [40.7489, 14.4918],
    primaryEra: 'Imperial Rome',
    siteType: 'city',
    status: 'ongoing',
    discoveries: ['Graffiti corpus', 'Wax tablets', 'Electoral notices', 'Shop signs'],
    textsFound: 11000,
    inscriptions: 5800,
    reliability: 95,
    description: 'Perfectly preserved Roman city with extensive textual evidence',
    keyFinds: ['House of the Surgeon library', 'Gladiator graffiti', 'Election posters'],
    logosConnections: 2847,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1748-present',
    leadArchaeologist: 'Giuseppe Fiorelli'
  },
  {
    id: 'oxyrhynchus', 
    name: 'Oxyrhynchus',
    coordinates: [28.5392, 30.6583],
    primaryEra: 'Imperial Rome',
    siteType: 'city',
    status: 'ongoing',
    discoveries: ['Papyri archive', 'Literary texts', 'Administrative documents'],
    textsFound: 500000,
    inscriptions: 1200,
    reliability: 90,
    description: 'Ancient garbage dump yielding largest papyrus collection',
    keyFinds: ['Sappho fragments', 'Gospel of Thomas', 'Pindar manuscripts'],
    logosConnections: 15684,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1896-present'
  },
  {
    id: 'herculaneum',
    name: 'Herculaneum',  
    coordinates: [40.8059, 14.3477],
    primaryEra: 'Imperial Rome',
    siteType: 'city',
    status: 'ongoing',
    discoveries: ['Villa of Papyri', 'Carbonized scrolls', 'Epicurean library'],
    textsFound: 1800,
    inscriptions: 340,
    reliability: 92,
    description: 'Contains only intact ancient library with philosophical works',
    keyFinds: ['Philodemus scrolls', 'Epicurus works', 'Chrysippus fragments'],
    logosConnections: 934,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1738-present'
  },
  {
    id: 'delos',
    name: 'Delos',
    coordinates: [37.3967, 25.2683],
    primaryEra: 'Hellenistic',
    siteType: 'temple',
    status: 'ongoing',
    discoveries: ['Sacred inventories', 'Dedication inscriptions', 'Commercial records'],
    textsFound: 920,
    inscriptions: 3200,
    reliability: 88,
    description: 'Sacred island with rich epigraphic evidence',
    keyFinds: ['Delian League records', 'Hymn to Apollo', 'Banking archives'],
    logosConnections: 1456,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1873-present'
  },
  {
    id: 'vindolanda',
    name: 'Vindolanda',
    coordinates: [55.0167, -2.3667],
    primaryEra: 'Imperial Rome',
    siteType: 'fort',
    status: 'ongoing', 
    discoveries: ['Writing tablets', 'Military documents', 'Personal letters'],
    textsFound: 3500,
    inscriptions: 180,
    reliability: 93,
    description: 'Roman fort with exceptional organic preservation',
    keyFinds: ['Birthday invitation', 'Military reports', 'Shopping lists'],
    logosConnections: 567,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1970-present'
  },
  {
    id: 'athens-agora',
    name: 'Athenian Agora',
    coordinates: [37.9751, 23.7215],
    primaryEra: 'Classical',
    siteType: 'city',
    status: 'ongoing',
    discoveries: ['Ostrakismos sherds', 'Law inscriptions', 'Commercial texts'],
    textsFound: 2400,
    inscriptions: 4600,
    reliability: 90,
    description: 'Heart of classical democracy with political texts',
    keyFinds: ['Athenian Constitution', 'Ostrakismos ballots', 'Sacred laws'],
    logosConnections: 3421,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1931-present'
  },
  {
    id: 'alexandria',
    name: 'Alexandria',
    coordinates: [31.2001, 29.9187],
    primaryEra: 'Hellenistic',
    siteType: 'city', 
    status: 'ongoing',
    discoveries: ['Library fragments', 'Ptolemaic decrees', 'Scholarly texts'],
    textsFound: 1800,
    inscriptions: 2100,
    reliability: 75,
    description: 'Legendary center of learning, much underwater',
    keyFinds: ['Euclid fragments', 'Ptolemaic astronomy', 'Medical papyri'],
    logosConnections: 2156,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1866-present'
  },
  {
    id: 'ephesos',
    name: 'Ephesos',
    coordinates: [37.9392, 27.3414],
    primaryEra: 'Imperial Rome',
    siteType: 'city',
    status: 'ongoing',
    discoveries: ['Library inscriptions', 'Theater graffiti', 'Christian texts'],
    textsFound: 1600,
    inscriptions: 3800,
    reliability: 87,
    description: 'Major Ionian city with rich bilingual inscriptions',
    keyFinds: ['Celsus Library', 'Acts of John', 'Imperial cult texts'],
    logosConnections: 1789,
    images: ['/api/placeholder/400/300'],
    excavationYears: '1863-present'
  }
];

const ArchaeologicalMap: React.FC = () => {
  const [selectedEras, setSelectedEras] = useState<string[]>(Object.keys(ERA_COLORS));
  const [selectedTypes, setSelectedTypes] = useState<string[]>(Object.keys(SITE_TYPES));
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['active', 'ongoing', 'completed']);
  const [minReliability, setMinReliability] = useState<number>(70);
  const [showTextCounts, setShowTextCounts] = useState<boolean>(true);

  const filteredSites = useMemo(() => {
    return ARCHAEOLOGICAL_SITES.filter(site => 
      selectedEras.includes(site.primaryEra) &&
      selectedTypes.includes(site.siteType) &&
      selectedStatus.includes(site.status) &&
      site.reliability >= minReliability
    );
  }, [selectedEras, selectedTypes, selectedStatus, minReliability]);

  const createCustomIcon = (site: ArchaeologicalSite) => {
    const color = ERA_COLORS[site.primaryEra];
    const typeIcon = SITE_TYPES[site.siteType];
    
    return new Icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${color}" stroke="#F5F4F2" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" font-size="12" fill="#F5F4F2">${typeIcon}</text>
          ${site.reliability >= 90 ? '<circle cx="24" cy="8" r="4" fill="#10B981"/>' : ''}
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  const ReliabilityIndicator: React.FC<{ reliability: number }> = ({ reliability }) => {
    const getColor = (score: number) => {
      if (score >= 90) return '#10B981'; // Green
      if (score >= 80) return '#F59E0B'; // Yellow  
      return '#EF4444'; // Red
    };

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${reliability}%`,
              backgroundColor: getColor(reliability)
            }}
          />
        </div>
        <span className="text-sm font-medium" style={{ color: getColor(reliability) }}>
          {reliability}%
        </span>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="bg-[#1E1E24] p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-[#C9A227] mb-2">
          🏛️ ARCHAEOLOGICAL SITES - Classical World
        </h1>
        <p className="text-gray-300">
          Excavation sites with textual discoveries • Evidence-based reliability • 
          Connected to {ARCHAEOLOGICAL_SITES.reduce((sum, site) => sum + site.logosConnections, 0).toLocaleString()} LOGOS passages
        </p>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Filters Panel */}
        <div className="w-80 bg-[#1E1E24] p-4 overflow-y-auto border-r border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-[#C9A227]">🔍 Filters</h3>
          
          {/* Era Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">📅 Historical Eras</h4>
            <div className="space-y-2">
              {Object.entries(ERA_COLORS).map(([era, color]) => (
                <label key={era} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedEras.includes(era)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEras([...selectedEras, era]);
                      } else {
                        setSelectedEras(selectedEras.filter(e => e !== era));
                      }
                    }}
                    className="rounded"
                  />
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{era}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Site Type Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">🏗️ Site Types</h4>
            <div className="space-y-2">
              {Object.entries(SITE_TYPES).map(([type, icon]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTypes([...selectedTypes, type]);
                      } else {
                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                      }
                    }}
                    className="rounded"
                  />
                  <span>{icon}</span>
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reliability Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">🎯 Min. Evidence Reliability</h4>
            <input
              type="range"
              min="60"
              max="100"
              value={minReliability}
              onChange={(e) => setMinReliability(Number(e.target.value))}
              className="w-full accent-[#C9A227]"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>60%</span>
              <span className="text-[#C9A227]">{minReliability}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">⚡ Excavation Status</h4>
            {['ongoing', 'completed', 'active', 'planned'].map(status => (
              <label key={status} className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={selectedStatus.includes(status)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStatus([...selectedStatus, status]);
                    } else {
                      setSelectedStatus(selectedStatus.filter(s => s !== status));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm capitalize">{status}</span>
              </label>
            ))}
          </div>

          {/* Display Options */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">👁️ Display</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTextCounts}
                onChange={(e) => setShowTextCounts(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show text counts</span>
            </label>
          </div>

          {/* Results Summary */}
          <div className="bg-[#0D0D0F] p-3 rounded">
            <h4 className="font-medium mb-2 text-[#C9A227]">📊 Results</h4>
            <div className="text-sm space-y-1">
              <div>Sites: {filteredSites.length}</div>
              <div>Total Texts: {filteredSites.reduce((sum, site) => sum + site.textsFound, 0).toLocaleString()}</div>
              <div>Inscriptions: {filteredSites.reduce((sum, site) => sum + site.inscriptions, 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[37.5, 15]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="bg-[#0D0D0F]"
          >
            <TileLayer
              url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            
            {filteredSites.map(site => (
              <Marker
                key={site.id}
                position={site.coordinates}
                icon={createCustomIcon(site)}
              >
                <Popup className="archaeological-popup" maxWidth={400}>
                  <div className="bg-[#1E1E24] text-[#F5F4F2] p-4 rounded max-w-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{SITE_TYPES[site.siteType]}</span>
                      <h3 className="font-bold text-lg text-[#C9A227]">{site.name}</h3>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ERA_COLORS[site.primaryEra] }}
                        />
                        <span className="text-sm">{site.primaryEra}</span>
                        <span className="text-xs text-gray-400">({site.excavationYears})</span>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-xs text-gray-400">Evidence Reliability:</span>
                        <ReliabilityIndicator reliability={site.reliability} />
                      </div>
                    </div>

                    <p className="text-sm mb-3 text-gray-300">{site.description}</p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div className="bg-[#0D0D0F] p-2 rounded">
                        <div className="text-[#C9A227] font-medium">📜 Texts Found</div>
                        <div className="text-lg">{site.textsFound.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#0D0D0F] p-2 rounded">
                        <div className="text-[#C9A227] font-medium">🪨 Inscriptions</div>
                        <div className="text-lg">{site.inscriptions.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#0D0D0F] p-2 rounded">
                        <div className="text-[#C9A227] font-medium">🔗 LOGOS Links</div>
                        <div className="text-lg">{site.logosConnections.toLocaleString()}</div>
                      </div>
                      <div className="bg-[#0D0D0F] p-2 rounded">
                        <div className="text-[#C9A227] font-medium">⚡ Status</div>
                        <div className="capitalize">{site.status}</div>
                      </div>
                    </div>

                    {/* Key Discoveries */}
                    <div className="mb-3">
                      <h4 className="font-medium text-[#C9A227] mb-2">🏆 Key Discoveries</h4>
                      <ul className="text-xs space-y-1">
                        {site.keyFinds.slice(0, 3).map((find, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#C9A227]">•</span>
                            <span>{find}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="bg-[#C9A227] text-[#0D0D0F] px-3 py-1 rounded text-xs font-medium hover:bg-[#B8911F]">
                        View in LOGOS
                      </button>
                      <button className="bg-[#3B82F6] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#2563EB]">
                        Site Details
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ArchaeologicalMap;