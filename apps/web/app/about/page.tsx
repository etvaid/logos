'use client'

import React from 'react'
import { Users, BookOpen, Globe, Award, Heart, Shield } from 'lucide-react'

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#1E1E24] via-[#0D0D0F] to-[#1E1E24] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#C9A227] to-[#F59E0B] bg-clip-text text-transparent">
            About LOGOS
          </h1>
          <p className="text-xl text-[#F5F4F2]/80 max-w-3xl mx-auto leading-relaxed">
            Bridging the ancient and modern worlds through cutting-edge AI technology
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Mission Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-[#C9A227]" />
            <h2 className="text-3xl font-bold">Our Mission</h2>
          </div>
          <div className="bg-[#1E1E24] rounded-2xl p-8 border border-[#C9A227]/20">
            <p className="text-2xl font-medium text-[#C9A227] mb-4">
              Making classical scholarship accessible through AI
            </p>
            <p className="text-lg text-[#F5F4F2]/70 max-w-4xl mx-auto leading-relaxed">
              We believe the wisdom of ancient civilizations should be accessible to everyone. 
              LOGOS combines advanced artificial intelligence with rigorous classical scholarship 
              to break down barriers and open new pathways for discovery in the ancient world.
            </p>
          </div>
        </section>

        {/* The Corpus Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-[#C9A227]" />
              <h2 className="text-3xl font-bold">The Corpus</h2>
            </div>
            <p className="text-lg text-[#F5F4F2]/70 max-w-3xl mx-auto">
              Our comprehensive database spans over two millennia of classical literature
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-[#1E1E24] rounded-xl p-6 text-center border border-[#C9A227]/20">
              <div className="text-4xl font-bold text-[#C9A227] mb-2">1.7M</div>
              <div className="text-lg font-medium mb-2">Passages</div>
              <div className="text-sm text-[#F5F4F2]/60">
                Carefully curated and annotated texts
              </div>
            </div>

            <div className="bg-[#1E1E24] rounded-xl p-6 text-center border border-[#3B82F6]/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  Α
                </span>
                <span className="text-xl font-bold text-[#3B82F6]">Greek</span>
              </div>
              <div className="text-sm text-[#F5F4F2]/60">
                From Homer's epics to Byzantine chronicles
              </div>
            </div>

            <div className="bg-[#1E1E24] rounded-xl p-6 text-center border border-[#DC2626]/20">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[#DC2626] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  L
                </span>
                <span className="text-xl font-bold text-[#DC2626]">Latin</span>
              </div>
              <div className="text-sm text-[#F5F4F2]/60">
                From Plautus to Medieval manuscripts
              </div>
            </div>
          </div>

          {/* Era Timeline */}
          <div className="bg-[#1E1E24] rounded-2xl p-8 border border-[#C9A227]/20">
            <h3 className="text-xl font-bold mb-6 text-center">Historical Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { era: 'Archaic', color: '#D97706', period: '800-480 BCE' },
                { era: 'Classical', color: '#F59E0B', period: '480-323 BCE' },
                { era: 'Hellenistic', color: '#3B82F6', period: '323-146 BCE' },
                { era: 'Imperial', color: '#DC2626', period: '27 BCE-476 CE' },
                { era: 'Late Antique', color: '#7C3AED', period: '284-641 CE' },
                { era: 'Byzantine', color: '#059669', period: '330-1453 CE' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="text-sm font-medium" style={{ color: item.color }}>
                    {item.era}
                  </div>
                  <div className="text-xs text-[#F5F4F2]/50">
                    {item.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Team Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-[#C9A227]" />
            <h2 className="text-3xl font-bold">The Team</h2>
          </div>
          <div className="bg-[#1E1E24] rounded-2xl p-12 border border-[#C9A227]/20">
            <p className="text-lg text-[#F5F4F2]/70 mb-8">
              Our interdisciplinary team combines expertise in classical studies, 
              computational linguistics, and artificial intelligence.
            </p>
            <div className="text-[#C9A227] font-medium">
              Detailed team profiles coming soon
            </div>
          </div>
        </section>

        {/* Advisory Board Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-[#C9A227]" />
            <h2 className="text-3xl font-bold">Advisory Board</h2>
          </div>
          <div className="bg-[#1E1E24] rounded-2xl p-12 border border-[#C9A227]/20">
            <p className="text-lg text-[#F5F4F2]/70 mb-8">
              Distinguished scholars and technologists guide our mission to preserve 
              and democratize classical knowledge.
            </p>
            <div className="text-[#C9A227] font-medium">
              Advisory board announcements coming soon
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Globe className="w-8 h-8 text-[#C9A227]" />
            <h2 className="text-3xl font-bold">Partners</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20">
              <Shield className="w-8 h-8 text-[#C9A227] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-3">Academic Institutions</h3>
              <p className="text-[#F5F4F2]/70 text-sm">
                Collaborating with leading universities and research centers 
                to ensure scholarly accuracy and academic rigor.
              </p>
            </div>
            <div className="bg-[#1E1E24] rounded-xl p-6 border border-[#C9A227]/20">
              <BookOpen className="w-8 h-8 text-[#C9A227] mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-3">Digital Libraries</h3>
              <p className="text-[#F5F4F2]/70 text-sm">
                Working with digital archives and libraries to expand 
                access to primary sources and manuscripts.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-[#C9A227]/10 to-[#F59E0B]/10 rounded-2xl p-12 border border-[#C9A227]/20">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-lg text-[#F5F4F2]/70 mb-6 max-w-2xl mx-auto">
              Whether you're a scholar, educator, student, or enthusiast, 
              we invite you to be part of this journey to make classical knowledge accessible to all.
            </p>
            <div className="text-[#C9A227] font-medium">
              Contact information and collaboration opportunities coming soon
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage