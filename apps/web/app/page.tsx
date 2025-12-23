'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Layers, Network, Shield, Star, Check, X } from 'lucide-react';

export default function LogosLandingPage() {
  const [passages, setPassages] = useState(0);
  const [embeddings, setEmbeddings] = useState(0);
  const [intertexts, setIntertexts] = useState(0);

  useEffect(() => {
    const animateCounter = (target: number, setter: (value: number) => void, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const timer = setTimeout(() => {
      animateCounter(1700000, setPassages);
      animateCounter(892000, setEmbeddings);
      animateCounter(500000, setIntertexts);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const FloatingLetters = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      {['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'].map((letter, i) => (
        <div
          key={i}
          className="absolute text-6xl font-bold animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: '4s',
            color: '#C9A227'
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );

  const LayerVisualization = () => (
    <div className="relative">
      {['Text', 'Semantic', 'Relationship', 'Truth', 'Discovery'].map((layer, i) => (
        <div
          key={i}
          className="flex items-center mb-4 transform hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${i * 0.2}s` }}
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg"
            style={{ 
              backgroundColor: i === 0 ? '#3B82F6' : i === 1 ? '#10B981' : i === 2 ? '#8B5CF6' : i === 3 ? '#EF4444' : '#C9A227'
            }}
          >
            {i + 1}
          </div>
          <div className="flex-1 bg-gradient-to-r from-transparent to-gray-800 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-white">{layer}</h3>
            <p className="text-gray-300 text-sm">
              {layer === 'Text' && 'Raw classical sources and manuscripts'}
              {layer === 'Semantic' && 'AI-powered meaning extraction and analysis'}
              {layer === 'Relationship' && 'Cross-referential connections and citations'}
              {layer === 'Truth' && 'Scholarly verification and peer validation'}
              {layer === 'Discovery' && 'Novel insights and research breakthroughs'}
            </p>
          </div>
          {i < 4 && <ChevronRight className="text-yellow-500 ml-2" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100" style={{ backgroundColor: '#0D0D0F' }}>
      <FloatingLetters />
      
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-yellow-500">LOGOS</h1>
              <span className="ml-2 text-sm text-gray-400">Classical Research Platform</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-yellow-500 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-yellow-500 transition-colors">Pricing</a>
              <a href="#about" className="text-gray-300 hover:text-yellow-500 transition-colors">About</a>
            </div>
            <button className="bg-yellow-600 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition-colors">
              Start Research
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            The World's Largest Classical Corpus
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Unlock the complete archive of ancient literature with AI-powered semantic analysis, 
            comprehensive cross-referencing, and cutting-edge research tools.
          </p>

          {/* Animated Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                {passages.toLocaleString()}+
              </div>
              <div className="text-gray-300">Searchable Passages</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                {embeddings.toLocaleString()}
              </div>
              <div className="text-gray-300">Semantic Embeddings</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                {intertexts.toLocaleString()}+
              </div>
              <div className="text-gray-300">Intertextual Connections</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center bg-green-900/30 border border-green-700 rounded-full px-4 py-2">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-green-300">Academically Rigorous</span>
            </div>
            <div className="flex items-center bg-blue-900/30 border border-blue-700 rounded-full px-4 py-2">
              <Network className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-blue-300">CTS/URN Compliant</span>
            </div>
            <div className="flex items-center bg-purple-900/30 border border-purple-700 rounded-full px-4 py-2">
              <Star className="w-5 h-5 mr-2 text-purple-400" />
              <span className="text-purple-300">Peer-Review Ready</span>
            </div>
          </div>

          <button className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Begin Your Research Journey
          </button>
        </div>
      </section>

      {/* 5-Layer Analysis */}
      <section id="features" className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">5-Layer Analysis System</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From raw text to groundbreaking discoveries - our revolutionary layered approach 
              transforms how scholars interact with classical literature.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <LayerVisualization />
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">How LOGOS Compares</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800/50 rounded-lg overflow-hidden">
              <thead className="bg-yellow-600 text-black">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">LOGOS</th>
                  <th className="px-6 py-4 text-center font-semibold">TLG</th>
                  <th className="px-6 py-4 text-center font-semibold">Perseus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-gray-300">Corpus Size</td>
                  <td className="px-6 py-4 text-center text-green-400"><Check className="w-5 h-5 mx-auto" /> 1.7M+ passages</td>
                  <td className="px-6 py-4 text-center text-yellow-400">~700K</td>
                  <td className="px-6 py-4 text-center text-yellow-400">~300K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Semantic Analysis</td>
                  <td className="px-6 py-4 text-center text-green-400"><Check className="w-5 h-5 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-red-400"><X className="w-5 h-5 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-red-400"><X className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">Intertextual Mapping</td>
                  <td className="px-6 py-4 text-center text-green-400"><Check className="w-5 h-5 mx-auto" /> 500K+ connections</td>
                  <td className="px-6 py-4 text-center text-yellow-400">Limited</td>
                  <td className="px-6 py-4 text-center text-yellow-400">Basic</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-300">API Access</td>
                  <td className="px-6 py-4 text-center text-green-400"><Check className="w-5 h-5 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-red-400"><X className="w-5 h-5 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-green-400"><Check className="w-5 h-5 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Trusted by Leading Institutions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "LOGOS has revolutionized our classical studies program. The semantic analysis 
                capabilities have led to discoveries we never thought possible."
              </p>
              <div className="text-yellow-500 font-semibold">— Prof. Sarah Chen, Yale University</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "The comprehensive intertextual mapping has transformed how our graduate 
                students approach their dissertation research."
              </p>
              <div className="text-yellow-500 font-semibold">— Dr. Marcus Thompson, Stanford</div>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Simply the most powerful classical research tool available today. 
                Essential for any serious scholar."
              </p>
              <div className="text-yellow-500 font-semibold">— Prof. Helena Morrison, Oxford</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 hover:border-yellow-500 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-green-400">Academic</h3>
              <div className="text-3xl font-bold mb-6 text-white">FREE</div>
              <p className="text-gray-300 mb-6">For .edu email addresses</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Full corpus access
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Semantic search
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Basic API access
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-500 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-lg border-2 border-yellow-500 relative hover:border-yellow-400 transition-colors">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Personal</h3>
              <div className="text-3xl font-bold mb-6 text-white">$9<span className="text-lg text-gray-400">/month</span></div>
              <p className="text-gray-300 mb-6">For individual researchers</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Everything in Academic
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Export capabilities
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-yellow-600 text-black py-3 rounded-md font-semibold hover:bg-yellow-500 transition-colors">
                Start Trial
              </button>
            </div>

            <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Institution</h3>
              <div className="text-3xl font-bold mb-6 text-white">$29<span className="text-lg text-gray-400">/seat</span></div>
              <p className="text-gray-300 mb-6">For universities & libraries</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Everything in Personal
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Multi-user management
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Full API access
                </li>
                <li className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 mr-3 text-green-400" />
                  Custom integrations
                </li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-500 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">LOGOS</h3>
              <p className="text-gray-400 max-w-md">
                The world's most comprehensive classical research platform, 
                empowering scholars with AI-driven insights and comprehensive analysis tools.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Historical Era Legend</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#D97706' }}></div>
                  <span className="text-gray-300">Archaic (800-500 BCE)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#F59E0B' }}></div>
                  <span className="text-gray-300">Classical (500-323 BCE)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#3B82F6' }}></div>
                  <span className="text-gray-300">Hellenistic (323-31 BCE)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#DC2626' }}></div>
                  <span className="text-gray-300">Imperial Rome (31 BCE-284 CE)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#7C3AED' }}></div>
                  <span className="text-gray-300">Late Antiquity (284-600 CE)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: '#059669' }}></div>
                  <span className="text-gray-300">Byzantine (600-1453 CE)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LOGOS Classical Research Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}