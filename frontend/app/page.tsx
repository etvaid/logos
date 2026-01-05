"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, Clock, Network, Search, Languages, GraduationCap, 
  BookMarked, Wrench, Sparkles, ArrowRight, Github, Twitter
} from 'lucide-react'

const sections = [
  { id: 'semantia', name: 'SEMANTIA', desc: 'Organic Meaning Discovery', icon: Sparkles, color: '#C9A962' },
  { id: 'chronos', name: 'CHRONOS', desc: 'Semantic Time Travel', icon: Clock, color: '#7C9885' },
  { id: 'connectome', name: 'CONNECTOME', desc: 'Living Network of Ideas', icon: Network, color: '#8B7355' },
  { id: 'discovery', name: 'DISCOVERY', desc: 'AI Research Assistant', icon: Search, color: '#C9A962' },
  { id: 'translation', name: 'TRANSLATION', desc: 'Context-Aware Translation', icon: Languages, color: '#7C9885' },
  { id: 'teaching', name: 'TEACHING', desc: 'Pedagogy Engine', icon: GraduationCap, color: '#8B7355' },
  { id: 'reader', name: 'READER', desc: 'Immersive Reading', icon: BookMarked, color: '#C9A962' },
  { id: 'tools', name: 'TOOLS', desc: "Scholar's Workbench", icon: Wrench, color: '#7C9885' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0F] via-[#1a1a1f] to-[#0D0D0F]" />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#C9A962]/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-6">
              <span className="text-[#C9A962]">LOGOS</span>
            </h1>
            <p className="text-2xl md:text-3xl text-[#F5F3EF]/80 mb-4">
              Classical Research Platform
            </p>
            <p className="text-lg text-[#F5F3EF]/60 max-w-2xl mx-auto mb-12">
              Revolutionary AI-powered tools for exploring ancient Greek, Latin, and Hebrew texts.
              1.6 million passages. 1.7 million semantic embeddings. Infinite discoveries.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              href="/discovery"
              className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] font-semibold rounded-lg hover:bg-[#d4b876] transition-colors flex items-center gap-2"
            >
              Start Exploring <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/reader"
              className="px-8 py-4 glass rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" /> Browse Texts
            </Link>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#C9A962]/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#C9A962]/50 rounded-full" />
          </div>
        </motion.div>
      </section>
      
      {/* Sections Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Explore the Platform
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/${section.id}`}>
                  <div className="glass rounded-xl p-6 h-full hover:bg-white/10 transition-all group cursor-pointer">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <section.icon className="w-6 h-6" style={{ color: section.color }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C9A962] transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-[#F5F3EF]/60">
                      {section.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-[#C9A962]/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1.6M', label: 'Passages' },
              { value: '1.7M', label: 'Embeddings' },
              { value: '100+', label: 'Ancient Sites' },
              { value: '500+', label: 'Authors' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-[#C9A962] mb-2">
                  {stat.value}
                </div>
                <div className="text-[#F5F3EF]/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[#F5F3EF]/60">
            © 2024 LOGOS. Built for classical scholarship.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-[#F5F3EF]/60 hover:text-[#C9A962] transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-[#F5F3EF]/60 hover:text-[#C9A962] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
