'use client'

import { useState } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface Citation {
  urn: string
  text: string
  relevance: number
  author: string
  work: string
}

interface ResearchResponse {
  question: string
  answer: string
  citations: Citation[]
  confidence: number
  further_reading: string[]
}

export default function ResearchPage() {
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [response, setResponse] = useState<ResearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<ResearchResponse[]>([])

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/research/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, context: context || undefined, include_citations: true })
      })
      const data = await res.json()
      setResponse(data)
      setHistory(prev => [data, ...prev])
    } catch (err) {
      setResponse({
        question,
        answer: 'Research query failed. Please try again.',
        citations: [],
        confidence: 0,
        further_reading: []
      })
    } finally {
      setLoading(false)
    }
  }

  const sampleQuestions = [
    "How does Virgil's concept of pietas differ from Homer's heroic ideal?",
    "What is the relationship between Stoic philosophy and Roman politics?",
    "How did ancient authors understand the immortality of the soul?",
    "What role does fate play in Greek tragedy versus Roman epic?"
  ]

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold transition-colors">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-gold">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">Research Assistant</h1>
          <p className="text-marble/60">Ask scholarly questions. Get answers with citations to primary sources.</p>
        </div>

        {/* Question Input */}
        <div className="glass rounded-xl p-6 mb-8">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a research question about classical literature, philosophy, or history..."
            className="w-full bg-transparent border-none text-marble text-lg placeholder-marble/30 focus:outline-none resize-none min-h-[100px]"
          />
          
          <div className="border-t border-gold/10 pt-4 mt-4">
            <details className="mb-4">
              <summary className="text-marble/50 text-sm cursor-pointer hover:text-gold">+ Add context (optional)</summary>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add any relevant context, such as specific texts or time periods..."
                className="w-full bg-obsidian-light border border-gold/10 rounded-lg p-3 mt-2 text-marble placeholder-marble/30 focus:outline-none resize-none min-h-[80px]"
              />
            </details>
            
            <div className="flex justify-between items-center">
              <span className="text-marble/50 text-sm">{question.length} characters</span>
              <button
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                className="px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? 'Researching...' : 'Ask Question'}
              </button>
            </div>
          </div>
        </div>

        {/* Sample Questions */}
        {!response && (
          <div className="mb-8">
            <p className="text-marble/50 text-sm mb-3">Try a sample question:</p>
            <div className="space-y-2">
              {sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuestion(q)}
                  className="block w-full text-left px-4 py-3 bg-obsidian-light border border-gold/10 rounded-lg text-marble/70 hover:text-gold hover:border-gold/30 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-serif text-xl text-gold">Answer</h2>
                <span className="text-marble/50 text-sm">{Math.round(response.confidence * 100)}% confidence</span>
              </div>
              <p className="text-marble leading-relaxed whitespace-pre-wrap">{response.answer}</p>
            </div>

            {/* Citations */}
            {response.citations && response.citations.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-serif text-lg text-gold mb-4">Citations</h3>
                <div className="space-y-4">
                  {response.citations.map((citation, i) => (
                    <div key={i} className="bg-obsidian-light rounded-lg p-4 border-l-2 border-gold/50">
                      <p className="font-greek text-gold mb-2">{citation.text}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-marble/60 text-sm">{citation.author}, {citation.work}</span>
                        <span className="text-marble/40 text-sm">{Math.round(citation.relevance * 100)}% relevant</span>
                      </div>
                      <code className="text-marble/30 text-xs mt-1 block">{citation.urn}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Further Reading */}
            {response.further_reading && response.further_reading.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="font-serif text-lg text-gold mb-4">Further Reading</h3>
                <div className="flex flex-wrap gap-2">
                  {response.further_reading.map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-obsidian-light rounded-full text-marble/70 text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* New Question */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResponse(null)
                  setQuestion('')
                }}
                className="text-gold hover:underline"
              >
                Ask another question
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="mt-12">
            <h3 className="font-serif text-lg text-gold mb-4">Previous Questions</h3>
            <div className="space-y-2">
              {history.slice(1).map((item, i) => (
                <button
                  key={i}
                  onClick={() => setResponse(item)}
                  className="block w-full text-left px-4 py-3 bg-obsidian-light border border-gold/10 rounded-lg text-marble/70 hover:text-gold hover:border-gold/30 transition-colors truncate"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
