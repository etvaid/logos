import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, Info, BookOpen, Users, Scroll, Calendar, Link, Eye, EyeOff } from 'lucide-react';

// Types
interface Institution {
  id: string;
  name: string;
  type: 'library' | 'philosophy' | 'rhetoric' | 'medical';
  coordinates: [number, number];
  founded: number;
  destroyed?: number;
  importance: 1 | 2 | 3 | 4 | 5;
  scholars: string[];
  texts: string[];
  evidence: {
    type: string;
    reliability: number;
    source: string;
  }[];
  description: string;
  connections: string[];
}

const INSTITUTION_COLORS = {
  library: '#3B82F6',
  philosophy: '#7C3AED',
  rhetoric: '#F59E0B',
  medical: '#059669'
};

const INSTITUTION_ICONS = {
  library: '📚',
  philosophy: '🏛️',
  rhetoric: '🗣️',
  medical: '⚕️'
};

const institutions: Institution[] = [
  {
    id: 'alexandria-library',
    name: 'Library of Alexandria',
    type: 'library',
    coordinates: [29.9, 31.2],
    founded: -295,
    destroyed: 640,
    importance: 5,
    scholars: ['Eratosthenes', 'Apollonius', 'Aristarchus', 'Callimachus', 'Theocritus'],
    texts: ['Pinakes', 'Conics', 'Argonautica', 'Hymns'],
    evidence: [
      { type: 'Literary', reliability: 75, source: 'Strabo 17.1.8' },
      { type: 'Archaeological', reliability: 95, source: 'Excavations 1990-2010' }
    ],
    description: 'The greatest library of the ancient world, containing over 400,000 scrolls',
    connections: ['pergamon-library', 'alexandria-museum', 'alexandria-catechetical']
  },
  {
    id: 'pergamon-library',
    name: 'Library of Pergamon',
    type: 'library',
    coordinates: [39.1, 27.2],
    founded: -197,
    destroyed: 50,
    importance: 4,
    scholars: ['Crates of Mallus', 'Apollodorus'],
    texts: ['Pergamon Chronicle', 'Stoic Commentaries'],
    evidence: [
      { type: 'Archaeological', reliability: 95, source: 'German excavations 1878-1886' },
      { type: 'Epigraphic', reliability: 90, source: 'OGIS 338' }
    ],
    description: 'Second greatest library, rival to Alexandria, containing 200,000 volumes',
    connections: ['alexandria-library', 'athens-academy']
  },
  {
    id: 'athens-academy',
    name: 'Academy of Athens',
    type: 'philosophy',
    coordinates: [37.97, 23.73],
    founded: -387,
    destroyed: 529,
    importance: 5,
    scholars: ['Plato', 'Speusippus', 'Xenocrates', 'Arcesilaus', 'Carneades'],
    texts: ['Republic', 'Laws', 'Timaeus', 'Academic Skeptic works'],
    evidence: [
      { type: 'Archaeological', reliability: 95, source: 'Excavations at Akadimia site' },
      { type: 'Literary', reliability: 75, source: 'Diogenes Laertius 3.7' }
    ],
    description: 'Founded by Plato, the first institution of higher learning in the Western world',
    connections: ['athens-lyceum', 'alexandria-museum', 'nisibis-school']
  },
  {
    id: 'athens-lyceum',
    name: 'Lyceum',
    type: 'philosophy',
    coordinates: [37.975, 23.74],
    founded: -335,
    destroyed: 200,
    importance: 5,
    scholars: ['Aristotle', 'Theophrastus', 'Strato', 'Lyco'],
    texts: ['Physics', 'Metaphysics', 'History of Plants', 'Characters'],
    evidence: [
      { type: 'Archaeological', reliability: 95, source: 'Excavations 1996-2014' },
      { type: 'Literary', reliability: 75, source: 'Diogenes Laertius 5.2' }
    ],
    description: 'Aristotelian school focusing on empirical research and systematic knowledge',
    connections: ['athens-academy', 'alexandria-museum', 'pergamon-library']
  },
  {
    id: 'athens-stoa',
    name: 'Stoa Poikile',
    type: 'philosophy',
    coordinates: [37.975, 23.725],
    founded: -300,
    destroyed: 267,
    importance: 4,
    scholars: ['Zeno of Citium', 'Cleanthes', 'Chrysippus', 'Epictetus'],
    texts: ['Stoic Physics', 'Ethics', 'Discourses'],
    evidence: [
      { type: 'Archaeological', reliability: 95, source: 'Agora excavations' },
      { type: 'Literary', reliability: 75, source: 'Diogenes Laertius 7.5' }
    ],
    description: 'Birthplace of Stoicism, teaching ethics and natural philosophy',
    connections: ['athens-academy', 'athens-lyceum', 'rhodes-school']
  },
  {
    id: 'alexandria-museum',
    name: 'Museum of Alexandria',
    type: 'philosophy',
    coordinates: [29.92, 31.2],
    founded: -290,
    destroyed: 640,
    importance: 5,
    scholars: ['Euclid', 'Archimedes', 'Hipparchus', 'Ptolemy'],
    texts: ['Elements', 'Almagest', 'Geography'],
    evidence: [
      { type: 'Literary', reliability: 75, source: 'Strabo 17.1.8' },
      { type: 'Archaeological', reliability: 95, source: 'Recent excavations' }
    ],
    description: 'Research institution attached to the Library, center of Hellenistic science',
    connections: ['alexandria-library', 'athens-lyceum', 'pergamon-library']
  },
  {
    id: 'nisibis-school',
    name: 'School of Nisibis',
    type: 'philosophy',
    coordinates: [37.08, 41.22],
    founded: 350,
    destroyed: 1400,
    importance: 3,
    scholars: ['Narsai', 'Abraham of Kashkar', 'Henana'],
    texts: ['Syriac theological works', 'Aristotelian commentaries'],
    evidence: [
      { type: 'Literary', reliability: 75, source: 'Chronicle of Seert' },
      { type: 'Manuscript', reliability: 70, source: 'Syriac manuscripts' }
    ],
    description: 'Premier center of Syriac Christian learning and Aristotelian studies',
    connections: ['athens-academy', 'alexandria-catechetical', 'baghdad-house']
  },
  {
    id: 'alexandria-catechetical',
    name: 'Catechetical School of Alexandria',
    type: 'philosophy',
    coordinates: [29.88, 31.2],
    founded: 190,
    destroyed: 640,
    importance: 4,
    scholars: ['Clement', 'Origen', 'Dionysius', 'Athanasius'],
    texts: ['Paedagogus', 'Hexapla', 'On First Principles'],
    evidence: [
      { type: 'Literary', reliability: 75, source: 'Eusebius HE 5.10' },
      { type: 'Manuscript', reliability: 70, source: 'Patristic manuscripts' }
    ],
    description: 'Leading center of Christian theology and biblical scholarship',
    connections: ['alexandria-library', 'nisibis-school', 'caesarea-library']
  },
  {
    id: 'rhodes-school',
    name: 'School of Rhodes',
    type: 'rhetoric',
    coordinates: [36.43, 28.22],
    founded: -150,
    destroyed: 300,
    importance: 3,
    scholars: ['Apollonius Molon', 'Dionysios Thrax'],
    texts: ['Rhetorical handbooks', 'Grammar treatises'],
    evidence: [
      { type: 'Literary', reliability: 75, source: 'Cicero Brutus 316' },
      { type: 'Epigraphic', reliability: 90, source: 'Rhodes inscriptions' }
    ],
    description: 'Famous rhetoric school where Cicero and Caesar studied',
    connections: ['athens-stoa', 'pergamon-library']
  },
  {
    id: 'cos-medical',
    name: 'Medical School of Cos',
    type: 'medical',
    coordinates: [36.89, 27.29],
    founded: -460,
    destroyed: 200,
    importance: 4,
    scholars: ['Hippocrates', 'Diocles', 'Praxagoras'],
    texts: ['Hippocratic Corpus', 'On Diseases', 'Prognostic'],
    evidence: [
      { type: 'Archaeological', reliability: 95, source: 'Asclepieion excavations' },
      { type: 'Literary', reliability: 75, source: 'Plato Phaedrus 270c' }
    ],
    description: 'Birthplace of scientific medicine and the Hippocratic tradition',
    connections: ['cnidus-medical', 'alexandria-museum']
  }
];

