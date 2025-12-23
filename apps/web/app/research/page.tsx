'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, BookOpenIcon, DocumentTextIcon, ArrowDownTrayIcon, BeakerIcon, LinkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

export default function ResearchAssistant() {
  const [query, setQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [expandedSources, setExpandedSources] = useState<number[]>([])
  const [exportFormat, setExportFormat] = useState('pdf')

  const demoQuery = "What did Plato think about democracy?"
  const demoResponse = {
    analysis: `Plato held a deeply critical view of democracy, considering it one of the most flawed forms of government. In the Republic, he presents democracy as the second-worst constitutional form, ranking it just above tyranny in his taxonomy of declining political systems.

**Key criticisms of democracy according to Plato:**

**1. Rule by the Unqualified**
Plato argued that democracy allows unqualified individuals to make decisions about governance. He compared this to allowing anyone to navigate a ship, regardless of their sailing expertise. In his view, political rule should be reserved for philosopher-kings who possess both wisdom and virtue.

**2. Tyranny of Desires**
In Book VIII of the Republic, Plato describes democratic citizens as driven by unnecessary desires and pleasures. He argues that democratic society encourages moral relativism and the pursuit of immediate gratification over long-term virtue and justice.

**3. Pathway to Tyranny**
Plato viewed democracy as inherently unstable and prone to collapse into tyranny. He argued that democratic freedom eventually becomes license, leading to chaos that creates conditions ripe for a tyrant to seize power by promising order.

**4. Lack of Unity**
Democracy, in Plato's analysis, creates internal division and conflict as different groups compete for power and resources, undermining the unity necessary for a just state.`,
    sources: [
      {
        id: 1,
        title: "Republic",
        author: "Plato",
        passage: "Books VIII-IX",
        era: "classical",
        language: "greek",
        relevance: 95,
        excerpt: "And democracy comes into being after the poor have conquered their opponents, slaughtering some and banishing some, while to the remainder they give an equal share of freedom and power...",
        context: "Plato's critique of democratic government in the decline of constitutions"
      },
      {
        id: 2,
        title: "Laws",
        author: "Plato",
        passage: "Book III, 693d-701c",
        era: "classical",
        language: "greek",
        relevance: 78,
        excerpt: "There are two mother-forms of constitution from which all others may truly be said to derive: monarchy and democracy...",
        context: "Discussion of constitutional forms and mixed government"
      },
      {
        id: 3,
        title: "Gorgias",
        author: "Plato",
        passage: "515c-517a",
        era: "classical",
        language: "greek",
        relevance: 72,
        excerpt: "These men whom you regard as good citizens... have filled the city with harbors and dockyards and walls and tribute-money and such stuff, but justice and temperance they have left out...",
        context: "Criticism of Athenian democratic leaders"
      },
      {
        id: 4,
        title: "Statesman",
        author: "Plato",
        passage: "291d-303b",
        era: "classical",
        language: "greek",
        relevance: 69,
        excerpt: "Of the imitations of true government, that which follows laws is better, but that which is without laws is most burdensome...",
        context: "Classification of government types and the rule of law"
      }
    ],
    deepDiveOptions: [
      "Compare Plato's view with Aristotle's analysis of democracy",
      "Examine historical examples of democratic decline that match Plato's predictions",
      "Analyze modern democratic theory responses to Platonic criticisms",
      "Study the influence of Plato's political philosophy on later thinkers",
      "Investigate the relationship between education and democratic citizenship in Plato"
    ]
  }

  const eraColors = {
    archaic: '#D97706',
    classical: '#F59E0B',
    hellenistic: '#3B82F6',
    imperial: '#DC2626',
    lateAntique: '#7C3AED',
    byzantine: '#059669'
  }

  const languageColors = {
    greek: '#3B82F6',
    latin: '#DC2626'
  }

  const handleSearch = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsAnalyzing(false)
    setShowResults(true)
  }

  const useDemoQuery = () => {
    setQuery(demoQuery)
  }

  const toggleSourceExpansion = (sourceId: number) => {
    setExpandedSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleDeepDive = (option: string) => {
    setQuery(option)
    setShowResults(false)
  }

  const handleExport = () => {
    const content = `RESEARCH ANALYSIS\n\nQuery: ${query}\n\n${demoResponse.analysis}\n\nSOURCES:\n${demoResponse.sources.map(s => `${s.author}, ${s.title}, ${s.passage}`).join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `research-analysis.${exportFormat}`
    a.click()
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BeakerIcon className="h-8 w-8 text-[#C9A227]" />
            <h1 className="text-3xl font-bold">Research Assistant</h1>
          </div>
          <p className="text-[#F5F4F2]/70">
            AI-powered analysis of ancient texts and philosophical concepts
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-[#1E1E24] rounded-lg p-6 mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your research question..."
                className="w-full bg-[#0D0D0F] border border-[#F5F4F2]/20 rounded-lg px-4 py-3 text-[#F5F4F2] placeholder-[#F5F4F2]/50 focus:outline-none focus:border-[#C9A227] resize-none h-24"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={useDemoQuery}
              className="text-[#C9A227] hover:text-[#C9A227]/80 text-sm"
            >
              Try demo: "What did Plato think about democracy?"
            </button>

            <button
              onClick={handleSearch}
              disabled={!query.trim() || isAnalyzing}
              className="flex items-center gap-2 bg-[#C9A227] text-[#0D0D0F] px-6 py-2 rounded-lg hover:bg-[#C9A227]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#0D0D0F]/30 border-t-[#0D0D0F] rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-4 w-4" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-8">
            {/* Analysis */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-[#C9A227]" />
                  Analysis
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="bg-[#0D0D0F] border border-[#F5F4F2]/20 rounded px-3 py-1 text-sm"
                  >
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                    <option value="txt">TXT</option>
                  </select>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1 text-[#C9A227] hover:text-[#C9A227]/80 text-sm"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-[#F5F4F2]/90 leading-relaxed">
                  {demoResponse.analysis}
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <BookOpenIcon className="h-5 w-5 text-[#C9A227]" />
                Source Citations ({demoResponse.sources.length})
              </h2>

              <div className="space-y-4">
                {demoResponse.sources.map((source) => (
                  <div key={source.id} className="border border-[#F5F4F2]/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: eraColors[source.era as keyof typeof eraColors] }}
                          />
                          <span 
                            className="w-4 h-4 rounded text-xs font-bold flex items-center justify-center text-white"
                            style={{ backgroundColor: languageColors[source.language as keyof typeof languageColors] }}
                          >
                            {source.language === 'greek' ? 'Α' : 'L'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#F5F4F2]">
                            {source.author}, <em>{source.title}</em>
                          </h3>
                          <p className="text-sm text-[#F5F4F2]/70">{source.passage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#C9A227]">
                            {source.relevance}% relevance
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSourceExpansion(source.id)}
                          className="text-[#F5F4F2]/50 hover:text-[#F5F4F2]"
                        >
                          {expandedSources.includes(source.id) ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedSources.includes(source.id) && (
                      <div className="mt-3 pt-3 border-t border-[#F5F4F2]/10">
                        <div className="bg-[#0D0D0F] rounded p-3 mb-3">
                          <p className="text-sm text-[#F5F4F2]/80 italic">
                            "{source.excerpt}"
                          </p>
                        </div>
                        <p className="text-xs text-[#F5F4F2]/60">
                          <strong>Context:</strong> {source.context}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deep Dive Options */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <LinkIcon className="h-5 w-5 text-[#C9A227]" />
                Deep Dive Options
              </h2>

              <div className="grid gap-3">
                {demoResponse.deepDiveOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleDeepDive(option)}
                    className="text-left p-4 bg-[#0D0D0F] rounded-lg hover:bg-[#0D0D0F]/80 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#F5F4F2] group-hover:text-[#C9A227]">
                        {option}
                      </span>
                      <MagnifyingGlassIcon className="h-4 w-4 text-[#F5F4F2]/50 group-hover:text-[#C9A227]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}