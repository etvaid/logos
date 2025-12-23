'use client'

import { useState } from 'react'

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              LOGOS Classical Research Platform
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The world's most comprehensive AI-powered platform for classical scholarship, 
              featuring the largest searchable corpus of Greek and Latin texts with 
              revolutionary semantic analysis capabilities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-blue-400 mb-2">1.7M+</div>
            <div className="text-sm text-gray-300">Passages with Semantic Embeddings</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-green-400 mb-2">892K+</div>
            <div className="text-sm text-gray-300">Classical Word Vectors</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-purple-400 mb-2">500K+</div>
            <div className="text-sm text-gray-300">Mapped Intertextual Relationships</div>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-amber-400 mb-2">5-Layer</div>
            <div className="text-sm text-gray-300">Analysis Framework</div>
          </div>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Mission</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              LOGOS democratizes access to the classical world through artificial intelligence, 
              transforming how scholars discover, analyze, and understand Greek and Latin literature. 
              By combining the largest digitized corpus of classical texts with cutting-edge semantic 
              analysis, we enable research methodologies previously impossible at scale.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our platform serves as the bridge between traditional philological methods and 
              modern computational approaches, maintaining scholarly rigor while unlocking 
              new possibilities for literary analysis, historical research, and textual discovery.
            </p>
          </div>
        </section>

        {/* The Corpus */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">The Corpus</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                Greek Texts
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Archaic Period:</strong> Homer, Hesiod, early lyric poetry</li>
                <li>• <strong>Classical:</strong> Complete dramatic, historical, and philosophical works</li>
                <li>• <strong>Hellenistic:</strong> Scientific, mathematical, and literary texts</li>
                <li>• <strong>Roman Period:</strong> Plutarch, Dio Chrysostom, Lucian</li>
                <li>• <strong>Byzantine:</strong> Chronicles, theological works, scholarly commentaries</li>
                <li>• <strong>Patristic:</strong> Complete Greek Church Fathers</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                Latin Texts
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• <strong>Archaic:</strong> Ennius, Plautus, Terence, early inscriptions</li>
                <li>• <strong>Classical:</strong> Cicero, Caesar, Virgil, Ovid, Horace</li>
                <li>• <strong>Silver Age:</strong> Tacitus, Pliny, Martial, Juvenal</li>
                <li>• <strong>Late Antique:</strong> Augustine, Jerome, Ambrose</li>
                <li>• <strong>Medieval:</strong> Scholastic philosophy, chronicles, poetry</li>
                <li>• <strong>Neo-Latin:</strong> Renaissance and early modern scholarship</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">5-Layer Analysis Methodology</h2>
          <p className="text-gray-300 mb-8 text-lg">
            LOGOS employs the only 5-layer analytical framework in classical digital humanities, 
            moving from surface text to deep semantic discovery:
          </p>
          <div className="space-y-4">
            {[
              {
                layer: "Layer 1: Textual",
                description: "Morphological parsing, lemmatization, syntactic analysis using state-of-the-art classical language models",
                color: "blue"
              },
              {
                layer: "Layer 2: Semantic", 
                description: "Word embeddings and contextual meaning derived from 892,000+ classical word vectors trained on our complete corpus",
                color: "green"
              },
              {
                layer: "Layer 3: Relational",
                description: "Automated detection of intertextuality, allusion, and literary borrowing across 500,000+ mapped relationships",
                color: "purple"
              },
              {
                layer: "Layer 4: Truth-Conditional",
                description: "Logical analysis of propositions, argument structures, and philosophical claims within their historical context",
                color: "amber"
              },
              {
                layer: "Layer 5: Discovery",
                description: "AI-powered pattern recognition revealing previously unnoticed connections, influences, and scholarly insights",
                color: "red"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg">
                <button 
                  onClick={() => toggleSection(`layer-${index}`)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center">
                    <span className={`w-3 h-3 bg-${item.color}-400 rounded-full mr-4`}></span>
                    <span className="text-xl font-bold text-white">{item.layer}</span>
                  </div>
                  <span className="text-gray-400 text-xl">
                    {activeSection === `layer-${index}` ? '−' : '+'}
                  </span>
                </button>
                {activeSection === `layer-${index}` && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-300 leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Standards Compliance */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Academic Standards & Compliance</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-3">Citation Standards</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• CTS URN compliant</li>
                  <li>• Traditional references preserved</li>
                  <li>• Peer-review ready citations</li>
                  <li>• MLA/Chicago format export</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-3">Technical Standards</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• TEI XML compatibility</li>
                  <li>• Unicode text encoding</li>
                  <li>• FAIR data principles</li>
                  <li>• API accessibility</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-3">Editorial Standards</h3>
                <ul className="text-gray-300 space-y-1">
                  <li>• Critical edition priority</li>
                  <li>• Apparatus integration</li>
                  <li>• Scholarly annotation</li>
                  <li>• Version control</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SEMANTIA */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">SEMANTIA: Corpus-Derived Lexicography</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              SEMANTIA represents the first comprehensive Greek and Latin lexicon derived entirely 
              from corpus analysis rather than traditional dictionary compilation. By analyzing 
              contextual usage across our complete textual corpus, SEMANTIA challenges 150 years 
              of lexicographical tradition.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-amber-400 mb-4">Revolutionary Approach</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Meaning derived from actual usage patterns</li>
                  <li>• Semantic evolution tracked across periods</li>
                  <li>• Context-dependent definitions</li>
                  <li>• Frequency-based sense ranking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-cyan-400 mb-4">Scholarly Impact</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Reveals previously unnoticed semantic shifts</li>
                  <li>• Challenges traditional etymologies</li>
                  <li>• Provides statistical confidence metrics</li>
                  <li>• Enables diachronic analysis</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Team</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <p className="text-xl text-gray-300 mb-4">
              Built by classicists, for classicists
            </p>
            <p className="text-gray-400">
              Our team combines deep expertise in classical philology with cutting-edge 
              computational methods, ensuring that technological innovation serves 
              scholarly excellence.
            </p>
          </div>
        </section>

        {/* Academic Advisory */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Academic Advisory Board</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-300">
              Leading scholars from institutions worldwide guide LOGOS development, 
              ensuring our platform meets the highest standards of classical scholarship.
            </p>
            <p className="text-sm text-gray-400 mt-4">Advisory board details available upon request</p>
          </div>
        </section>

        {/* Publications */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Research & Publications</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <p className="text-gray-300 mb-4">
              LOGOS methodology and discoveries are documented in peer-reviewed publications 
              and presented at leading academic conferences.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-green-400 mb-2">Used at Institutions:</h3>
                <p className="text-gray-400 text-sm">Researchers at leading universities worldwide</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-400 mb-2">Conference Presentations:</h3>
                <p className="text-gray-400 text-sm">Digital Humanities, SCS Annual Meeting, CAMWS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Academic Collaboration</h2>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
            <p className="text-lg text-gray-300 mb-6">
              We welcome collaboration with scholars, institutions, and research projects 
              advancing the digital future of classical studies.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Contact for Academic Partnerships
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}