'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Animated counter component
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [target])
  
  return <span>{count.toLocaleString()}{suffix}</span>
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">
            LOGOS
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
            <Link href="/auth/login" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-6 animate-fade-in">
          🎓 Free for Students & Scholars
        </span>
        
        <h1 className="font-serif text-6xl md:text-8xl font-bold text-gold tracking-widest mb-4 animate-slide-up">
          LOGOS
        </h1>
        
        <p className="text-xl md:text-2xl text-marble/80 mb-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          AI-Powered Classical Research
        </p>
        
        <p className="font-greek text-lg text-gold/60 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          λόγος · verbum · word · reason · meaning
        </p>
        
        <p className="max-w-2xl text-marble/60 text-lg mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          The first semantic intelligence layer for the ancient world. Search 69 million words 
          of Greek and Latin by meaning, not just keywords. Find connections no human could discover alone.
        </p>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold stat-number">
              <AnimatedCounter target={69} suffix="M+" />
            </div>
            <div className="text-marble/50 text-sm mt-1">Words Indexed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold stat-number">
              <AnimatedCounter target={1500} suffix="+" />
            </div>
            <div className="text-marble/50 text-sm mt-1">Ancient Texts</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold stat-number">
              <AnimatedCounter target={500} suffix="K+" />
            </div>
            <div className="text-marble/50 text-sm mt-1">Relationships</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-gold">24</div>
            <div className="text-marble/50 text-sm mt-1">AI Tools</div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Link href="/search" className="btn-primary text-lg px-8 py-3">
            Start Researching Free
          </Link>
          <Link href="#demo" className="btn-secondary text-lg px-8 py-3">
            Try Live Demo
          </Link>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-gold text-sm font-medium">Try It Now</span>
          <h2 className="font-serif text-4xl font-bold text-marble mt-2 mb-4">Experience LOGOS</h2>
          <p className="text-marble/60 mb-8">No signup required. Search the entire classical corpus semantically.</p>
          
          <div className="glass rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gold/10">
              <div className="w-3 h-3 rounded-full bg-crimson/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald/50"></div>
            </div>
            <div className="p-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search: 'What is justice?' or 'μῆνιν ἄειδε'"
                className="w-full bg-obsidian-light border border-gold/20 rounded-lg px-4 py-3 text-marble placeholder-marble/30 focus:outline-none focus:border-gold/50 transition-colors"
              />
              {searchQuery && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-obsidian-light rounded-lg border border-gold/10">
                    <p className="font-greek text-gold mb-2">δικαιοσύνη ἐστὶν ἀρετὴ ψυχῆς</p>
                    <p className="text-marble/70">"Justice is a virtue of the soul"</p>
                    <p className="text-marble/40 text-sm mt-2">— Plato, Republic 331c • 94% match</p>
                  </div>
                  <div className="p-4 bg-obsidian-light rounded-lg border border-gold/10">
                    <p className="font-greek text-gold mb-2">Iustitia est constans et perpetua voluntas</p>
                    <p className="text-marble/70">"Justice is the constant and perpetual will to give each their due"</p>
                    <p className="text-marble/40 text-sm mt-2">— Cicero, De Officiis 1.7.23 • 91% match</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-obsidian-light/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-sm font-medium">24 AI-Powered Tools</span>
            <h2 className="font-serif text-4xl font-bold text-marble mt-2">Everything You Need</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Semantic Search', desc: 'Search by meaning across Greek and Latin' },
              { icon: '📝', title: 'AI Translation', desc: '3 styles: Literal, Literary, Student' },
              { icon: '🔗', title: 'Intertextuality', desc: 'Find allusions between texts' },
              { icon: '💡', title: 'Discovery Engine', desc: 'Find patterns humans cannot see' },
              { icon: '🎓', title: 'Research Assistant', desc: 'AI-powered scholarship with citations' },
              { icon: '📖', title: 'Click-Word Parsing', desc: 'Instant morphology and definitions' },
            ].map((feature, i) => (
              <div key={i} className="glass p-6 rounded-xl gold-glow">
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="font-serif text-xl text-gold mb-2">{feature.title}</h3>
                <p className="text-marble/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-gold text-sm font-medium">The Breakthrough</span>
            <h2 className="font-serif text-4xl font-bold text-marble mt-2 mb-4">Higher-Order Discovery</h2>
            <p className="text-marble/60">Find patterns that no human could see</p>
          </div>
          
          <div className="glass rounded-xl p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">1</span>
                <div>
                  <h4 className="text-gold font-medium">First Order</h4>
                  <p className="text-marble/60">Virgil → Homer (everyone knows this)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">2</span>
                <div>
                  <h4 className="text-gold font-medium">Second Order</h4>
                  <p className="text-marble/60">How does Virgil→Homer compare to Lucan→Virgil?</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">3</span>
                <div>
                  <h4 className="text-gold font-medium">Third Order</h4>
                  <p className="text-marble/60">Do certain influence patterns correlate with political context?</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/40 text-gold flex items-center justify-center font-bold">4</span>
                <div>
                  <h4 className="text-gold font-medium">Fourth Order — GENUINE DISCOVERY</h4>
                  <p className="text-marble/60">What does the meta-pattern predict about texts we haven't analyzed?</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-obsidian rounded-lg border border-gold/20">
              <p className="text-sm text-gold font-medium mb-2">Example AI-Generated Hypothesis:</p>
              <p className="text-marble/80 italic">
                "Intertextual concentration (drawing primarily from one source vs. many) correlates with political stance in Latin epic. 
                'Promiscuous' intertextuality signals heterodoxy."
              </p>
              <p className="text-marble/40 text-sm mt-2">Confidence: 79% • Novelty: 0.85 • p &lt; 0.05</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-obsidian-light/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-marble">Simple Pricing</h2>
            <p className="text-marble/60 mt-2">Free for students. Affordable for everyone.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="glass rounded-xl p-8">
              <h3 className="font-serif text-2xl text-marble mb-2">Free</h3>
              <p className="text-4xl font-bold text-gold mb-6">$0</p>
              <ul className="space-y-3 text-marble/70 mb-8">
                <li>✓ 100 searches/month</li>
                <li>✓ 50 translations/month</li>
                <li>✓ Basic parsing</li>
                <li>✓ Community support</li>
              </ul>
              <Link href="/auth/register" className="btn-secondary w-full block text-center">
                Get Started
              </Link>
            </div>
            
            {/* Scholar */}
            <div className="glass rounded-xl p-8 border-2 border-gold relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-obsidian text-sm font-bold px-4 py-1 rounded-full">
                POPULAR
              </span>
              <h3 className="font-serif text-2xl text-marble mb-2">Scholar</h3>
              <p className="text-4xl font-bold text-gold mb-6">$9<span className="text-lg font-normal">/mo</span></p>
              <ul className="space-y-3 text-marble/70 mb-8">
                <li>✓ Unlimited searches</li>
                <li>✓ Unlimited translations</li>
                <li>✓ Discovery Engine</li>
                <li>✓ Research Assistant</li>
                <li>✓ API access</li>
                <li>✓ Priority support</li>
              </ul>
              <Link href="/auth/register?plan=scholar" className="btn-primary w-full block text-center">
                Start Free Trial
              </Link>
            </div>
            
            {/* Student */}
            <div className="glass rounded-xl p-8">
              <h3 className="font-serif text-2xl text-marble mb-2">Student</h3>
              <p className="text-4xl font-bold text-gold mb-6">FREE</p>
              <ul className="space-y-3 text-marble/70 mb-8">
                <li>✓ Everything in Scholar</li>
                <li>✓ Verify with .edu email</li>
                <li>✓ Learning tools</li>
                <li>✓ Flashcards & drills</li>
              </ul>
              <Link href="/auth/register?plan=student" className="btn-secondary w-full block text-center">
                Verify Student Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gold/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <span className="font-serif text-2xl font-bold text-gold">LOGOS</span>
              <p className="text-marble/50 mt-2">AI-Powered Classical Research</p>
            </div>
            <div className="flex gap-8 text-marble/50">
              <Link href="/about" className="hover:text-gold transition-colors">About</Link>
              <Link href="/docs" className="hover:text-gold transition-colors">Docs</Link>
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
              <a href="https://twitter.com/LogosClassics" className="hover:text-gold transition-colors">Twitter</a>
            </div>
          </div>
          <div className="text-center text-marble/30 text-sm mt-12">
            © 2025 LOGOS. Built for classical scholarship.
          </div>
        </div>
      </footer>
    </main>
  )
}
