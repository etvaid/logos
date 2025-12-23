'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Loader2, AlertCircle, Network, BookOpen } from 'lucide-react';

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

const DiscoverPage: React.FC = () => {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [orderFilter, setOrderFilter] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('logos-theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('logos-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    loadDiscoveries();
  }, [orderFilter]);

  const loadDiscoveries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = orderFilter 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/patterns?order=${orderFilter}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/discovery/patterns`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load discoveries');
      const data = await response.json();
      setDiscoveries(data.discoveries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderColor = (level: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'];
    return colors[level - 1] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LOGOS Discovery</h1>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filter by Order Level</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setOrderFilter(null)}
              className={`px-4 py-2 rounded-lg ${!orderFilter ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
              All
            </button>
            {[1, 2, 3, 4].map((level) => (
              <button key={level} onClick={() => setOrderFilter(level)}
                className={`px-4 py-2 rounded-lg ${orderFilter === level ? 'bg-gray-900 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                {level === 1 ? '1st Order' : level === 2 ? '2nd Order' : level === 3 ? '3rd Order' : '4th Order'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4 mb-8 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {discoveries.map((discovery) => (
              <div key={discovery.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getOrderColor(discovery.order_level)}`}>
                      {discovery.order_level === 1 ? '1st' : discovery.order_level === 2 ? '2nd' : discovery.order_level === 3 ? '3rd' : '4th'} Order
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{discovery.pattern_type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Confidence: {(discovery.confidence * 100).toFixed(0)}%</div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">Novelty: {(discovery.novelty_score * 100).toFixed(0)}%</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{discovery.hypothesis}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{discovery.description}</p>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence</h4>
                  <div className="space-y-2">
                    {discovery.evidence.map((e, i) => (
                      <div key={i} className="flex items-start space-x-2 text-sm">
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">{e.type}</span>
                        <span className="text-gray-700 dark:text-gray-300">{e.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DiscoverPage;
