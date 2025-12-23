'use client';
import React, { useState, useEffect } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Discovery {
  id: number;
  order_level: number;
  pattern_type: string;
  hypothesis: string;
  description: string;
  confidence: number;
  novelty_score: number;
  evidence: Array<{ type: string; detail: string }>;
}

export default function DiscoverPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderFilter, setOrderFilter] = useState<number | null>(null);

  useEffect(() => {
    loadDiscoveries();
  }, [orderFilter]);

  const loadDiscoveries = async () => {
    setIsLoading(true);
    setError('');
    try {
      const url = orderFilter 
        ? API_URL + '/api/discovery/patterns?order=' + orderFilter
        : API_URL + '/api/discovery/patterns';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setDiscoveries(data.discoveries || []);
    } catch (e) {
      setError('Failed to load discoveries');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderColor = (level: number) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600'];
    return colors[level - 1] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">LOGOS Discovery</h1>
        <p className="text-gray-400 text-center mb-8">Higher-order pattern detection across classical texts</p>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setOrderFilter(null)}
            className={`px-4 py-2 rounded-lg ${!orderFilter ? 'bg-white text-gray-900' : 'bg-gray-700'}`}
          >
            All
          </button>
          {[1, 2, 3, 4].map((level) => (
            <button
              key={level}
              onClick={() => setOrderFilter(level)}
              className={`px-4 py-2 rounded-lg ${orderFilter === level ? 'bg-white text-gray-900' : 'bg-gray-700'}`}
            >
              {level === 1 ? '1st' : level === 2 ? '2nd' : level === 3 ? '3rd' : '4th'} Order
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg mb-8">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">Loading discoveries...</div>
        ) : (
          <div className="space-y-6">
            {discoveries.map((d) => (
              <div key={d.id} className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderColor(d.order_level)}`}>
                    {d.order_level === 1 ? '1st' : d.order_level === 2 ? '2nd' : d.order_level === 3 ? '3rd' : '4th'} Order
                  </span>
                  <div className="text-sm text-gray-400">
                    Confidence: {(d.confidence * 100).toFixed(0)}% | Novelty: {(d.novelty_score * 100).toFixed(0)}%
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{d.hypothesis}</h3>
                <p className="text-gray-300 mb-4">{d.description}</p>
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Evidence</h4>
                  {d.evidence.map((e, i) => (
                    <div key={i} className="flex gap-2 text-sm mb-1">
                      <span className="px-2 py-0.5 bg-gray-600 rounded">{e.type}</span>
                      <span>{e.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
