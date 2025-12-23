'use client';

import React from 'react';

const AboutPage = () => {
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '2rem' }}>
      <h1 style={{ color: '#C9A227', fontSize: '2.5rem', marginBottom: '1rem' }}>About LOGOS</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Mission</h2>
        <p style={{ fontSize: '1.1rem' }}>Making classical scholarship accessible.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>The Corpus</h2>
        <p style={{ fontSize: '1.1rem' }}>
          Our digital library contains a vast collection of classical texts, including:
        </p>
        <ul>
          <li>Greek (Homer-Byzantine)</li>
          <li>Latin (Plautus-Medieval)</li>
          <li>Hebrew</li>
          <li>Syriac</li>
        </ul>
        <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
            Stats: 1.7M passages, 892K embeddings, 500K connections
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Technology</h2>
        <p style={{ fontSize: '1.1rem' }}>
          LOGOS is powered by cutting-edge AI technology, enabling powerful research capabilities.
        </p>
        <ul>
          <li>AI Embeddings</li>
          <li>Semantic Search</li>
          <li>SEMANTIA (Our proprietary search algorithm)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Team</h2>
        <p style={{ fontSize: '1.1rem' }}>[Placeholder: Team section coming soon.]</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Advisory Board</h2>
        <p style={{ fontSize: '1.1rem' }}>
          Our advisory board consists of leading scholars from renowned institutions, including Yale, Stanford, and Oxford. [Placeholder: Advisory Board section with names and affiliations coming soon.]
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Partners</h2>
        <p style={{ fontSize: '1.1rem' }}>
            [Placeholder: Partners section with logos and links coming soon.]
        </p>
      </section>

      <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.8rem', color: '#F5F4F2' }}>
        © {new Date().getFullYear()} LOGOS. All rights reserved.
      </footer>
    </div>
  );
};

export default AboutPage;