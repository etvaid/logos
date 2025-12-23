'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Book, Languages, Compass, Brain, Map, Clock, Users, Database, Zap, ChevronRight, Star } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Semantic Search",
      description: "Find concepts across ancient texts using AI-powered semantic understanding",
      href: "/search",
      color: "#3B82F6"
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "AI Translation",
      description: "Translate between Greek, Latin, and modern languages with contextual accuracy",
      href: "/translate",
      color: "#F59E0B"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Discovery Engine",
      description: "Uncover hidden connections and patterns in classical literature",
      href: "/discover",
      color: "#7C3AED"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "SEMANTIA",
      description: "Advanced semantic analysis and conceptual mapping of ancient texts",
      href: "/semantia",
      color: "#DC2626"
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Interactive Maps",
      description: "Explore the ancient world through interactive historical geography",
      href: "/maps",
      color: "#059669"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "CHRONOS Timeline",
      description: "Navigate through time with our comprehensive historical timeline",
      href: "/chronos",
      color: "#D97706"
    }
  ]

  const layers = [
    { title: "Source Texts", description: "Original Greek and Latin manuscripts" },
    { title: "AI Processing", description: "Natural language understanding and analysis" },
    { title: "Semantic Networks", description: "Conceptual relationships and connections" },
    { title: "Knowledge Graphs", description: "Structured historical and literary data" },
    { title: "Research Interface", description: "Intuitive tools for scholarly discovery" }
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Floating Greek Letters Animation */}
        <div className="absolute inset-0 overflow-hidden">
          {['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'].map((letter, i) => (
            <div
              key={letter}
              className="absolute text-4xl opacity-10 animate-pulse"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                fontFamily: 'serif'
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#C9A227] to-[#F59E0B] bg-clip-text text-transparent">
            LOGOS
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Classical Research Platform
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 1.7M classical passages..."
                className="w-full pl-12 pr-4 py-4 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#C9A227] hover:bg-[#B8911E] px-6 py-2 rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C9A227]">1.7M</div>
              <div className="text-gray-400">Passages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C9A227]">892K</div>
              <div className="text-gray-400">Unique Words</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C9A227]">500K</div>
              <div className="text-gray-400">Semantic Connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Explore Ancient Wisdom
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <a
                key={feature.title}
                href={feature.href}
                className="group bg-[#1E1E24] p-6 rounded-xl hover:bg-[#2A2A32] transition-all duration-300 hover:scale-105"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-[#C9A227] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm text-[#C9A227] group-hover:translate-x-1 transition-transform">
                  Explore <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#1E1E24]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            How LOGOS Works
          </h2>
          <div className="space-y-8">
            {layers.map((layer, index) => (
              <div key={layer.title} className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center text-[#0D0D0F] font-bold text-lg mr-6">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">{layer.title}</h3>
                  <p className="text-gray-400">{layer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-[#1E1E24] p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 mr-2 text-[#3B82F6]" />
                <h3 className="text-2xl font-bold">Student</h3>
              </div>
              <div className="text-3xl font-bold mb-4">
                Free
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Basic search access
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Limited translations
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Community support
                </li>
              </ul>
              <button className="w-full py-2 px-4 border border-[#C9A227] text-[#C9A227] rounded-lg hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-colors">
                Get Started
              </button>
            </div>
            
            <div className="bg-[#1E1E24] p-8 rounded-xl border border-[#C9A227] relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#C9A227] text-[#0D0D0F] px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <div className="flex items-center mb-4">
                <Book className="w-6 h-6 mr-2 text-[#C9A227]" />
                <h3 className="text-2xl font-bold">Scholar</h3>
              </div>
              <div className="text-3xl font-bold mb-4">
                $9<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Unlimited access
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Advanced AI features
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-[#C9A227]" />
                  Export capabilities
                </li>
              </ul>
              <button className="w-full py-2 px-4 bg-[#C9A227] text-[#0D0D0F] rounded-lg hover:bg-[#B8911E] transition-colors">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E24] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#C9A227]">LOGOS</h3>
              <p className="text-gray-400">
                Bridging ancient wisdom and modern AI for classical research.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/search" className="hover:text-[#C9A227] transition-colors">Search</a></li>
                <li><a href="/translate" className="hover:text-[#C9A227] transition-colors">Translate</a></li>
                <li><a href="/discover" className="hover:text-[#C9A227] transition-colors">Discover</a></li>
                <li><a href="/maps" className="hover:text-[#C9A227] transition-colors">Maps</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/docs" className="hover:text-[#C9A227] transition-colors">Documentation</a></li>
                <li><a href="/api" className="hover:text-[#C9A227] transition-colors">API</a></li>
                <li><a href="/help" className="hover:text-[#C9A227] transition-colors">Help Center</a></li>
                <li><a href="/tutorials" className="hover:text-[#C9A227] transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-[#C9A227] transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-[#C9A227] transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-[#C9A227] transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-[#C9A227] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LOGOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}