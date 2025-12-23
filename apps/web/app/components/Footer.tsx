'use client';

import React from 'react';
import Link from 'next/link';
import { AiFillGithub, AiFillLinkedin, AiFillTwitterCircle } from 'react-icons/ai';

const Footer = () => {
  const logosBackground = '#0D0D0F';
  const logosSecondary = '#1E1E24';
  const logosText = '#F5F4F2';
  const logosGold = '#C9A227';

  return (
    <footer style={{ backgroundColor: logosSecondary, color: logosText, padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
        {/* LOGOS Logo + Tagline */}
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ color: logosGold, marginBottom: '0.5rem' }}>LOGOS</h3>
          <p style={{ fontSize: '0.8rem' }}>Exploring history, one text at a time.</p>
        </div>

        {/* Product Links */}
        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Product</h4>
          <ul>
            <li><Link href="/texts" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Texts</Link></li>
            <li><Link href="/eras" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Eras</Link></li>
            <li><Link href="/languages" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Languages</Link></li>
          </ul>
        </div>

        {/* Resources Links */}
        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Resources</h4>
          <ul>
            <li><Link href="/documentation" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Documentation</Link></li>
            <li><Link href="/api" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>API</Link></li>
            <li><Link href="/faq" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>FAQ</Link></li>
          </ul>
        </div>

        {/* Company Links */}
        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Company</h4>
          <ul>
            <li><Link href="/about" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>About Us</Link></li>
            <li><Link href="/careers" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Careers</Link></li>
            <li><Link href="/contact" style={{ color: logosText, textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>Contact</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div style={{ flex: '1 1 100px' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Social</h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href="https://github.com" target="_blank" style={{ color: logosText }} aria-label="GitHub"><AiFillGithub size={24} /></Link>
            <Link href="https://linkedin.com" target="_blank" style={{ color: logosText }} aria-label="LinkedIn"><AiFillLinkedin size={24} /></Link>
            <Link href="https://twitter.com" target="_blank" style={{ color: logosText }} aria-label="Twitter"><AiFillTwitterCircle size={24} /></Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: `1px solid ${logosBackground}`, paddingTop: '1rem', textAlign: 'center', fontSize: '0.75rem' }}>
        &copy; {new Date().getFullYear()} LOGOS. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;