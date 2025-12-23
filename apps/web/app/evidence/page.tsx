import React, { useState, useRef } from 'react';
import { Search, Filter, Map, Clock, Network, AlertTriangle, CheckCircle, BookOpen, Mountain, Building, Coins, Globe, Calendar, Users, ArrowRight, Eye, Link, TrendingUp, Layers, Database, Target } from 'lucide-react';

const EvidenceExplorer = () => {
  const [selectedEvidence, setSelectedEvidence] = useState('literary');
  const [reliabilityThreshold, setReliabilityThreshold] = useState(75);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSource, setSelectedSource] = useState(null);
  const [timelineView, setTimelineView] = useState('discovery');

  const evidenceTypes = [
    { id: 'literary', label: 'Literary', icon: '📜', color: '#3B82F6', count: 458723 },
    { id: 'epigraphic', label: 'Epigraphic', icon: '🪨', color: '#10B981', count: 127834 },
    { id: 'archaeological', label: 'Archaeological', icon: '🏛️', color: '#8B5CF6', count: 89245 },
    { id: 'numismatic', label: 'Numismatic', icon: '🪙', color: '#EF4444', count: 34567 },
    { id: 'papyrological', label: 'Papyrological', icon: '📄', color: '#F59E0B', count: 23891 },
    { id: 'iconographic', label: 'Iconographic', icon: '🎨', color: '#EC4899', count: 19234 }
  ];

  const evidenceSources = [
    {
      id: 1,
      title: "Caesar's Account of Gallic Wars",
      type: 'literary',
      reliability: 87,
      era: 'Imperial Rome',
      location: 'Gaul',
      discovered: '1st century CE',
      corroborations: 23,
      conflicts: 3,
      citations: 156
    },
    {
      id: 2,
      title: "Res Gestae Divi Augusti",
      type: 'epigraphic',
      reliability: 94,
      era: 'Imperial Rome',
      location: 'Ancyra',
      discovered: '1555 CE',
      corroborations: 41,
      conflicts: 1,
      citations: 203
    },
    {
      id: 3,
      title: "Villa of Papyri Scrolls",
      type: 'papyrological',
      reliability: 91,
      era: 'Imperial Rome',
      location: 'Herculaneum',
      discovered: '1750 CE',
      corroborations: 18,
      conflicts: 2,
      citations: 89
    }
  ];

  const citationChain = [
    { author: "Tacitus", work: "Annales", reliability: 89, cites: ["Pliny the Elder", "Acta Senatus"] },
    { author: "Pliny the Elder", work: "Naturalis Historia", reliability: 82, cites: ["Varro", "Contemporary witnesses"] },
    { author: "Suetonius", work: "De Vita Caesarum", reliability: 79, cites: ["Imperial archives", "Tacitus"] }
  ];

  const conflictingEvidence = [
    {
      claim: "Date of Caesar's crossing of Rubicon",
      sources: [
        { author: "Plutarch", date: "January 10, 49 BCE", reliability: 84 },
        { author: "Appian", date: "January 12, 49 BCE", reliability: 78 },
        { author: "Dio Cassius", date: "Early January 49 BCE", reliability: 81 }
      ]
    }
  ];

  const ReliabilityMeter = ({ score, size = 'sm' }) => {
    const getColor = (score) => {
      if (score >= 90) return '#10B981';
      if (score >= 80) return '#F59E0B';
      if (score >= 70) return '#EF4444';
      return '#6B7280';
    };

    return (
      <div className={`flex items-center space-x-2 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        <div className={`w-${size === 'lg' ? '20' : '16'} bg-gray-700 rounded-full h-2`}>
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${score}%`, 
              backgroundColor: getColor(score)
            }}
          />
        </div>
        <span className="text-gray-300 font-medium">{score}%</span>
      </div>
    );
  };

  const CorroborationNetwork = () => (
    <div className="bg-[#1E1E24] rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
        <Network className="mr-2" />
        Corroboration Network
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {citationChain.map((source, index) => (
          <div key={index} className="text-center">
            <div 
              className="w-16 h-16 rounded-full border-4 mx-auto mb-2 flex items-center justify-center text-white font-bold"
              style={{ 
                borderColor: source.reliability >= 85 ? '#10B981' : source.reliability >= 75 ? '#F59E0B' : '#EF4444'
              }}
            >
              {source.reliability}
            </div>
            <div className="text-sm text-[#F5F4F2] font-medium">{source.author}</div>
            <div className="text-xs text-gray-400">{source.work}</div>
            {index < citationChain.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-500 mx-auto mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const EvidenceMap = () => (
    <div className="bg-[#1E1E24] rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
        <Map className="mr-2" />
        Evidence Discovery Locations
      </h3>
      <div className="h-64 bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
        <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-[#3B82F6] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#8B5CF6] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Interactive map showing {evidenceSources.length} discovery sites
        </div>
      </div>
    </div>
  );

  const ConflictAnalysis = () => (
    <div className="bg-[#1E1E24] rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
        <AlertTriangle className="mr-2 text-yellow-500" />
        Conflicting Evidence Analysis
      </h3>
      {conflictingEvidence.map((conflict, index) => (
        <div key={index} className="border border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-[#F5F4F2] mb-3">{conflict.claim}</h4>
          <div className="space-y-2">
            {conflict.sources.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <div>
                  <span className="font-medium text-[#F5F4F2]">{source.author}</span>
                  <span className="text-gray-400 ml-2">{source.date}</span>
                </div>
                <ReliabilityMeter score={source.reliability} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#1E1E24]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F4F2] flex items-center">
                <Target className="mr-3 text-[#C9A227]" />
                Evidence Explorer
              </h1>
              <p className="text-gray-400 mt-1">Comprehensive evidence tracking & verification system</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <span className="text-[#C9A227] font-bold">1.7M+</span> passages analyzed
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-[#C9A227] font-bold">500K+</span> connections mapped
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Evidence Type Filters */}
          <div className="bg-[#1E1E24] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#F5F4F2] mb-4 flex items-center">
              <Filter className="mr-2" />
              Evidence Types
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {evidenceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedEvidence(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedEvidence === type.id 
                      ? 'border-[#C9A227] bg-[#C9A227]/10' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-[#F5F4F2]">{type.label}</div>
                  <div className="text-sm text-gray-400">{type.count.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reliability Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#F5F4F2] mb-4 flex items-center">
                <TrendingUp className="mr-2" />
                Reliability Threshold
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reliabilityThreshold}
                  onChange={(e) => setReliabilityThreshold(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>0%</span>
                  <span className="text-[#C9A227] font-bold">{reliabilityThreshold}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#F5F4F2] mb-4 flex items-center">
                <Calendar className="mr-2" />
                Timeline View
              </h3>
              <select 
                value={timelineView}
                onChange={(e) => setTimelineView(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-[#F5F4F2]"
              >
                <option value="discovery">Discovery Date</option>
                <option value="composition">Composition Date</option>
                <option value="events">Historical Events</option>
              </select>
            </div>

            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#F5F4F2] mb-4 flex items-center">
                <Eye className="mr-2" />
                View Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-[#C9A227] text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-lg ${
                    viewMode === 'timeline' ? 'bg-[#C9A227] text-black' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Evidence Sources */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
                <Database className="mr-2" />
                Evidence Sources
              </h3>
              <div className="space-y-4">
                {evidenceSources
                  .filter(source => source.reliability >= reliabilityThreshold)
                  .map((source) => (
                  <div 
                    key={source.id} 
                    className="border border-gray-700 rounded-lg p-4 hover:border-[#C9A227] transition-colors cursor-pointer"
                    onClick={() => setSelectedSource(source)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[#F5F4F2]">{source.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center">
                            {evidenceTypes.find(t => t.id === source.type)?.icon}
                            <span className="ml-1">{source.type}</span>
                          </span>
                          <span>{source.era}</span>
                          <span>{source.location}</span>
                        </div>
                      </div>
                      <ReliabilityMeter score={source.reliability} />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-green-900/20 rounded">
                        <div className="text-green-400 font-bold">{source.corroborations}</div>
                        <div className="text-gray-400">Corroborations</div>
                      </div>
                      <div className="text-center p-2 bg-red-900/20 rounded">
                        <div className="text-red-400 font-bold">{source.conflicts}</div>
                        <div className="text-gray-400">Conflicts</div>
                      </div>
                      <div className="text-center p-2 bg-blue-900/20 rounded">
                        <div className="text-blue-400 font-bold">{source.citations}</div>
                        <div className="text-gray-400">Citations</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <EvidenceMap />
            <ConflictAnalysis />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reliability Calculator */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
                <CheckCircle className="mr-2 text-green-500" />
                Reliability Calculator
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#C9A227] mb-2">87%</div>
                  <div className="text-sm text-gray-400">Overall Reliability</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Source Quality</span>
                    <span className="text-[#F5F4F2]">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cross-references</span>
                    <span className="text-[#F5F4F2]">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Archaeological Support</span>
                    <span className="text-[#F5F4F2]">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Modern Consensus</span>
                    <span className="text-[#F5F4F2]">94%</span>
                  </div>
                </div>
              </div>
            </div>

            <CorroborationNetwork />

            {/* Citation Chain */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#F5F4F2] mb-4 flex items-center">
                <Link className="mr-2" />
                Citation Chain
              </h3>
              <div className="space-y-3">
                {citationChain.map((link, index) => (
                  <div key={index} className="border-l-4 border-[#C9A227] pl-4">
                    <div className="font-medium text-[#F5F4F2]">{link.author}</div>
                    <div className="text-sm text-gray-400">{link.work}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Cites: {link.cites.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceExplorer;