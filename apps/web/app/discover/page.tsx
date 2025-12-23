'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Filter, TrendingUp, BookOpen, Target, Zap } from 'lucide-react';

const DISCOVERIES = [
  {
    id: 1,
    title: "Homer's Wine-Dark Sea in Christian Hymns",
    type: "Pattern",
    confidence: 87,
    novelty: 92,
    description: "οἶνοψ πόντος appears 17 times in Homer but also in 4th century Christian hymns.",
    evidence: ["Homer Od. 5.349", "Ephrem Hymn 3.4"],
  },
  {
    id: 2,
    title: "Stoic Vocabulary in Paul's Letters",
    type: "Influence",
    confidence: 94,
    novelty: 76,
    description: "23 technical Stoic terms cluster in Romans 7-8.",
    evidence: ["Rom 7:23", "Epictetus 1.1"],
  },
  {
    id: 3,
    title: "Virgil's Hidden Ennius Debt",
    type: "Intertextuality",
    confidence: 82,
    novelty: 88,
    description: "47 unidentified structural parallels between Aeneid and Annales.",
    evidence: ["Aen. 6.847", "Ennius fr. 500"],
  },
  {
    id: 4,
    title: "θεραπεία Semantic Reversal",
    type: "Semantic",
    confidence: 91,
    novelty: 85,
    description: "From 'service to gods' to 'medical treatment' to 'spiritual healing'.",
    evidence: ["Hdt. 2.37", "Hp. Morb. 1", "Matt 4:23"],
  },
];

const TYPE_COLORS = {
  Pattern: '#3B82F6',
  Influence: '#059669',
  Intertextuality: '#7C3AED',
  Semantic: '#F59E0B',
  Linguistic: '#DC2626',
  Historical: '#D97706',
};

const TYPE_ICONS = {
  Pattern: Target,
  Influence: TrendingUp,
  Intertextuality: BookOpen,
  Semantic: Sparkles,
  Linguistic: Zap,
  Historical: BookOpen,
};

export default function DiscoveryEngine() {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'confidence' | 'novelty'>('confidence');

  const types = ['All', ...Array.from(new Set(DISCOVERIES.map(d => d.type)))];

  const filteredDiscoveries = useMemo(() => {
    let filtered = selectedType === 'All' 
      ? DISCOVERIES 
      : DISCOVERIES.filter(d => d.type === selectedType);
    
    return filtered.sort((a, b) => b[sortBy] - a[sortBy]);
  }, [selectedType, sortBy]);

  const ConfidenceMeter = ({ value }: { value: number }) => (
    <div className="w-full bg-[#1E1E24] rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-300"
        style={{ 
          width: `${value}%`,
          backgroundColor: value >= 90 ? '#059669' : value >= 80 ? '#F59E0B' : '#DC2626'
        }}
      />
    </div>
  );

  const DiscoveryCard = ({ discovery }: { discovery: typeof DISCOVERIES[0] }) => {
    const IconComponent = TYPE_ICONS[discovery.type as keyof typeof TYPE_ICONS];
    
    return (
      <div className="bg-[#1E1E24] border border-[#2A2A32] rounded-lg p-6 hover:border-[#C9A227] transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${TYPE_COLORS[discovery.type as keyof typeof TYPE_COLORS]}20` }}
            >
              {IconComponent && (
                <IconComponent 
                  size={20} 
                  style={{ color: TYPE_COLORS[discovery.type as keyof typeof TYPE_COLORS] }}
                />
              )}
            </div>
            <div>
              <span 
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${TYPE_COLORS[discovery.type as keyof typeof TYPE_COLORS]}20`,
                  color: TYPE_COLORS[discovery.type as keyof typeof TYPE_COLORS]
                }}
              >
                {discovery.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-[#F5F4F2]/60">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>{discovery.novelty}%</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-[#F5F4F2] mb-3">
          {discovery.title}
        </h3>
        
        <p className="text-[#F5F4F2]/70 mb-4 line-clamp-2">
          {discovery.description}
        </p>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-[#F5F4F2]/60">Confidence</span>
              <span className="text-sm font-medium text-[#F5F4F2]">{discovery.confidence}%</span>
            </div>
            <ConfidenceMeter value={discovery.confidence} />
          </div>

          <div>
            <span className="text-sm text-[#F5F4F2]/60 block mb-2">Key Evidence</span>
            <div className="flex flex-wrap gap-2">
              {discovery.evidence.map((cite, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-1 bg-[#0D0D0F] text-[#C9A227] text-xs rounded border border-[#C9A227]/20"
                >
                  {cite}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-[#C9A227]" size={32} />
            <h1 className="text-4xl font-bold text-[#F5F4F2]">
              AI Discovery Engine
            </h1>
          </div>
          <p className="text-xl text-[#F5F4F2]/70 max-w-3xl mx-auto">
            Uncovering hidden connections, patterns, and influences across classical literature with artificial intelligence
          </p>
        </div>

        {/* Filters */}
        <div className="bg-[#1E1E24] rounded-lg p-6 mb-8 border border-[#2A2A32]">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-[#C9A227]" />
              <span className="font-medium">Filter by Type:</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-[#C9A227] text-[#0D0D0F]'
                      : 'bg-[#0D0D0F] text-[#F5F4F2]/70 hover:text-[#F5F4F2] hover:bg-[#2A2A32]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-[#F5F4F2]/60">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'confidence' | 'novelty')}
                className="bg-[#0D0D0F] border border-[#2A2A32] rounded px-3 py-1 text-[#F5F4F2]"
              >
                <option value="confidence">Confidence</option>
                <option value="novelty">Novelty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1E1E24] rounded-lg p-6 border border-[#2A2A32]">
            <div className="text-2xl font-bold text-[#C9A227] mb-1">{filteredDiscoveries.length}</div>
            <div className="text-[#F5F4F2]/60">Discoveries</div>
          </div>
          <div className="bg-[#1E1E24] rounded-lg p-6 border border-[#2A2A32]">
            <div className="text-2xl font-bold text-[#C9A227] mb-1">
              {Math.round(filteredDiscoveries.reduce((acc, d) => acc + d.confidence, 0) / filteredDiscoveries.length)}%
            </div>
            <div className="text-[#F5F4F2]/60">Avg Confidence</div>
          </div>
          <div className="bg-[#1E1E24] rounded-lg p-6 border border-[#2A2A32]">
            <div className="text-2xl font-bold text-[#C9A227] mb-1">
              {Math.round(filteredDiscoveries.reduce((acc, d) => acc + d.novelty, 0) / filteredDiscoveries.length)}%
            </div>
            <div className="text-[#F5F4F2]/60">Avg Novelty</div>
          </div>
          <div className="bg-[#1E1E24] rounded-lg p-6 border border-[#2A2A32]">
            <div className="text-2xl font-bold text-[#C9A227] mb-1">
              {new Set(filteredDiscoveries.map(d => d.type)).size}
            </div>
            <div className="text-[#F5F4F2]/60">Categories</div>
          </div>
        </div>

        {/* Discoveries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDiscoveries.map((discovery) => (
            <DiscoveryCard key={discovery.id} discovery={discovery} />
          ))}
        </div>

        {filteredDiscoveries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#F5F4F2]/40 text-lg">No discoveries found for the selected filters</div>
          </div>
        )}
      </div>
    </div>
  );
}