'use client';

import React, { useState, useEffect } from 'react';
import { Download, MapPin, Info } from 'lucide-react';

export default function AuthorOrigins() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any | null>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      if (!response.ok) throw new Error('Failed to fetch authors');
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClickAuthor = (author: any) => {
    setSelectedAuthor(author);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('map');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'author_origins.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleDownloadPng = () => {
    const svgElement = document.getElementById('map');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const pngUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'author_origins.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) return <div style={{ color: '#F5F3EF' }}>Loading...</div>;
  if (error) return <div style={{ color: '#DC2626' }}>Error: {error}</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px' }}>
      <h1 style={{ color: '#C9A962' }}>Author Origins</h1>
      <div style={{ position: 'relative' }}>
        <svg id="map" width="800" height="600" style={{ borderRadius: '8px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)' }}>
          <rect width="100%" height="100%" fill="#1E1E24" />
          {authors.map((author) => (
            <circle
              key={author.id}
              cx={author.coords.x}
              cy={author.coords.y}
              r="5"
              fill="#C9A962"
              style={{ cursor: 'pointer', filter: 'drop-shadow(0 0 5px rgba(201,169,98,0.3))' }}
              onClick={() => handleClickAuthor(author)}
            />
          ))}
        </svg>
        {selectedAuthor && (
          <div style={{ position: 'absolute', top: 0, left: '100%', marginLeft: '20px', width: '200px', border: '1px solid rgba(201,169,98,0.15)', background: '#1E1E24', padding: '10px', color: '#F5F3EF' }}>
            <h2 style={{ color: '#E8D5A3' }}>{selectedAuthor.name}</h2>
            <p style={{ color: 'rgba(245,243,239,0.7)' }}>{selectedAuthor.info}</p>
          </div>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleDownloadSvg}
          style={{
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            color: '#0D0D0F',
            border: 'none',
            padding: '10px',
            marginRight: '10px',
            cursor: 'pointer',
          }}
        >
          <Download /> Download SVG
        </button>
        <button
          onClick={handleDownloadPng}
          style={{
            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
            color: '#0D0D0F',
            border: 'none',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          <Download /> Download PNG
        </button>
      </div>
    </div>
  );
}