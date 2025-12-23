'use client';
import React, { useState } from 'react';

export default function About() {
  const [activeLayer, setActiveLayer] = useState(0);

  const methodologyLayers = [
    {
      title: "Textual Analysis",
      description: "Deep linguistic parsing of Greek and Latin manuscripts with morphological and syntactic analysis."
    },
    {
      title: "Historical Contextualization",
      description: "Temporal mapping of texts within their historical periods and cultural frameworks."
    },
    {
      title: "Cross-Reference Integration",
      description: "Intelligent linking between related passages across different authors and time periods."
    },
    {
      title: "Semantic Understanding",
      description: "Advanced comprehension of meaning, metaphor, and literary devices in classical texts."
    },
    {
      title: "Scholarly Synthesis",
      description: "Integration of modern scholarship with AI-generated insights for comprehensive analysis."
    }
  ];

  const corpusData = [
    { source: "Greek Epic Poetry", count: "2,847 texts", period: "8th-3rd Century BCE" },
    { source: "Latin Literature", count: "4,231 texts", period: "3rd Century BCE - 6th Century CE" },
    { source: "Philosophical Treatises", count: "1,892 texts", period: "6th Century BCE - 5th Century CE" },
    { source: "Historical Works", count: "3,156 texts", period: "5th Century BCE - 4th Century CE" },
    { source: "Dramatic Literature", count: "987 texts", period: "5th Century BCE - 2nd Century CE" }
  ];

  const teamMembers = [
    { name: "Dr. Elena Konstantinou", role: "Lead Classical Scholar", specialty: "Ancient Greek Literature" },
    { name: "Prof. Marcus Rivera", role: "AI Research Director", specialty: "Natural Language Processing" },
    { name: "Dr. Sarah Chen", role: "Digital Humanities Lead", specialty: "Computational Philology" },
    { name: "Dr. Alessandro Rossi", role: "Latin Studies Expert", specialty: "Medieval & Renaissance Latin" }
  ];

  const partnerships = [
    { institution: "Oxford Classical Studies", type: "Research Collaboration" },
    { institution: "Harvard Center for Hellenic Studies", type: "Content Partnership" },
    { institution: "Digital Corpus of Sanskrit", type: "Technical Integration" },
    { institution: "Vatican Apostolic Library", type: "Manuscript Digitization" },
    { institution: "Perseus Digital Library", type: "Data Exchange" }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            About Corpus
          </h1>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] p-0.5 rounded-2xl mb-8">
              <div className="bg-[#0D0D0F] rounded-2xl p-12">
                <h2 className="text-3xl font-semibold text-[#C9A227] mb-6">Our Mission</h2>
                <p className="text-2xl leading-relaxed font-light">
                  Democratizing classical scholarship through AI-powered analysis, making ancient wisdom accessible to scholars, students, and curious minds worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Methodology Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#C9A227]">
            Five-Layer Analysis Methodology
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {methodologyLayers.map((layer, index) => (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-500 p-6 rounded-xl border-2 ${
                  activeLayer === index
                    ? 'bg-[#C9A227] border-[#C9A227] text-[#0D0D0F] scale-105'
                    : 'bg-[#1A1A1E] border-[#2A2A2E] hover:border-[#C9A227] hover:scale-102'
                }`}
                onMouseEnter={() => setActiveLayer(index)}
              >
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    activeLayer === index ? 'text-[#0D0D0F]' : 'text-[#C9A227]'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{layer.title}</h3>
                  <p className={`text-sm leading-relaxed ${
                    activeLayer === index ? 'text-[#0D0D0F]' : 'text-[#B5B5B5]'
                  }`}>
                    {layer.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corpus Details */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#C9A227]">
            Our Comprehensive Corpus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corpusData.map((item, index) => (
              <div
                key={index}
                className="bg-[#1A1A1E] p-8 rounded-xl border border-[#2A2A2E] hover:border-[#C9A227] transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-4 text-[#C9A227]">{item.source}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#B5B5B5]">Texts:</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#B5B5B5]">Period:</span>
                    <span className="font-semibold text-sm">{item.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <div className="inline-block bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] p-0.5 rounded-full">
              <div className="bg-[#0D0D0F] px-8 py-4 rounded-full">
                <span className="text-2xl font-bold text-[#C9A227]">13,113</span>
                <span className="text-lg ml-2">Total Classical Texts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#C9A227]">
            Our Expert Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[#1A1A1E] p-6 rounded-xl border border-[#2A2A2E] hover:border-[#C9A227] transition-all duration-300 hover:scale-105 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#C9A227] to-[#F5F4F2] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#0D0D0F]">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#F5F4F2]">{member.name}</h3>
                <p className="text-[#C9A227] font-medium mb-2">{member.role}</p>
                <p className="text-[#B5B5B5] text-sm">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Partnerships */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#C9A227]">
            Academic Partnerships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerships.map((partner, index) => (
              <div
                key={index}
                className="bg-[#1A1A1E] p-6 rounded-xl border border-[#2A2A2E] hover:border-[#C9A227] transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-lg font-semibold mb-3 text-[#F5F4F2]">{partner.institution}</h3>
                <span className="inline-block bg-[#C9A227] text-[#0D0D0F] px-3 py-1 rounded-full text-sm font-medium">
                  {partner.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] p-0.5 rounded-2xl">
            <div className="bg-[#0D0D0F] rounded-2xl p-12">
              <h2 className="text-3xl font-bold mb-6 text-[#C9A227]">Join Our Mission</h2>
              <p className="text-xl mb-8 text-[#B5B5B5] max-w-2xl mx-auto">
                Be part of the revolution in classical scholarship. Explore ancient texts with unprecedented depth and accessibility.
              </p>
              <button className="bg-[#C9A227] text-[#0D0D0F] px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/25">
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}