const LibrariesAndSchools: React.FC = () => {
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [timelineYear, setTimelineYear] = useState(-400);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [hoveredInstitution, setHoveredInstitution] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert coordinates to SVG coordinates
  const coordToSVG = (lat: number, lon: number): [number, number] => {
    const x = ((lon + 10) / 65) * 800 + 50;
    const y = ((55 - lat) / 25) * 500 + 50;
    return [x, y];
  };

  // Filter institutions based on timeline and filters
  const filteredInstitutions = institutions.filter(inst => {
    const existsInYear = inst.founded <= timelineYear && (!inst.destroyed || inst.destroyed >= timelineYear);
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.scholars.some(scholar => scholar.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !selectedType || inst.type === selectedType;
    
    return existsInYear && matchesSearch && matchesType;
  });

  // Get connections for display
  const getConnectionLines = () => {
    if (!showConnections) return [];
    
    const lines: Array<{from: [number, number], to: [number, number], active: boolean}> = [];
    
    filteredInstitutions.forEach(inst => {
      inst.connections.forEach(connId => {
        const connectedInst = institutions.find(i => i.id === connId);
        if (connectedInst && filteredInstitutions.find(fi => fi.id === connId)) {
          const fromCoords = coordToSVG(inst.coordinates[0], inst.coordinates[1]);
          const toCoords = coordToSVG(connectedInst.coordinates[0], connectedInst.coordinates[1]);
          const isActive = hoveredInstitution === inst.id || hoveredInstitution === connId;
          lines.push({ from: fromCoords, to: toCoords, active: isActive });
        }
      });
    });
    
    return lines;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="bg-[#1E1E24] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#C9A227] mb-1">
                Libraries & Schools of Antiquity
              </h1>
              <p className="text-gray-400">
                Interactive map of ancient centers of learning and scholarship
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search institutions or scholars..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0D0D0F] border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-[#C9A227]"
                />
              </div>
              <button
                onClick={() => setShowConnections(!showConnections)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showConnections 
                    ? 'bg-[#C9A227] text-black' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Connections
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Map Section */}
          <div className="col-span-8">
            <div className="bg-[#1E1E24] rounded-lg border border-gray-700 p-6">
              {/* Timeline Controls */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Year: {timelineYear < 0 ? `${Math.abs(timelineYear)} BCE` : `${timelineYear} CE`}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTimelineYear(Math.max(-800, timelineYear - 50))}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTimelineYear(Math.min(1400, timelineYear + 50))}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="-800"
                  max="1400"
                  step="25"
                  value={timelineYear}
                  onChange={(e) => setTimelineYear(parseInt(e.target.value))}
                  className="w-full accent-[#C9A227]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>800 BCE</span>
                  <span>0</span>
                  <span>1400 CE</span>
                </div>
              </div>

              {/* Map */}
              <div className="relative">
                <svg
                  ref={svgRef}
                  viewBox="0 0 900 600"
                  className="w-full h-96 bg-[#0D0D0F] rounded-lg border border-gray-600"
                >
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#374151" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Mediterranean outline */}
                  <path
                    d="M 100 200 Q 200 180 300 200 Q 400 190 500 200 Q 600 210 700 220 L 750 250 L 720 300 Q 650 320 550 310 Q 450 300 350 290 Q 250 280 150 270 Z"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  
                  {/* Connection lines */}
                  {getConnectionLines().map((line, index) => (
                    <line
                      key={index}
                      x1={line.from[0]}
                      y1={line.from[1]}
                      x2={line.to[0]}
                      y2={line.to[1]}
                      stroke={line.active ? "#C9A227" : "#6B7280"}
                      strokeWidth={line.active ? "3" : "1"}
                      opacity={line.active ? "1" : "0.4"}
                      strokeDasharray="5,5"
                    />
                  ))}
                  
                  {/* Institution markers */}
                  {filteredInstitutions.map((inst) => {
                    const [x, y] = coordToSVG(inst.coordinates[0], inst.coordinates[1]);
                    const size = 8 + (inst.importance * 4);
                    const color = INSTITUTION_COLORS[inst.type];
                    const isSelected = selectedInstitution?.id === inst.id;
                    const isHovered = hoveredInstitution === inst.id;
                    
                    return (
                      <g key={inst.id}>
                        {/* Glow effect for selected/hovered */}
                        {(isSelected || isHovered) && (
                          <circle
                            cx={x}
                            cy={y}
                            r={size + 8}
                            fill={color}
                            opacity="0.3"
                          />
                        )}
                        
                        {/* Main marker */}
                        <circle
                          cx={x}
                          cy={y}
                          r={size}
                          fill={color}
                          stroke={isSelected ? "#C9A227" : "#F5F4F2"}
                          strokeWidth={isSelected ? "3" : "2"}
                          className="cursor-pointer transition-all hover:opacity-80"
                          onClick={() => setSelectedInstitution(inst)}
                          onMouseEnter={() => setHoveredInstitution(inst.id)}
                          onMouseLeave={() => setHoveredInstitution(null)}
                        />
                        
                        {/* Icon */}
                        <text
                          x={x}
                          y={y + 4}
                          textAnchor="middle"
                          className="text-xs pointer-events-none"
                          fill="white"
                        >
                          {INSTITUTION_ICONS[inst.type]}
                        </text>
                        
                        {/* Label */}
                        <text
                          x={x}
                          y={y + size + 16}
                          textAnchor="middle"
                          className="text-xs font-medium fill-current"
                          fill={isSelected || isHovered ? "#C9A227" : "#F5F4F2"}
                        >
                          {inst.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4">
                {Object.entries(INSTITUTION_COLORS).map(([type, color]) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(selectedType === type ? null : type)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      selectedType === type 
                        ? 'bg-[#C9A227] text-black' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-xs opacity-75">
                      ({institutions.filter(i => i.type === type).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="col-span-4">
            {selectedInstitution ? (
              <div className="bg-[#1E1E24] rounded-lg border border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#C9A227] mb-1">
                      {selectedInstitution.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: INSTITUTION_COLORS[selectedInstitution.type] }}
                      />
                      <span className="capitalize">{selectedInstitution.type}</span>
                      <span>•</span>
                      <div className="flex">
                        {[...Array(selectedInstitution.importance)].map((_, i) => (
                          <span key={i} className="text-[#C9A227]">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedInstitution(null)}
                    className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>

                <p className="text-gray-300 mb-4">{selectedInstitution.description}</p>

                {/* Timeline */}
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 font-semibold mb-2">
                    <Calendar className="w-4 h-4 text-[#C9A227]" />
                    Timeline
                  </h4>
                  <div className="bg-[#0D0D0F] rounded p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-400">Founded:</span>
                      <span>{selectedInstitution.founded < 0 ? `${Math.abs(selectedInstitution.founded)} BCE` : `${selectedInstitution.founded} CE`}</span>
                    </div>
                    {selectedInstitution.destroyed && (
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="text-red-400">Destroyed:</span>
                        <span>{selectedInstitution.destroyed < 0 ? `${Math.abs(selectedInstitution.destroyed)} BCE` : `${selectedInstitution.destroyed} CE`}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notable Scholars */}
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 font-semibold mb-2">
                    <Users className="w-4 h-4 text-[#C9A227]" />
                    Notable Scholars
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstitution.scholars.map((scholar, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-[#0D0D0F] rounded text-sm hover:bg-gray-600 cursor-pointer transition-colors"
                      >
                        {scholar}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Important Texts */}
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 font-semibold mb-2">
                    <BookOpen className="w-4 h-4 text-[#C9A227]" />
                    Important Texts
                  </h4>
                  <div className="space-y-1">
                    {selectedInstitution.texts.map((text, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        • {text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Sources */}
                <div className="mb-4">
                  <h4 className="flex items-center gap-2 font-semibold mb-2">
                    <Scroll className="w-4 h-4 text-[#C9A227]" />
                    Evidence Sources
                  </h4>
                  <div className="space-y-2">
                    {selectedInstitution.evidence.map((evidence, index) => (
                      <div key={index} className="bg-[#0D0D0F] rounded p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{evidence.type}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            evidence.reliability >= 90 ? 'bg-green-600' :
                            evidence.reliability >= 80 ? 'bg-yellow-600' :
                            'bg-orange-600'
                          }`}>
                            {evidence.reliability}%
                          </span>
                        </div>
                        <div className="text-gray-400">{evidence.source}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connections */}
                {selectedInstitution.connections.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-2">
                      <Link className="w-4 h-4 text-[#C9A227]" />
                      Connected Institutions
                    </h4>
                    <div className="space-y-1">
                      {selectedInstitution.connections.map((connId, index) => {
                        const connectedInst = institutions.find(i => i.id === connId);
                        return connectedInst ? (
                          <button
                            key={index}
                            onClick={() => setSelectedInstitution(connectedInst)}
                            className="text-sm text-blue-400 hover:text-blue-300 block transition-colors"
                          >
                            → {connectedInst.name}
                          </button>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#1E1E24] rounded-lg border border-gray-700 p-6">
                <div className="text-center text-gray-400">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select an Institution</h3>
                  <p className="text-sm">
                    Click on any marker on the map to explore detailed information about ancient libraries and schools.
                  </p>
                </div>

                {/* Summary Statistics */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <h4 className="font-semibold mb-3">Current View ({timelineYear < 0 ? `${Math.abs(timelineYear)} BCE` : `${timelineYear} CE`})</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Active Institutions:</span>
                      <span className="text-[#C9A227]">{filteredInstitutions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Libraries:</span>
                      <span>{filteredInstitutions.filter(i => i.type === 'library').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Philosophy Schools:</span>
                      <span>{filteredInstitutions.filter(i => i.type === 'philosophy').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rhetoric Schools:</span>
                      <span>{filteredInstitutions.filter(i => i.type === 'rhetoric').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Schools:</span>
                      <span>{filteredInstitutions.filter(i => i.type === 'medical').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrariesAndSchools;