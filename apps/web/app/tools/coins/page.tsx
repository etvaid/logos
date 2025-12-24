'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Coin {
  id: string;
  title: string;
  ruler: string;
  mint: string;
  date: string;
  era: string;
  denomination: string;
  metal: string;
  weight: number;
  diameter: number;
  obverse_legend: string;
  reverse_legend: string;
  obverse_description: string;
  reverse_description: string;
  image_obverse: string;
  image_reverse: string;
  rarity: string;
  condition: string;
  provenance: string;
  references: string;
}

export default function CoinsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('');
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

  const eras = ['Archaic', 'Classical', 'Hellenistic', 'Imperial', 'Late Antique', 'Byzantine'];
  const metals = ['Gold', 'Silver', 'Bronze', 'Copper', 'Electrum'];

  const getEraColor = (era: string) => {
    switch (era) {
      case 'Archaic': return '#D97706';
      case 'Classical': return '#F59E0B';
      case 'Hellenistic': return '#3B82F6';
      case 'Imperial': return '#DC2626';
      case 'Late Antique': return '#7C3AED';
      case 'Byzantine': return '#059669';
      default: return '#C9A227';
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/coins');
      if (!response.ok) throw new Error('Failed to fetch coins');
      const data = await response.json();
      setCoins(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.ruler.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.mint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.obverse_legend.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.reverse_legend.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEra = selectedEra === '' || coin.era === selectedEra;
    const matchesMetal = selectedMetal === '' || coin.metal === selectedMetal;
    return matchesSearch && matchesEra && matchesMetal;
  });

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/tools" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Tools</Link>
              <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Research</Link>
            </div>
          </div>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)' }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF' }}>Loading numismatic database...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/tools" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Tools</Link>
              <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Research</Link>
            </div>
          </div>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 80px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#DC2626', marginBottom: '16px' }}>Error</div>
            <div style={{ color: '#9CA3AF' }}>{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</div>
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/tools" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Tools</Link>
            <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Research</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '16px' }}>Numismatic Database</h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive collection of ancient coins with detailed imagery, legends, and historical context
          </p>
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search coins, rulers, mints, legends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: '#0D0D0F', 
                border: '1px solid #4B5563', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            />
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              style={{ 
                backgroundColor: '#0D0D0F', 
                border: '1px solid #4B5563', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            >
              <option value="">All Eras</option>
              {eras.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>
            <select
              value={selectedMetal}
              onChange={(e) => setSelectedMetal(e.target.value)}
              style={{ 
                backgroundColor: '#0D0D0F', 
                border: '1px solid #4B5563', 
                borderRadius: '8px', 
                padding: '12px 16px', 
                color: '#F5F4F2',
                fontSize: '14px'
              }}
            >
              <option value="">All Metals</option>
              {metals.map(metal => (
                <option key={metal} value={metal}>{metal}</option>
              ))}
            </select>
          </div>
          <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
            Found {filteredCoins.length} coin{filteredCoins.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredCoins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🪙</div>
            <h3 style={{ fontSize: '24px', color: '#C9A227', marginBottom: '8px' }}>No Coins Found</h3>
            <p style={{ color: '#9CA3AF' }}>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredCoins.map((coin) => (
              <div 
                key={coin.id}
                style={{ 
                  backgroundColor: '#1E1E24', 
                  borderRadius: '12px', 
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(201,162,39,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,162,39,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => setSelectedCoin(coin)}
              >
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  {coin.image_obverse && (
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#0D0D0F',
                      backgroundImage: `url(${coin.image_obverse})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  )}
                  {coin.image_reverse && (
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#0D0D0F',
                      backgroundImage: `url(${coin.image_reverse})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} />
                  )}
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '4px' }}>
                    {coin.title}
                  </h3>
                  <p style={{ color: '#C9A227', fontSize: '14px', fontWeight: 'bold' }}>{coin.ruler}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ 
                    backgroundColor: getEraColor(coin.era), 
                    color: '#FFFFFF', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {coin.era}
                  </span>
                  <span style={{ 
                    backgroundColor: '#4B5563', 
                    color: '#F5F4F2', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px'
                  }}>
                    {coin.metal}
                  </span>
                  <span style={{ 
                    backgroundColor: '#374151', 
                    color: '#F5F4F2', 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px'
                  }}>
                    {coin.denomination}
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
                  <div><strong>Mint:</strong> {coin.mint}</div>
                  <div><strong>Date:</strong> {coin.date}</div>
                  {coin.weight && <div><strong>Weight:</strong> {coin.weight}g</div>}
                  {coin.diameter && <div><strong>Diameter:</strong> {coin.diameter}mm</div>}
                </div>

                {(coin.obverse_legend || coin.reverse_legend) && (
                  <div style={{ fontSize: '12px', color: '#6B7280', fontStyle: 'italic' }}>
                    {coin.obverse_legend && <div>Obv: {coin.obverse_legend}</div>}
                    {coin.reverse_legend && <div>Rev: {coin.reverse_legend}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedCoin && (
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setSelectedCoin(null)}
          >
            <div 
              style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '32px',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCoin(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>

              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>
                  {selectedCoin.title}
                </h2>
                <p style={{ fontSize: '18px', color: '#F5F4F2', marginBottom: '4px' }}>{selectedCoin.ruler}</p>
                <p style={{ color: '#9CA3AF' }}>{selectedCoin.mint} • {selectedCoin.date}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {selectedCoin.image_obverse && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '200px', 
                      height: '200px', 
                      margin: '0 auto 16px',
                      borderRadius: '50%', 
                      backgroundColor: '#0D0D0F',
                      backgroundImage: `url(${selectedCoin.image_obverse})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '3px solid #C9A227'
                    }} />
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Obverse</h4>
                    {selectedCoin.obverse_legend && (
                      <p style={{ fontSize: '14px', color: '#F5F4F2', fontStyle: 'italic', marginBottom: '8px' }}>
                        "{selectedCoin.obverse_legend}"
                      </p>
                    )}
                    {selectedCoin.obverse_description && (
                      <p style={{ fontSize: '14px', color: '#9CA3AF' }}>{selectedCoin.obverse_description}</p>
                    )}
                  </div>
                )}
                {selectedCoin.image_reverse && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '200px', 
                      height: '200px', 
                      margin: '0 auto 16px',
                      borderRadius: '50%', 
                      backgroundColor: '#0D0D0F',
                      backgroundImage: `url(${selectedCoin.image_reverse})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: '3px solid #C9A227'
                    }} />
                    <h4 style={{ color: '#C9A227', marginBottom: '8px' }}>Reverse</h4>
                    {selectedCoin.reverse_legend && (
                      <p style={{ fontSize: '14px', color: '#F5F4F2', fontStyle: 'italic', marginBottom: '8px' }}>
                        "{selectedCoin.reverse_legend}"
                      </p>
                    )}
                    {selectedCoin.reverse_description && (
                      <p style={{ fontSize: '14px', color: '#9CA3AF' }}>{selectedCoin.reverse_description}</p>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div>
                  <h4 style={{ color: '#C9A227', marginBottom: '16px' }}>Specifications</h4>
                  <div style={{ fontSize: '14px', color: '#F5F4F2', lineHeight: '1.6' }}>
                    <div><strong>Era:</strong> <span style={{ color: getEraColor(selectedCoin.era) }}>{selectedCoin.era}</span></div>
                    <div><strong>Metal:</strong> {selectedCoin.metal}</div>
                    <div><strong>Denomination:</strong> {selectedCoin.denomination}</div>
                    {selectedCoin.weight && <div><strong>Weight:</strong> {selectedCoin.weight} grams</div>}
                    {selectedCoin.diameter && <div><strong>Diameter:</strong> {selectedCoin.diameter} mm</div>}
                    {selectedCoin.condition && <div><strong>Condition:</strong> {selectedCoin.condition}</div>}
                    {selectedCoin.rarity && <div><strong>Rarity:</strong> {selectedCoin.rarity}</div>}
                  </div>
                </div>

                <div>
                  <h4 style={{ color: '#C9A227', marginBottom: '16px' }}>Documentation</h4>
                  <div style={{ fontSize: '14px', color: '#F5F4F2', lineHeight: '1.6' }}>
                    {selectedCoin.provenance && <div><strong>Provenance:</strong> {selectedCoin.provenance}</div>}
                    {selectedCoin.references && <div><strong>References:</strong> {selectedCoin.references}</div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}