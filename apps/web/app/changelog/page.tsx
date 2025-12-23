import React from 'react';
import { Calendar, Code, Zap, Brain, Search, Globe, Archive, Sparkles, Database, Network } from 'lucide-react';

const ChangelogPage = () => {
  const releases = [
    {
      version: "2.0",
      date: "December 2024",
      status: "Latest",
      statusColor: "bg-[#C9A227]",
      title: "CHRONOS Engine & Advanced Analytics",
      description: "Revolutionary temporal analysis and multi-layered historical insights",
      features: [
        {
          icon: <Zap className="w-4 h-4" />,
          title: "CHRONOS Engine",
          description: "Advanced temporal analysis engine for historical event mapping and chronological insights"
        },
        {
          icon: <Archive className="w-4 h-4" />,
          title: "Ghost Resurrection Technology",
          description: "AI-powered reconstruction of fragmented texts and missing historical documents"
        },
        {
          icon: <Brain className="w-4 h-4" />,
          title: "5-Layer Analysis System",
          description: "Political, Economic, Social, Religious, and Intellectual context analysis"
        },
        {
          icon: <Network className="w-4 h-4" />,
          title: "Enhanced Intertextuality",
          description: "Expanded to 500,000+ cross-textual connections with confidence scoring"
        },
        {
          icon: <Code className="w-4 h-4" />,
          title: "API v2.0",
          description: "Complete API overhaul with GraphQL support and real-time capabilities"
        }
      ],
      improvements: [
        "40% faster search performance",
        "New interactive timeline visualizations",
        "Advanced filtering by evidence reliability",
        "Multi-language parallel text display",
        "Enhanced mobile experience"
      ]
    },
    {
      version: "1.5",
      date: "August 2024",
      status: "Stable",
      statusColor: "bg-[#3B82F6]",
      title: "SEMANTIA Launch & Semantic Embeddings",
      description: "Massive expansion of semantic search capabilities and corpus analysis",
      features: [
        {
          icon: <Brain className="w-4 h-4" />,
          title: "SEMANTIA Engine",
          description: "Advanced semantic analysis system for conceptual text exploration"
        },
        {
          icon: <Database className="w-4 h-4" />,
          title: "892K Semantic Embeddings",
          description: "Comprehensive semantic mapping of classical texts and concepts"
        },
        {
          icon: <Search className="w-4 h-4" />,
          title: "Concept-Based Search",
          description: "Search by ideas and themes rather than just keywords"
        },
        {
          icon: <Network className="w-4 h-4" />,
          title: "Thematic Clustering",
          description: "Automatic grouping of related passages and concepts"
        }
      ],
      improvements: [
        "300% improvement in semantic search accuracy",
        "New concept visualization tools",
        "Enhanced cross-linguistic search",
        "Improved text annotation system",
        "Better performance on large queries"
      ]
    },
    {
      version: "1.0",
      date: "March 2024",
      status: "Foundation",
      statusColor: "bg-[#059669]",
      title: "Initial Release",
      description: "Launch of the world's largest searchable classical corpus",
      features: [
        {
          icon: <Search className="w-4 h-4" />,
          title: "Advanced Search Engine",
          description: "Full-text search across 1.7+ million passages with morphological analysis"
        },
        {
          icon: <Globe className="w-4 h-4" />,
          title: "Multi-Language Support",
          description: "Greek, Latin, Hebrew, Syriac, Coptic, and Arabic text processing"
        },
        {
          icon: <Database className="w-4 h-4" />,
          title: "Comprehensive Corpus",
          description: "Complete digitization of classical texts from Archaic to Byzantine periods"
        },
        {
          icon: <Code className="w-4 h-4" />,
          title: "Translation Engine",
          description: "AI-assisted translation with contextual accuracy verification"
        }
      ],
      improvements: [
        "Launch of core text database",
        "Basic semantic search functionality",
        "User authentication and profiles",
        "Export and citation tools",
        "Initial API endpoints"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="border-b border-[#1E1E24] bg-[#1E1E24]/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/30">
              <Calendar className="w-6 h-6 text-[#C9A227]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#F5F4F2]">Changelog</h1>
              <p className="text-[#F5F4F2]/70 mt-1">Track LOGOS platform updates and improvements</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C9A227]"></div>
              <span className="text-[#F5F4F2]/70">Latest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-[#F5F4F2]/70">Stable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#059669]"></div>
              <span className="text-[#F5F4F2]/70">Foundation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Changelog Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-12">
          {releases.map((release, index) => (
            <div key={release.version} className="relative">
              {/* Timeline Line */}
              {index !== releases.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-[#1E1E24]"></div>
              )}
              
              {/* Release Card */}
              <div className="relative bg-[#1E1E24]/50 border border-[#1E1E24] rounded-xl p-8">
                {/* Timeline Dot */}
                <div className={`absolute -left-2 top-8 w-4 h-4 ${release.statusColor} rounded-full border-4 border-[#0D0D0F]`}></div>
                
                {/* Version Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-[#C9A227]">v{release.version}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-black ${release.statusColor}`}>
                        {release.status}
                      </span>
                    </div>
                    <div className="h-6 w-px bg-[#1E1E24]"></div>
                    <span className="text-[#F5F4F2]/70 text-sm">{release.date}</span>
                  </div>
                  
                  {release.status === "Latest" && (
                    <div className="flex items-center gap-2 text-[#C9A227]">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm font-medium">New</span>
                    </div>
                  )}
                </div>

                {/* Release Title & Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-[#F5F4F2] mb-2">{release.title}</h2>
                  <p className="text-[#F5F4F2]/70">{release.description}</p>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-[#F5F4F2] mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#C9A227]" />
                    New Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {release.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="p-4 rounded-lg bg-[#0D0D0F]/50 border border-[#1E1E24]">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-[#C9A227]/20 text-[#C9A227] mt-0.5">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-[#F5F4F2] mb-1">{feature.title}</h4>
                            <p className="text-sm text-[#F5F4F2]/70">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div>
                  <h3 className="text-lg font-medium text-[#F5F4F2] mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                    Improvements & Updates
                  </h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {release.improvements.map((improvement, improvementIndex) => (
                      <div key={improvementIndex} className="flex items-center gap-3 p-3 rounded-lg bg-[#0D0D0F]/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div>
                        <span className="text-sm text-[#F5F4F2]/80">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 rounded-xl bg-[#1E1E24]/30 border border-[#1E1E24] text-center">
          <p className="text-[#F5F4F2]/60 text-sm">
            Stay updated with LOGOS development by following our 
            <span className="text-[#C9A227] mx-1">release notes</span>
            and joining our community discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangelogPage;