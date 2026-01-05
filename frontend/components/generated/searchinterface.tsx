import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

type SearchInterfaceProps = {
  onSearch: (query: string, filters: string[]) => void;
};

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearch }) => {
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setError('Search query cannot be empty.');
      return;
    }
    setError(null);
    const newRecentSearches = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    onSearch(query, filters);
  };

  const toggleFilter = (filter: string) => {
    setFilters(prevFilters =>
      prevFilters.includes(filter) ? prevFilters.filter(f => f !== filter) : [...prevFilters, filter]
    );
  };

  return (
    <div className="bg-[#0D0D0F] text-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="flex items-center border-b border-[#C9A962] pb-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent flex-1 outline-none text-lg"
          placeholder="Search..."
          aria-label="Search"
        />
        <button
          onClick={handleSearch}
          className="ml-2 text-[#C9A962] hover:text-white transition-colors"
          aria-label="Search button"
        >
          <Search className="h-6 w-6" />
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="mb-4">
        <h4 className="text-[#C9A962] mb-2">Filters</h4>
        <div className="flex space-x-2">
          {['Filter1', 'Filter2', 'Filter3'].map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1 rounded-full border ${
                filters.includes(filter) ? 'bg-[#C9A962] text-black' : 'border-[#C9A962]'
              }`}
              aria-pressed={filters.includes(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-[#C9A962] mb-2">Recent Searches</h4>
        <ul>
          {recentSearches.map((search, index) => (
            <motion.li
              key={index}
              className="flex justify-between items-center mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span>{search}</span>
              <button
                onClick={() => setQuery(search)}
                className="text-[#C9A962] hover:text-white transition-colors"
                aria-label={`Use recent search: ${search}`}
              >
                <X className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchInterface;
