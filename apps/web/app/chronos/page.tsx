import React, { useState } from 'react';
import { Search, TrendingUp, Users, BookOpen, BarChart3, GitCompare, Network, ChevronDown, ChevronUp } from 'lucide-react';

const ChronosEngine = () => {
  const [selectedConcept, setSelectedConcept] = useState('ἀρετή');
  const [compareMode, setCompareMode] = useState(false);
  const [compareConcept, setCompareConcept] = useState('');
  const [expandedEra, setExpandedEra] = useState('Classical');

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  const conceptData = {
    'ἀρετή': {
      'Archaic': {
        meaning: 'excellence in battle',
        confidence: 92,
        keyAuthors: ['Homer', 'Hesiod'],
        passages: ['Il. 1.266', 'Od. 4.728'],
        definition: 'Physical prowess and martial excellence, especially in heroic combat'
      },
      'Classical': {
        meaning: 'moral virtue',
        confidence: 95,
        keyAuthors: ['Plato', 'Aristotle', 'Xenophon'],
        passages: ['Rep. 427e', 'EN 1106a15', 'Mem. 1.5.4'],
        definition: 'Excellence of character; the disposition to act morally and justly'
      },
      'Hellenistic': {
        meaning: 'philosophical excellence',
        confidence: 88,
        keyAuthors: ['Epictetus', 'Marcus Aurelius', 'Diogenes Laërtius'],
        passages: ['Diss. 2.16.1', 'Med. 6.47', 'DL 7.89'],
        definition: 'Wisdom and rational excellence according to philosophical schools'
      },
      'Imperial': {
        meaning: 'civic virtue',
        confidence: 85,
        keyAuthors: ['Plutarch', 'Dio Chrysostom', 'Aelius Aristides'],
        passages: ['Mor. 825c', 'Or. 1.14', 'Or. 26.76'],
        definition: 'Public excellence in service to the state and community'
      },
      'Late Antique': {
        meaning: 'Christian virtue',
        confidence: 90,
        keyAuthors: ['John Chrysostom', 'Gregory Nazianzen', 'Basil'],
        passages: ['Hom. Mt. 15.7', 'Or. 14.6', 'Ep. 22.2'],
        definition: 'Spiritual excellence aligned with Christian moral teachings'
      },
      'Byzantine': {
        meaning: 'theological excellence',
        confidence: 87,
        keyAuthors: ['Photius', 'Michael Psellus', 'Anna Komnenos'],
        passages: ['Bibl. 109', 'Phil. Min. 1.36', 'Alex. 15.11.4'],
        definition: 'Divine excellence reflected in human moral and spiritual perfection'
      }
    }
  };

  const semanticNeighbors = [
    { term: 'σωφροσύνη', relation: 'temperance', similarity: 0.89 },
    { term: 'δικαιοσύνη', relation: 'justice', similarity: 0.85 },
    { term: 'ἀνδρεία', relation: 'courage', similarity: 0.82 },
    { term: 'φρόνησις', relation: 'prudence', similarity: 0.78 }
  ];

  const reliabilityScores = {
    'Literary': 94,
    'Epigraphic': 87,
    'Archaeological': 76,
    'Numismatic': 82
  };

  const SearchBar = () => (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Enter Greek or Latin concept (e.g., ἀρετή, virtus, logos)"
        className="w-full pl-12 pr-4 py-4 bg-[#1E1E24] border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-[#C9A227] focus:outline-none text-lg"
        value={selectedConcept}
        onChange={(e) => setSelectedConcept(e.target.value)}
      />
      <button className="absolute right-4 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#C9A227] text-black rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
        Analyze
      </button>
    </div>
  );

  const TimelineView = () => (
    <div className="bg-[#1E1E24] rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-[#C9A227]" />
        Semantic Evolution: {selectedConcept}
      </h3>
      
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-600"></div>
        
        {Object.entries(conceptData[selectedConcept] || {}).map(([era, data], index) => (
          <div key={era} className="relative flex items-start mb-8">
            <div 
              className="w-4 h-4 rounded-full border-4 border-[#0D0D0F] z-10"
              style={{ backgroundColor: eraColors[era] }}
            ></div>
            
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-white">{era} ({getEraDateRange(era)})</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">Confidence: {data.confidence}%</span>
                  <button
                    onClick={() => setExpandedEra(expandedEra === era ? null : era)}
                    className="text-[#C9A227] hover:text-[#B8941F]"
                  >
                    {expandedEra === era ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="bg-[#0D0D0F] rounded-lg p-4">
                <p className="text-white font-semibold mb-2">"{data.meaning}"</p>
                <p className="text-gray-300 text-sm mb-3">{data.definition}</p>
                
                {expandedEra === era && (
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-semibold text-[#C9A227] mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Key Authors
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {data.keyAuthors.map(author => (
                            <span key={author} className="px-2 py-1 bg-[#1E1E24] text-gray-300 rounded text-sm">
                              {author}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-[#C9A227] mb-2 flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Example Passages
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {data.passages.map(passage => (
                            <span key={passage} className="px-2 py-1 bg-[#1E1E24] text-gray-300 rounded text-sm font-mono">
                              {passage}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SemanticChart = () => (
    <div className="bg-[#1E1E24] rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-[#C9A227]" />
        Semantic Drift Analysis
      </h3>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {Object.entries(conceptData[selectedConcept] || {}).map(([era, data]) => (
          <div key={era} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full rounded-t-lg relative"
              style={{ 
                height: `${data.confidence * 2.4}px`,
                backgroundColor: eraColors[era]
              }}
            >
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold">
                {data.confidence}%
              </span>
            </div>
            <span className="text-gray-400 text-xs mt-2 text-center leading-tight">
              {era}
            </span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <div className="text-sm text-gray-400">
          Higher bars indicate greater confidence in semantic analysis
        </div>
      </div>
    </div>
  );

  const EvidenceSources = () => (
    <div className="bg-[#1E1E24] rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6">Evidence Sources & Reliability</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(reliabilityScores).map(([type, score]) => (
          <div key={type} className="bg-[#0D0D0F] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">{getEvidenceIcon(type)} {type}</span>
              <span className="text-[#C9A227] font-bold">{score}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-[#C9A227]" 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SemanticNeighbors = () => (
    <div className="bg-[#1E1E24] rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <Network className="w-5 h-5 mr-2 text-[#C9A227]" />
        Semantic Neighbors
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {semanticNeighbors.map(neighbor => (
          <div key={neighbor.term} className="bg-[#0D0D0F] rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="text-white font-semibold text-lg">{neighbor.term}</span>
              <p className="text-gray-400 text-sm">{neighbor.relation}</p>
            </div>
            <div className="text-right">
              <div className="text-[#C9A227] font-bold">{(neighbor.similarity * 100).toFixed(0)}%</div>
              <div className="text-gray-400 text-xs">similarity</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const CompareToggle = () => (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-white">CHRONOS ENGINE</h2>
      <button
        onClick={() => setCompareMode(!compareMode)}
        className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
          compareMode 
            ? 'bg-[#C9A227] text-black' 
            : 'bg-[#1E1E24] text-white border border-gray-700'
        }`}
      >
        <GitCompare className="w-4 h-4 mr-2" />
        Compare Mode
      </button>
    </div>
  );

  function getEraDateRange(era) {
    const ranges = {
      'Archaic': '800-500 BCE',
      'Classical': '500-323 BCE',
      'Hellenistic': '323-31 BCE',
      'Imperial': '31 BCE-284 CE',
      'Late Antique': '284-600 CE',
      'Byzantine': '600-1453 CE'
    };
    return ranges[era] || '';
  }

  function getEvidenceIcon(type) {
    const icons = {
      'Literary': '📜',
      'Epigraphic': '🪨',
      'Archaeological': '🏛️',
      'Numismatic': '🪙'
    };
    return icons[type] || '';
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      <div className="container mx-auto px-6 py-12">
        <CompareToggle />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Track Concept Evolution Across 
            <span className="text-[#C9A227]"> 1,500 Years</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl">
            Discover how Greek and Latin concepts transformed across six major historical eras. 
            Watch meanings shift, evolve, and adapt through the centuries of classical antiquity.
          </p>
        </div>

        <SearchBar />

        {compareMode && (
          <div className="mb-8 p-4 bg-[#1E1E24] border border-[#C9A227] rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">Compare with second concept:</h3>
            <input
              type="text"
              placeholder="Enter second concept to compare..."
              className="w-full px-4 py-3 bg-[#0D0D0F] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#C9A227] focus:outline-none"
              value={compareConcept}
              onChange={(e) => setCompareConcept(e.target.value)}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TimelineView />
            <SemanticChart />
          </div>
          
          <div>
            <SemanticNeighbors />
            <EvidenceSources />
          </div>
        </div>

        <div className="mt-12 bg-[#1E1E24] rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Powered by Advanced NLP</h3>
          <p className="text-gray-300 mb-6">
            CHRONOS ENGINE analyzes <span className="text-[#C9A227] font-semibold">892,000 semantic embeddings</span> 
            across our corpus of <span className="text-[#C9A227] font-semibold">1.7+ million passages</span> 
            to track conceptual evolution with unprecedented precision.
          </p>
          <button className="px-8 py-3 bg-[#C9A227] text-black rounded-lg font-semibold hover:bg-[#B8941F] transition-colors">
            Explore More Concepts
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChronosEngine;