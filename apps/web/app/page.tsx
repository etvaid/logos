'use client';

import React, { useState } from 'react';

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const stats = [
    { number: '1.7M', label: 'Passages', description: 'Classical texts digitized' },
    { number: '892K', label: 'Embeddings', description: 'AI-powered connections' },
    { number: '2.5K', label: 'Authors', description: 'Ancient voices preserved' },
    { number: '15', label: 'Languages', description: 'Linguistic diversity' }
  ];

  const features = [
    {
      title: 'Search',
      description: 'Advanced search through classical literature with AI-powered relevance ranking',
      icon: '🔍'
    },
    {
      title: 'Translate',
      description: 'Instant translation between ancient and modern languages with context preservation',
      icon: '🌐'
    },
    {
      title: 'SEMANTIA',
      description: 'Discover semantic connections and thematic relationships across texts',
      icon: '🧠'
    },
    {
      title: 'Discover',
      description: 'Explore related passages and uncover hidden connections in classical works',
      icon: '✨'
    },
    {
      title: 'Verify',
      description: 'Cross-reference citations and validate textual authenticity with our database',
      icon: '✓'
    },
    {
      title: 'Learn',
      description: 'Interactive lessons and guided exploration of classical literature',
      icon: '📚'
    }
  ];

  const footerLinks = [
    { title: 'Product', links: ['Features', 'API', 'Documentation', 'Pricing'] },
    { title: 'Resources', links: ['Blog', 'Guides', 'Research', 'Community'] },
    { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[#C9A227]">LOGOS</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="hover:text-[#C9A227] transition-colors duration-300">Features</a>
            <a href="#" className="hover:text-[#C9A227] transition-colors duration-300">Research</a>
            <a href="#" className="hover:text-[#C9A227] transition-colors duration-300">Documentation</a>
            <a href="#" className="hover:text-[#C9A227] transition-colors duration-300">About</a>
          </nav>
          <button className="bg-[#C9A227] text-[#0D0D0F] px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-300">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            The World's Largest
            <span className="block text-[#C9A227]">Classical Corpus</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
            1.7 million passages. 892,000 embeddings. AI-powered discovery.
            <br />
            Explore the greatest works of human civilization.
          </p>
          <button className="bg-[#C9A227] text-[#0D0D0F] px-12 py-4 rounded-xl text-lg font-bold hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-2xl">
            Start Exploring
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#C9A227] rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-[#C9A227] rounded-full opacity-40 animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-[#C9A227] rounded-full opacity-80 animate-pulse delay-200"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#0D0D0F] via-gray-900/20 to-[#0D0D0F]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold text-[#C9A227] mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Tools for
              <span className="text-[#C9A227]"> Classical Research</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI capabilities designed specifically for scholars, students, and enthusiasts of classical literature.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:border-[#C9A227]/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
                  hoveredCard === index ? 'shadow-2xl border-[#C9A227]/50' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-[#C9A227]">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#C9A227]/10 via-[#C9A227]/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Explore the
            <span className="text-[#C9A227]"> Ancient World</span>?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of researchers and students already discovering connections across classical literature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#C9A227] text-[#0D0D0F] px-10 py-4 rounded-xl text-lg font-bold hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="border border-[#C9A227] text-[#C9A227] px-10 py-4 rounded-xl text-lg font-bold hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-all duration-300">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1">
              <div className="text-3xl font-bold text-[#C9A227] mb-4">LOGOS</div>
              <p className="text-gray-400 mb-6">
                Democratizing access to classical literature through advanced AI and semantic analysis.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-colors duration-300 cursor-pointer">
                  <span className="font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-colors duration-300 cursor-pointer">
                  <span className="font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-colors duration-300 cursor-pointer">
                  <span className="font-bold">in</span>
                </div>
              </div>
            </div>
            
            {footerLinks.map((section, index) => (
              <div key={index} className="col-span-1">
                <h4 className="text-lg font-semibold mb-4 text-[#C9A227]">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-[#C9A227] transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 LOGOS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#C9A227] transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-[#C9A227] transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-[#C9A227] transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}