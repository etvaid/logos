'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Spinner } from 'lucide-react';
import axios from 'axios';

export default function ArchaeologicalSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get('/api/archaeological-sites');
        setSites(response.data);
      } catch (err) {
        setError('Failed to load archaeological sites');
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  const handleMarkerClick = (site) => {
    setSelectedSite(site);
  };

  const handleClosePopup = () => {
    setSelectedSite(null);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', height: '100vh', color: '#F5F3EF' }}>
      <h1 style={{ textAlign: 'center', margin: '20px', fontSize: '2.5rem' }}>Archaeological Sites</h1>
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <Spinner style={{ width: '50px', height: '50px', color: '#C9A962' }} />
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', color: '#DC2626', marginTop: '20px' }}>
          {error}
        </div>
      )}
      {!loading && !error && (
        <MapContainer center={[51.505, -0.09]} zoom={5} style={{ height: '80vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {sites.map((site) => (
            <Marker key={site.id} position={site.coordinates} eventHandlers={{ click: () => handleMarkerClick(site) }}>
              <Popup>
                <div style={{ background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)', padding: '10px', borderRadius: '8px' }}>
                  <h2 style={{ color: '#C9A962' }}>{site.name}</h2>
                  <p>{site.description}</p>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                      color: '#0D0D0F',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(site.artifactLink, '_blank')}
                  >
                    View Artifacts
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                      color: '#0D0D0F',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginLeft: '10px',
                    }}
                    onClick={handleClosePopup}
                  >
                    Close
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}