'use client'

import { useState } from 'react';

const DISCOVERIES = [
  {id:1, title:"Homer's Wine-Dark Sea in Christian Hymns", type:"Pattern", confidence:87, novelty:92, description:"οἶνοψ πόντος appears in 4th century Christian hymns.", evidence:["Homer Od. 5.349","Ephrem Hymn 3.4"]},
  {id:2, title:"Stoic Vocabulary in Paul's Letters", type:"Influence", confidence:94, novelty:76, description:"23 technical Stoic terms cluster in Romans 7-8.", evidence:["Rom 7:23","Epictetus 1.1"]},
  {id:3, title:"Virgil's Hidden Ennius Debt", type:"Intertextuality", confidence:82, novelty:88, description:"47 structural parallels between Aeneid and Annales.", evidence:["Aen. 6.847","Ennius fr. 500"]},
  {id:4, title:"θεραπεία Semantic Reversal", type:"Semantic", confidence:91, novelty:85, description:"From 'service to gods' to 'medical treatment'.", evidence:["Hdt. 2.37","Matt 4:23"]},
];

const TYPE_COLORS: Record<string,string> = {Pattern:"#3B82F6", Influence:"#10B981", Intertextuality:"#F59E0B", Semantic:"#EC4899"};

export default function Discovery() {
  const [filter, setFilter] = useState('all');

  const filteredDiscoveries = filter === 'all' 
    ? DISCOVERIES 
    : DISCOVERIES.filter(d => d.type === filter);

  const filterTypes = ['all', 'Pattern', 'Influence', 'Intertextuality', 'Semantic'];

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#C9A227' }}>
            DISCOVERIES
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#F5F4F2', opacity: 0.8 }}>
            AI-powered insights across classical antiquity
          </p>
        </div>

        {/* Filter Buttons */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {filterTypes.map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: filter === type ? '#C9A227' : '#1E1E24',
                  color: filter === type ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#F5F4F2', opacity: 0.7 }}>
            Showing {filteredDiscoveries.length} discovery{filteredDiscoveries.length !== 1 ? 'ies' : ''}
            {filter !== 'all' && ` for ${filter}`}
          </p>
        </div>

        {/* Discovery Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {filteredDiscoveries.map(discovery => (
            <div
              key={discovery.id}
              style={{
                backgroundColor: '#1E1E24',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid #333',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Type Badge */}
              <div style={{ marginBottom: '1rem' }}>
                <span
                  style={{
                    backgroundColor: TYPE_COLORS[discovery.type],
                    color: '#FFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {discovery.type}
                </span>
              </div>

              {/* Title */}
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: '#C9A227'
              }}>
                {discovery.title}
              </h3>

              {/* Description */}
              <p style={{ 
                color: '#F5F4F2', 
                marginBottom: '1.5rem', 
                lineHeight: '1.6',
                opacity: 0.9
              }}>
                {discovery.description}
              </p>

              {/* Confidence & Novelty */}
              <div style={{ 
                display: 'flex', 
                gap: '2rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#F5F4F2', opacity: 0.7, marginBottom: '0.25rem' }}>
                    Confidence
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: discovery.confidence > 90 ? '#10B981' : discovery.confidence > 80 ? '#F59E0B' : '#DC2626'
                  }}>
                    {discovery.confidence}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#F5F4F2', opacity: 0.7, marginBottom: '0.25rem' }}>
                    Novelty
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: discovery.novelty > 90 ? '#C9A227' : discovery.novelty > 80 ? '#3B82F6' : '#EC4899'
                  }}>
                    {discovery.novelty}%
                  </div>
                </div>
              </div>

              {/* Evidence Tags */}
              <div>
                <div style={{ fontSize: '0.875rem', color: '#F5F4F2', opacity: 0.7, marginBottom: '0.5rem' }}>
                  Evidence
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {discovery.evidence.map((evidence, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#0D0D0F',
                        color: '#F5F4F2',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        border: '1px solid #333'
                      }}
                    >
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDiscoveries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: '#F5F4F2', opacity: 0.6, fontSize: '1.25rem' }}>
              No discoveries found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}