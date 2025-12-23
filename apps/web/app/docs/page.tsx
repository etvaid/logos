'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ApiDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string>('')

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => copyToClipboard(code, id)}
          className="p-2 bg-[#1E1E24] hover:bg-[#2A2A32] rounded-lg transition-colors"
        >
          {copiedCode === id ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-[#F5F4F2]" />
          )}
        </button>
      </div>
      <pre className="bg-[#1E1E24] rounded-lg p-4 overflow-x-auto">
        <code className="text-[#F5F4F2] text-sm font-mono">{code}</code>
      </pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <h2 className="font-bold text-lg mb-6 text-[#C9A227]">API Documentation</h2>
              <nav className="space-y-2">
                <a href="#getting-started" className="block py-2 px-3 rounded-lg hover:bg-[#1E1E24] transition-colors">
                  Getting Started
                </a>
                <a href="#authentication" className="block py-2 px-3 rounded-lg hover:bg-[#1E1E24] transition-colors">
                  Authentication
                </a>
                <div className="ml-3 space-y-2">
                  <a href="#search" className="block py-2 px-3 text-sm text-gray-300 hover:text-[#F5F4F2] transition-colors">
                    Search
                  </a>
                  <a href="#translate" className="block py-2 px-3 text-sm text-gray-300 hover:text-[#F5F4F2] transition-colors">
                    Translate
                  </a>
                  <a href="#semantia" className="block py-2 px-3 text-sm text-gray-300 hover:text-[#F5F4F2] transition-colors">
                    Semantia
                  </a>
                  <a href="#stats" className="block py-2 px-3 text-sm text-gray-300 hover:text-[#F5F4F2] transition-colors">
                    Statistics
                  </a>
                </div>
                <a href="#examples" className="block py-2 px-3 rounded-lg hover:bg-[#1E1E24] transition-colors">
                  Code Examples
                </a>
                <a href="#rate-limits" className="block py-2 px-3 rounded-lg hover:bg-[#1E1E24] transition-colors">
                  Rate Limits
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            {/* Getting Started */}
            <section id="getting-started">
              <h1 className="text-4xl font-bold mb-6 text-[#C9A227]">API Documentation</h1>
              <p className="text-xl text-gray-300 mb-8">
                The LOGOS API provides access to ancient Greek and Latin texts, translations, and linguistic analysis.
              </p>
              
              <div className="bg-[#1E1E24] rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Base URL</h3>
                <code className="text-[#C9A227] bg-[#0D0D0F] px-3 py-2 rounded">
                  https://logos-api-production-3270.up.railway.app
                </code>
              </div>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-6">
                <h4 className="font-semibold text-blue-400 mb-2">Note</h4>
                <p className="text-gray-300">
                  All API responses are returned in JSON format. Make sure to include appropriate headers in your requests.
                </p>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-3xl font-bold mb-6">Authentication</h2>
              <p className="text-gray-300 mb-6">
                The LOGOS API uses API keys for authentication. Include your API key in the Authorization header.
              </p>
              
              <CodeBlock
                id="auth-example"
                language="bash"
                code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://logos-api-production-3270.up.railway.app/api/search?q=logos`}
              />

              <div className="mt-6 bg-amber-900/20 border border-amber-700/30 rounded-lg p-6">
                <h4 className="font-semibold text-amber-400 mb-2">API Key Required</h4>
                <p className="text-gray-300">
                  Contact our team to obtain an API key for production use. Development endpoints may be available without authentication.
                </p>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-3xl font-bold mb-8">Endpoints</h2>

              {/* Search Endpoint */}
              <div id="search" className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono">GET</span>
                  <h3 className="text-2xl font-bold">Search Texts</h3>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Search through ancient texts with support for Greek and Latin queries.
                </p>

                <div className="bg-[#1E1E24] rounded-lg p-4 mb-6">
                  <code className="text-[#C9A227]">GET /api/search?q={`{query}`}&lang={`{language}`}&era={`{era}`}</code>
                </div>

                <h4 className="font-semibold mb-4">Parameters</h4>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border border-gray-700 rounded-lg">
                    <thead className="bg-[#1E1E24]">
                      <tr>
                        <th className="text-left p-4 border-b border-gray-700">Parameter</th>
                        <th className="text-left p-4 border-b border-gray-700">Type</th>
                        <th className="text-left p-4 border-b border-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="p-4"><code className="text-[#C9A227]">q</code></td>
                        <td className="p-4">string</td>
                        <td className="p-4">Search query (required)</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-4"><code className="text-[#C9A227]">lang</code></td>
                        <td className="p-4">string</td>
                        <td className="p-4">Language filter: "greek", "latin"</td>
                      </tr>
                      <tr>
                        <td className="p-4"><code className="text-[#C9A227]">era</code></td>
                        <td className="p-4">string</td>
                        <td className="p-4">Era filter: "archaic", "classical", "hellenistic", "imperial", "lateAntique", "byzantine"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="font-semibold mb-4">Example Response</h4>
                <CodeBlock
                  id="search-response"
                  language="json"
                  code={`{
  "results": [
    {
      "id": "plato-republic-1",
      "title": "The Republic",
      "author": "Plato",
      "text": "ὁ λόγος περὶ δικαιοσύνης...",
      "translation": "The discourse about justice...",
      "language": "greek",
      "era": "classical",
      "relevance": 0.95
    }
  ],
  "total": 1,
  "page": 1,
  "hasMore": false
}`}
                />
              </div>

              {/* Translate Endpoint */}
              <div id="translate" className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono">POST</span>
                  <h3 className="text-2xl font-bold">Translate Text</h3>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Translate ancient Greek or Latin text to modern English.
                </p>

                <div className="bg-[#1E1E24] rounded-lg p-4 mb-6">
                  <code className="text-[#C9A227]">POST /api/translate</code>
                </div>

                <h4 className="font-semibold mb-4">Request Body</h4>
                <CodeBlock
                  id="translate-request"
                  language="json"
                  code={`{
  "text": "λόγος ἐστὶν ὁ θεός",
  "from": "greek",
  "to": "english"
}`}
                />

                <h4 className="font-semibold mb-4 mt-6">Example Response</h4>
                <CodeBlock
                  id="translate-response"
                  language="json"
                  code={`{
  "originalText": "λόγος ἐστὶν ὁ θεός",
  "translatedText": "The Word is God",
  "confidence": 0.92,
  "alternatives": [
    "Logic is God",
    "Reason is divine"
  ],
  "grammaticalAnalysis": {
    "words": [
      {
        "word": "λόγος",
        "lemma": "λόγος",
        "pos": "noun",
        "case": "nominative",
        "gender": "masculine"
      }
    ]
  }
}`}
                />
              </div>

              {/* Semantia Endpoint */}
              <div id="semantia" className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono">GET</span>
                  <h3 className="text-2xl font-bold">Word Analysis</h3>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Get detailed semantic and etymological analysis of ancient words.
                </p>

                <div className="bg-[#1E1E24] rounded-lg p-4 mb-6">
                  <code className="text-[#C9A227]">GET /api/semantia/{`{word}`}</code>
                </div>

                <h4 className="font-semibold mb-4">Example Response</h4>
                <CodeBlock
                  id="semantia-response"
                  language="json"
                  code={`{
  "word": "λόγος",
  "lemma": "λόγος",
  "language": "greek",
  "definitions": [
    "word, speech, account",
    "reason, explanation",
    "proportion, ratio"
  ],
  "etymology": {
    "root": "λεγ-",
    "meaning": "to gather, choose, speak",
    "cognates": ["Latin: legere", "English: logic"]
  },
  "morphology": {
    "partOfSpeech": "noun",
    "gender": "masculine",
    "declension": "second"
  },
  "usage": {
    "frequency": "very high",
    "contexts": ["philosophy", "rhetoric", "theology"],
    "authors": ["Plato", "Aristotle", "John the Evangelist"]
  }
}`}
                />
              </div>

              {/* Stats Endpoint */}
              <div id="stats" className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono">GET</span>
                  <h3 className="text-2xl font-bold">Statistics</h3>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Get corpus statistics and metadata.
                </p>

                <div className="bg-[#1E1E24] rounded-lg p-4 mb-6">
                  <code className="text-[#C9A227]">GET /api/stats</code>
                </div>

                <h4 className="font-semibold mb-4">Example Response</h4>
                <CodeBlock
                  id="stats-response"
                  language="json"
                  code={`{
  "corpus": {
    "totalTexts": 1247,
    "totalWords": 2847392,
    "totalAuthors": 156
  },
  "languages": {
    "greek": {
      "texts": 892,
      "words": 1923847
    },
    "latin": {
      "texts": 355,
      "words": 923545
    }
  },
  "eras": {
    "archaic": 23,
    "classical": 445,
    "hellenistic": 287,
    "imperial": 312,
    "lateAntique": 134,
    "byzantine": 46
  }
}`}
                />
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples">
              <h2 className="text-3xl font-bold mb-8">Code Examples</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">cURL</h3>
                  <CodeBlock
                    id="curl-example"
                    language="bash"
                    code={`# Search for texts
curl "https://logos-api-production-3270.up.railway.app/api/search?q=logos&lang=greek" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Translate text
curl -X POST "https://logos-api-production-3270.up.railway.app/api/translate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "text": "λόγος ἐστὶν ὁ θεός",
    "from": "greek",
    "to": "english"
  }'`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Python</h3>
                  <CodeBlock
                    id="python-example"
                    language="python"
                    code={`import requests

API_BASE = "https://logos-api-production-3270.up.railway.app"
API_KEY = "your_api_key_here"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# Search texts
response = requests.get(
    f"{API_BASE}/api/search",
    params={"q": "logos", "lang": "greek"},
    headers=headers
)
results = response.json()

# Translate text
translate_data = {
    "text": "λόγος ἐστὶν ὁ θεός",
    "from": "greek",
    "to": "english"
}

response = requests.post(
    f"{API_BASE}/api/translate",
    json=translate_data,
    headers=headers
)
translation = response.json()

print(f"Translation: {translation['translatedText']}")`}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">JavaScript</h3>
                  <CodeBlock
                    id="javascript-example"
                    language="javascript"
                    code={`const API_BASE = 'https://logos-api-production-3270.up.railway.app';
const API_KEY = 'your_api_key_here';

const headers = {
  'Authorization': \`Bearer \${API_KEY}\`,
  'Content-Type': 'application/json'
};

// Search texts
async function searchTexts(query, language) {
  const params = new URLSearchParams({ q: query, lang: language });
  const response = await fetch(\`\${API_BASE}/api/search?\${params}\`, {
    headers
  });
  return await response.json();
}

// Translate text
async function translateText(text, from, to) {
  const response = await fetch(\`\${API_BASE}/api/translate\`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ text, from, to })
  });
  return await response.json();
}

// Example usage
searchTexts('logos', 'greek').then(results => {
  console.log('Search results:', results);
});

translateText('λόγος ἐστὶν ὁ θεός', 'greek', 'english').then(result => {
  console.log('Translation:', result.translatedText);
});`}
                  />
                </div>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-3xl font-bold mb-6">Rate Limits</h2>
              
              <p className="text-gray-300 mb-6">
                The LOGOS API enforces rate limits to ensure fair usage and optimal performance for all users.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#1E1E24] rounded-lg p-6">
                  <h4 className="font-semibold text-[#C9A227] mb-2">Free Tier</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 100 requests per hour</li>
                    <li>• 1,000 requests per day</li>
                    <li>• No concurrent requests</li>
                  </ul>
                </div>
                
                <div className="bg-[#1E1E24] rounded-lg p-6">
                  <h4 className="font-semibold text-[#C9A227] mb-2">Pro Tier</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• 1,000 requests per hour</li>
                    <li>• 10,000 requests per day</li>
                    <li>• Up to 5 concurrent requests</li>
                  </ul>
                </div>
              </div>

              <div className="bg-[#1E1E24] rounded-lg p-6">
                <h4 className="font-semibold mb-4">Rate Limit Headers</h4>
                <p className="text-gray-300 mb-4">
                  All API responses include the following headers to help you manage your usage:
                </p>
                <CodeBlock
                  id="rate-limit-headers"
                  language="text"
                  code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1640995200`}
                />
              </div>

              <div className="mt-6 bg-red-900/20 border border-red-700/30 rounded-lg p-6">
                <h4 className="font-semibold text-red-400 mb-2">Rate Limit Exceeded</h4>
                <p className="text-gray-300">
                  When you exceed your rate limit, the API will return a 429 status code. Wait until your limit resets or upgrade your plan.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}