```tsx
'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Menu, Moon, Sun, Star, Check, BookOpen, Users, GraduationCap, Edit, Search, Database, Globe } from 'lucide-react'

export default function LogosLandingPage() {
  const [isDark, setIsDark] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [email, setEmail] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const greekLetters = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω']

  const testimonials = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Professor of Classical Studies, Harvard",
      content: "LOGOS has revolutionized how I approach ancient texts. The search capabilities are unparalleled.",
      rating: 5
    },
    {
      name: "Rev. Michael Chen",
      role: "Senior Pastor, Grace Community",
      content: "An indispensable tool for sermon preparation. The cross-references save me hours of research.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "PhD Student, Yale Divinity",
      content: "The student pricing makes this incredible resource accessible. My dissertation wouldn't be possible without it.",
      rating: 5
    }
  ]

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Advanced Search",
      description: "Semantic search across all texts with morphological analysis and cross-references."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Vast Library",
      description: "Access to patristic texts, biblical commentaries, and classical literature in original languages."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-language",
      description: "Original Greek, Latin, Hebrew, and Aramaic texts with scholarly translations."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Smart Annotations",
      description: "AI-powered insights and connections between texts, authors, and theological concepts."
    }
  ]

  const demographics = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Scholars & Researchers",
      description: "Advanced tools for academic research with citation management and collaborative features.",
      features: ["Morphological analysis", "Manuscript comparisons", "Citation export", "Collaboration tools"]
    },
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Students",
      description: "Learn classical languages with interactive tools and guided study paths.",
      features: ["Interactive parsing", "Study guides", "Progress tracking", "Student pricing"]
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Pastors & Clergy",
      description: "Prepare sermons with confidence using comprehensive biblical and patristic resources.",
      features: ["Sermon builder", "Cross-references", "Homily suggestions", "Weekly insights"]
    },
    {
      icon: <Edit className="w-12 h-12" />,
      title: "Writers & Authors",
      description: "Access authentic sources and historical context for your writing projects.",
      features: ["Historical context", "Quote verification", "Source attribution", "Content inspiration"]
    }
  ]

  useEffect(() => {
    if (isDark) {
      document.documentElement.style.setProperty('--color-primary', '#8B2635')
      document.documentElement.style.setProperty('--color-secondary', '#C9A227')
      document.documentElement.style.setProperty('--color-background', '#1a1a1a')
      document.documentElement.style.setProperty('--color-surface', '#2d2d2d')
      document.documentElement.style.setProperty('--color-text', '#F8F6F3')
    } else {
      document.documentElement.style.setProperty('--color-primary', '#8B2635')
      document.documentElement.style.setProperty('--color-secondary', '#C9A227')
      document.documentElement.style.setProperty('--color-background', '#F8F6F3')
      document.documentElement.style.setProperty('--color-surface', '#ffffff')
      document.documentElement.style.setProperty('--color-text', '#2d2d2d')
    }
  }, [isDark])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    console.log('Email submitted:', email)
    setShowEmailModal(false)
    setEmail('')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900 text-gray-100' : 'bg-stone-50 text-gray-900'}`}>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 8s ease-in-out infinite 2s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(5deg); opacity: 0.7; }
        }
        
        .crimson { font-family: 'Crimson Pro', serif; }
        .inter { font-family: 'Inter', sans-serif; }
        
        .bg-primary { background-color: #8B2635; }
        .bg-secondary { background-color: #C9A227; }
        .text-primary { color: #8B2635; }
        .text-secondary { color: #C9A227; }
        .border-primary { border-color: #8B2635; }
        .border-secondary { border-color: #C9A227; }
        
        .hero-gradient {
          background: linear-gradient(135deg, #8B2635 0%, #C9A227 100%);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(139, 38, 53, 0.15);
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isDark ? 'bg-gray-900/90 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold crimson text-primary">ΛΟΓΟΣ</div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="inter text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="inter text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#testimonials" className="inter text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowEmailModal(true)}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all inter font-medium"
              >
                Get Started
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="px-4 py-3 space-y-3">
              <a href="#features" className="block inter text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="block inter text-sm font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#testimonials" className="block inter text-sm font-medium hover:text-primary transition-colors">Testimonials</a>
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all inter font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Floating Greek Letters */}
        <div className="absolute inset-0 pointer-events-none">
          {greekLetters.map((letter, index) => (
            <div
              key={index}
              className={`absolute text-6xl text-secondary opacity-20 select-none ${
                index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'
              }`}
              style={{
                left: `${(index * 7) % 100}%`,
                top: `${(index * 13) % 100}%`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="crimson text-5xl md:text-7xl font-bold mb-8">
            <span className="text-primary">Classical Research</span><br />
            <span className="text-secondary">Reimagined</span>
          </h1>
          
          <p className="inter text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
            Access the world's most comprehensive collection of patristic texts, biblical commentaries, 
            and classical literature with cutting-edge search and analysis tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowEmailModal(true)}
              className="hero-gradient text-white px-8 py-4 rounded-full hover:shadow-2xl transition-all inter font-semibold text-lg transform hover:scale-105"
            >
              Start Your Research
            </button>
            <a
              href="#features"
              className={`px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all inter font-semibold text-lg`}
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary crimson mb-2">1.7M+</div>
              <div className="inter text-lg opacity-80">Passages</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-secondary crimson mb-2">140M+</div>
              <div className="inter text-lg opacity-80">Words</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary crimson mb-2">400+</div>
              <div className="inter text-lg opacity-80">Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="crimson text-4xl md:text-5xl font-bold mb-4 text-primary">
              Powerful Research Tools
            </h2>
            <p className="inter text-xl opacity-80 max-w-3xl mx-auto">
              Discover connections across millennia of human thought with our advanced analytical platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-hover p-8 rounded-2xl text-center ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } transition-colors`}
              >
                <div className="text-secondary mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="crimson text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="inter text-sm opacity-80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demographics Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="crimson text-4xl md:text-5xl font-bold mb-4 text-primary">
              Built for Every Scholar
            </h2>
            <p className="inter text-xl opacity-80 max-w-3xl mx-auto">
              Whether you're writing your dissertation or preparing Sunday's sermon, LOGOS adapts to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {demographics.map((demo, index) => (
              <div
                key={index}
                className={`card-hover p-8 rounded-2xl ${
                  isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white border border-gray-200'
                } transition-colors`}
              >
                <div className="flex items-start space-x-6">
                  <div className="text-secondary flex-shrink-0">
                    {demo.icon}
                  </div>
                  <div>
                    <h3 className="crimson text-2xl font-semibold mb-3">{demo.title}</h3>
                    <p className="inter text-base opacity-80 mb-4 leading-relaxed">{demo.description}</p>
                    <ul className="space-y-2">
                      {demo.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 inter text-sm">
                          <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="crimson text-4xl md:text-5xl font-bold mb-4 text-primary">
              Trusted by Scholars Worldwide
            </h2>
          </div>

          <div className="relative">
            <div className={`p-8 rounded-2xl text-center ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } transition-colors`}>
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary fill-current" />
                ))}
              </div>
              
              <blockquote className="inter text-lg md:text-xl mb-6 leading-relaxed italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div>
                <div className="crimson font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="inter text-sm opacity-80">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-primary' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className={`p-2 rounded-full transition-colors ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="crimson text-4xl md:text-5xl font-bold mb-4 text-primary">
              Choose Your Plan
            </h2>
            <p className="inter text-xl opacity-80">
              Start your scholarly journey today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Plan */}
            <div className={`p-8 rounded-2xl border-2 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} transition-colors`}>
              <div className="text-center">
                <h3 className="crimson text-2xl font-bold mb-2">Student</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-secondary">Free</span>
                  <span className="inter text-sm opacity-80 ml-1">with .edu email</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Basic search access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">100+ core texts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Study guides</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Email support</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full border-2 border-primary text-primary py-3 rounded-full hover:bg-primary hover:text-white transition-all inter font-semibold"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Personal Plan */}
            <div className={`p-8 rounded-2xl border-2 border-secondary relative ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors transform scale-105`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-6 py-1 rounded-full inter text-sm font-medium">
                Most Popular
              </div>
              <div className="text-center">
                <h3 className="crimson text-2xl font-bold mb-2">Personal</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-secondary">$9</span>
                  <span className="inter text-sm opacity-80">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Full library access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Advanced search</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Export & citations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Personal notebooks</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Priority support</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full bg-secondary text-white py-3 rounded-full hover:bg-opacity-90 transition-all inter font-semibold"
                >
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Professional Plan */}
            <div className={`p-8 rounded-2xl border-2 ${isDark ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'} transition-colors`}>
              <div className="text-center">
                <h3 className="crimson text-2xl font-bold mb-2">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-secondary">$29</span>
                  <span className="inter text-sm opacity-80">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Everything in Personal</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Collaboration tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">API access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Custom workflows</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-secondary" />
                    <span className="inter text-sm">Phone support</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full border-2 border-primary text-primary py-3 rounded-full hover:bg-primary hover:text-white transition-all inter font-semibold"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 text-white'} border-t transition-colors`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold crimson text-secondary mb-4">ΛΟΓΟΣ</div>
              <p className="inter text-sm opacity-80 leading-relaxed">
                Advancing classical and biblical scholarship through innovative technology.
              </p>
            </div>
            
            <div>
              <h4 className="crimson font-semibold mb-4">Product</h4>
              <ul className="space-y-2 inter text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Features</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Pricing</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">API</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="crimson font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 inter text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Blog</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Tutorials</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Support</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="crimson font-semibold mb-4">Company</h4>
              <ul className="space-y-2 inter text-sm">
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">About</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Careers</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Privacy</a></li>
                <li><a href="#" className="opacity-80 hover:opacity-100 transition-opacity">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-