'use client';

import React, { useState, useEffect } from 'react';

interface FacetScore {
  facet: string;
  score: number;
  color: string;
}

interface FacetVisualizationProps {
  urn: string;
  scores?: { [key: string]: number };
  onFacetClick?: (facet: string) => void;
}

const FACET_COLORS: { [key: string]: string } = {
  history: '#8B4513',
  politics: '#DC143C',
  economics: '#FFD700',
  law: '#4B0082',
  warfare: '#B22222',
  religion: '#9370DB',
  philosophy: '#4169E1',
  social: '#FF69B4',
  geography: '#2E8B57',
  medicine: '#00CED1',
  astronomy: '#191970',
  rhetoric: '#FF8C00'
};

const FACET_LABELS: { [key: string]: string } = {
  history: 'History',
  politics: 'Politics',
  economics: 'Economics',
  law: 'Law',
  warfare: 'Warfare',
  religion: 'Religion',
  philosophy: 'Philosophy',
  social: 'Social',
  geography: 'Geography',
  medicine: 'Medicine',
  astronomy: 'Astronomy',
  rhetoric: 'Rhetoric'
};

export default function FacetVisualization({ urn, scores, onFacetClick }: FacetVisualizationProps) {
  const [facetData, setFacetData] = useState<FacetScore[]>([]);
  const [loading, setLoading] = useState(!scores);
  const [view, setView] = useState<'bar' | 'radar' | 'grid'>('bar');

  useEffect(() => {
    if (scores) {
      // Use provided scores
      const data = Object.entries(scores).map(([facet, score]) => ({
        facet,
        score,
        color: FACET_COLORS[facet] || '#666'
      })).sort((a, b) => b.score - a.score);
      setFacetData(data);
      setLoading(false);
    } else if (urn) {
      // Fetch scores from API
      fetch(`/api/lens?urn=${encodeURIComponent(urn)}`)
        .then(res => res.json())
        .then(data => {
          if (data.facet_scores) {
            const scoreData = Object.entries(data.facet_scores).map(([facet, score]) => ({
              facet,
              score: score as number,
              color: FACET_COLORS[facet] || '#666'
            })).sort((a, b) => b.score - a.score);
            setFacetData(scoreData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch facet scores:', err);
          setLoading(false);
        });
    }
  }, [urn, scores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (facetData.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No facet data available
      </div>
    );
  }

  const maxScore = Math.max(...facetData.map(f => Math.abs(f.score)));
  const topFacets = facetData.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Thematic Lens</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('bar')}
            className={`px-3 py-1 rounded ${view === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Bar
          </button>
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1 rounded ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('radar')}
            className={`px-3 py-1 rounded ${view === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Radar
          </button>
        </div>
      </div>

      {/* Top Facets Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Primary Themes</h3>
        <div className="flex gap-2 flex-wrap">
          {topFacets.map(f => (
            <span
              key={f.facet}
              className="px-3 py-1 rounded-full text-white font-medium cursor-pointer hover:opacity-80"
              style={{ backgroundColor: f.color }}
              onClick={() => onFacetClick && onFacetClick(f.facet)}
            >
              {FACET_LABELS[f.facet]} ({(f.score * 100).toFixed(1)}%)
            </span>
          ))}
        </div>
      </div>

      {/* Bar Chart View */}
      {view === 'bar' && (
        <div className="space-y-3">
          {facetData.map(f => (
            <div key={f.facet} className="group">
              <div className="flex items-center justify-between mb-1">
                <button
                  onClick={() => onFacetClick && onFacetClick(f.facet)}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {FACET_LABELS[f.facet]}
                </button>
                <span className="text-sm text-gray-600">
                  {(f.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out group-hover:opacity-80"
                  style={{
                    width: `${Math.abs(f.score) / maxScore * 100}%`,
                    backgroundColor: f.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-4">
          {facetData.map(f => (
            <button
              key={f.facet}
              onClick={() => onFacetClick && onFacetClick(f.facet)}
              className="p-4 rounded-lg border-2 hover:shadow-lg transition-all"
              style={{
                borderColor: f.color,
                backgroundColor: `${f.color}10`
              }}
            >
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: f.color }}>
                  {(f.score * 100).toFixed(0)}%
                </div>
                <div className="text-sm font-medium text-gray-700 mt-1">
                  {FACET_LABELS[f.facet]}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Radar Chart View (simplified SVG) */}
      {view === 'radar' && (
        <div className="flex justify-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            {/* Background circles */}
            {[0.25, 0.5, 0.75, 1.0].map(r => (
              <circle
                key={r}
                cx="200"
                cy="200"
                r={r * 150}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Axes */}
            {facetData.map((f, i) => {
              const angle = (i / facetData.length) * 2 * Math.PI - Math.PI / 2;
              const x = 200 + Math.cos(angle) * 150;
              const y = 200 + Math.sin(angle) * 150;
              const labelX = 200 + Math.cos(angle) * 170;
              const labelY = 200 + Math.sin(angle) * 170;

              return (
                <g key={f.facet}>
                  <line
                    x1="200"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="10"
                    fill={f.color}
                    fontWeight="bold"
                  >
                    {FACET_LABELS[f.facet].substring(0, 3)}
                  </text>
                </g>
              );
            })}

            {/* Data polygon */}
            <polygon
              points={facetData.map((f, i) => {
                const angle = (i / facetData.length) * 2 * Math.PI - Math.PI / 2;
                const r = Math.abs(f.score) / maxScore * 150;
                const x = 200 + Math.cos(angle) * r;
                const y = 200 + Math.sin(angle) * r;
                return `${x},${y}`;
              }).join(' ')}
              fill="rgba(59, 130, 246, 0.3)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />

            {/* Data points */}
            {facetData.map((f, i) => {
              const angle = (i / facetData.length) * 2 * Math.PI - Math.PI / 2;
              const r = Math.abs(f.score) / maxScore * 150;
              const x = 200 + Math.cos(angle) * r;
              const y = 200 + Math.sin(angle) * r;

              return (
                <circle
                  key={f.facet}
                  cx={x}
                  cy={y}
                  r="4"
                  fill={f.color}
                  onClick={() => onFacetClick && onFacetClick(f.facet)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Facet scores computed via semantic similarity to 960 anchors across 12 categories
        </div>
      </div>
    </div>
  );
}
