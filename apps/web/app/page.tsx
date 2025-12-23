'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Search, Network, Brain, Shield, Zap, Check, Star, Users, BookOpen, Database, Globe } from 'lucide-react'

export default function LogosLandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [floatingLetters, setFloatingLetters] = useState<Array<{ char: string; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    setIsVisible(true)
    
    // Generate floating Greek letters
    const letters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω']
    const floating = Array.from({ length: 15 }, (_, i) => ({
      char: letters[Math.floor(Math.random() * letters.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }))
    setFloatingLetters(floating)
  }, [])

  const CountUpAnimation = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    }, [end, duration])

    return <span>{count.toLocaleString()}{suffix}</span>
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white overflow-hidden">
      {/* Floating Greek Letters */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {floatingLetters.map((letter, i) => (
          <div
            key={i}
            className="absolute text-6xl font-serif text-[#C9A227] opacity-5 animate-pulse"
            style={{
              left: `${letter.x}%`,
              top: `${letter.y}%`,
              animationDelay: `${letter.delay}s`,
              animationDuration: '4s'
            }}
          >
            {letter.char}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm font-medium mb-6">
                Revolutionizing Classical Studies
              </span>
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-[#C9A227] bg-clip-text text-transparent">
                  LOGOS
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
                The World's Most Comprehensive Classical Research Platform
              </p>
              <p className="text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
                <strong className="text-[#C9A227]">1.7+ Million Passages</strong> • 
                <strong className="text-[#C9A227]"> 892,000+ Word Vectors</strong> • 
                <strong className="text-[#C9A227]"> 500,000+ Intertextual Relationships</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="px-8 py-4 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#D4B332] transition-colors flex items-center justify-center">
                Start Research <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <button className="px-8 py-4 border border-[#C9A227] text-[#C9A227] font-semibold rounded-lg hover:bg-[#C9A227]/10 transition-colors">
                View Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C9A227]" />
                Academically Rigorous
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A227]" />
                Peer-Review Compatible
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C9A227]" />
                CTS/URN Compliant
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-[#1A1A1C] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#C9A227] mb-2">
                <CountUpAnimation end={1700000} suffix="+" />
              </div>
              <div className="text-gray-400">Passages</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#C9A227] mb-2">
                <CountUpAnimation end={892000} suffix="+" />
              </div>
              <div className="text-gray-400">Word Vectors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#C9A227] mb-2">
                <CountUpAnimation end={500000} suffix="+" />
              </div>
              <div className="text-gray-400">Intertexts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#C9A227] mb-2">
                <CountUpAnimation end={2} />
              </div>
              <div className="text-gray-400">Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Layers Analysis */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              5-Layer <span className="text-[#C9A227]">Analysis Pipeline</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The only platform offering comprehensive multi-dimensional analysis of classical texts
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {[
              { icon: BookOpen, label: 'Text', desc: 'Raw corpus analysis' },
              { icon: Brain, label: 'Semantic', desc: 'Meaning extraction' },
              { icon: Network, label: 'Relationship', desc: 'Intertextual mapping' },
              { icon: Shield, label: 'Truth', desc: 'Verification layers' },
              { icon: Zap, label: 'Discovery', desc: 'New insights' }
            ].map((layer, index) => (
              <div key={index} className="flex items-center">
                <div className="bg-[#1A1A1C] p-6 rounded-xl text-center min-w-[200px] hover:bg-[#252528] transition-colors">
                  <layer.icon className="w-8 h-8 text-[#C9A227] mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{layer.label}</h3>
                  <p className="text-sm text-gray-400">{layer.desc}</p>
                </div>
                {index < 4 && (
                  <ChevronRight className="w-6 h-6 text-[#C9A227] mx-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#1A1A1C] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Unparalleled <span className="text-[#C9A227]">Capabilities</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'SEMANTIA Lexicon',
                description: 'First corpus-derived Greek/Latin lexicon challenging 150 years of dictionary tradition',
                icon: Database
              },
              {
                title: 'Semantic Search',
                description: 'Find passages by meaning, not just keywords. AI-powered understanding of classical languages',
                icon: Search
              },
              {
                title: 'Intertextual Network',
                description: '500,000+ mapped relationships revealing the interconnected web of classical literature',
                icon: Network
              },
              {
                title: 'Word Vector Analysis',
                description: '892,000+ trained vectors enabling unprecedented linguistic analysis',
                icon: Brain
              },
              {
                title: 'Academic Standards',
                description: 'Peer-review compatible with endorsed methodology aligned to institutional requirements',
                icon: Shield
              },
              {
                title: 'Continuous Discovery',
                description: 'AI-assisted research revealing new patterns and connections in classical texts',
                icon: Zap
              }
            ].map((feature, index) => (
              <div key={index} className="bg-[#0D0D0F] p-8 rounded-xl hover:bg-[#161618] transition-colors">
                <feature.icon className="w-12 h-12 text-[#C9A227] mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Why Choose <span className="text-[#C9A227]">LOGOS</span>?
          </h2>

          <div className="bg-[#1A1A1C] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0D0D0F]">
                  <th className="p-6 text-left">Feature</th>
                  <th className="p-6 text-center text-[#C9A227] font-bold">LOGOS</th>
                  <th className="p-6 text-center text-gray-400">TLG</th>
                  <th className="p-6 text-center text-gray-400">Perseus</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Corpus Size', '1.7M+ passages', '110M words', '1M+ words'],
                  ['Semantic Search', '✓', '✗', '✗'],
                  ['AI Analysis', '✓', '✗', '✗'],
                  ['Intertextual Mapping', '500K+ relationships', 'Limited', 'Basic'],
                  ['Modern UX', '✓', '✗', 'Partial'],
                  ['API Access', '✓', '✗', 'Limited'],
                  ['Student Pricing', 'Free with .edu', '$$$', 'Free (limited)']
                ].map((row, index) => (
                  <tr key={index} className="border-t border-[#2A2A2C]">
                    <td className="p-6 font-semibold">{row[0]}</td>
                    <td className="p-6 text-center text-[#C9A227] font-semibold">{row[1]}</td>
                    <td className="p-6 text-center text-gray-400">{row[2]}</td>
                    <td className="p-6 text-center text-gray-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#1A1A1C] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Trusted by <span className="text-[#C9A227]">Leading Scholars</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "LOGOS has revolutionized how I approach intertextual research. The semantic search capabilities are unprecedented.",
                author: "Dr. Sarah Mitchell",
                title: "Professor of Classics, Harvard University"
              },
              {
                quote: "The corpus-derived lexicon challenges assumptions I've held for decades. This is the future of classical philology.",
                author: "Prof. Marcus Thompson",
                title: "Oxford Centre for Classical Studies"
              },
              {
                quote: "Finally, a platform that matches the sophistication of our research questions. Essential for modern classicists.",
                author: "Dr. Elena Rodriguez",
                title: "Stanford Department of Classics"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-[#0D0D0F] p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#C9A227] fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-gray-400 text-sm">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">
            Accessible <span className="text-[#C9A227]">Pricing</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#1A1A1C] p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Student</h3>
              <div className="text-4xl font-bold mb-6">Free</div>
              <p className="text-gray-400 mb-6">With valid .edu email</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Full corpus access
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Basic semantic search
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  SEMANTIA lexicon
                </li>
              </ul>
              <button className="w-full py-3 border border-[#C9A227] text-[#C9A227] rounded-lg hover:bg-[#C9A227]/10 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-[#C9A227] p-8 rounded-xl text-black relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-[#C9A227] px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Researcher</h3>
              <div className="text-4xl font-bold mb-6">$49/mo</div>
              <p className="text-black/70 mb-6">For individual scholars</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-black mr-3" />
                  Everything in Student
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-black mr-3" />
                  Advanced AI analysis
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-black mr-3" />
                  API access
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-black mr-3" />
                  Export capabilities
                </li>
              </ul>
              <button className="w-full py-3 bg-black text-[#C9A227] rounded-lg hover:bg-black/90 transition-colors font-semibold">
                Start Free Trial
              </button>
            </div>

            <div className="bg-[#1A1A1C] p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Institution</h3>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <p className="text-gray-400 mb-6">For universities & libraries</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Unlimited users
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-[#C9A227] mr-3" />
                  Custom integrations
                </li>
              </ul>
              <button className="w-full py-3 border border-[#C9A227] text-[#C9A227] rounded-lg hover:bg-[#C9A227]/10 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#0D0D0F] border-t border-[#2A2A2C] relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-[#C9A227] mb-4">LOGOS</h3>
              <p className="text-gray-400 mb-4">
                The definitive classical research platform, trusted by scholars worldwide.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                Used at 200+ institutions
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>API Documentation</li>
                <li>Research Tools</li>
                <li>Data Sources</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Academic</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Methodology</li>
                <li>Publications</li>
                <li>Peer Review</li>
                <li>Collaborations</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Tutorials</li>
                <li>Community</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#2A2A2C] pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 LOGOS. Advancing Classical Scholarship Through Technology.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>CTS/URN Compliant</span>
              <span>•</span>
              <span>Peer-Review Compatible</span>
              <span>•</span>
              <span>Open Standards</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}