'use client'

import { Calendar, Tag, ChevronRight, BookOpen, Search, Zap, Eye, TrendingUp } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Introducing SEMANTIA",
    excerpt: "Our new semantic analysis engine brings unprecedented insight to ancient texts, revealing hidden patterns and connections across millennia of human thought.",
    date: "December 15, 2024",
    category: "Product Updates",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "AI Found Patterns in Homer",
    excerpt: "Machine learning algorithms have uncovered recurring thematic structures in the Iliad and Odyssey that suggest deeper compositional techniques.",
    date: "November 28, 2024",
    category: "Research",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 3,
    title: "The Ghost Texts Project",
    excerpt: "Reconstructing lost works through fragment analysis and computational linguistics. How we're bringing ancient voices back from silence.",
    date: "October 12, 2024",
    category: "Digital Humanities",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 4,
    title: "5 Ways LOGOS Changes Research",
    excerpt: "From automated text analysis to cross-linguistic comparison, discover how our platform transforms classical scholarship workflows.",
    date: "September 8, 2024",
    category: "How-To",
    readTime: "4 min read",
    featured: false
  }
]

const categories = ["All", "Product Updates", "Research", "Digital Humanities", "How-To"]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Product Updates": return <Zap className="w-3 h-3" />
    case "Research": return <Search className="w-3 h-3" />
    case "Digital Humanities": return <BookOpen className="w-3 h-3" />
    case "How-To": return <TrendingUp className="w-3 h-3" />
    default: return <Eye className="w-3 h-3" />
  }
}

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="border-b border-[#1E1E24]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-4">
            LOGOS <span className="text-[#C9A227]">Blog</span>
          </h1>
          <p className="text-lg text-[#F5F4F2]/70 max-w-2xl">
            Insights from the intersection of ancient wisdom and modern technology. 
            Exploring how AI transforms our understanding of classical texts.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Categories Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  category === "All"
                    ? "bg-[#C9A227] text-[#0D0D0F]"
                    : "bg-[#1E1E24] text-[#F5F4F2]/70 hover:bg-[#1E1E24]/80 hover:text-[#F5F4F2]"
                }`}
              >
                {category !== "All" && getCategoryIcon(category)}
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1 h-6 bg-[#C9A227]"></div>
            Featured Posts
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts.filter(post => post.featured).map((post) => (
              <article
                key={post.id}
                className="group bg-[#1E1E24] rounded-xl overflow-hidden border border-[#1E1E24] hover:border-[#C9A227]/30 transition-all duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                      {getCategoryIcon(post.category)}
                      {post.category}
                    </span>
                    <span className="text-[#F5F4F2]/50 text-sm flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-[#C9A227] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#F5F4F2]/70 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#F5F4F2]/50 text-sm">{post.readTime}</span>
                    <button className="flex items-center gap-2 text-[#C9A227] hover:gap-3 transition-all duration-200">
                      <span className="text-sm font-medium">Read More</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <div className="w-1 h-6 bg-[#C9A227]"></div>
            All Posts
          </h2>
          
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-[#1E1E24] rounded-xl p-6 border border-[#1E1E24] hover:border-[#C9A227]/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20">
                        {getCategoryIcon(post.category)}
                        {post.category}
                      </span>
                      <span className="text-[#F5F4F2]/50 text-sm flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="text-[#F5F4F2]/50 text-sm">{post.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#C9A227] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-[#F5F4F2]/70 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  
                  <button className="flex items-center gap-2 text-[#C9A227] hover:gap-3 transition-all duration-200 lg:ml-6">
                    <span className="text-sm font-medium">Read More</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-[#1E1E24] text-[#F5F4F2] rounded-lg border border-[#C9A227]/20 hover:border-[#C9A227]/40 hover:bg-[#1E1E24]/80 transition-all duration-200">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  )
}