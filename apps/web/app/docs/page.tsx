'use client';
import React, { useState } from 'react';

export default function LogosAPIDocumentation() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedEndpoint, setSelectedEndpoint] = useState('search');
  const [tryItInput, setTryItInput] = useState('');
  const [tryItResponse, setTryItResponse] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const codeExamples = {
    search: {
      javascript: `fetch('https://api.logos.ai/v1/search/semantic', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'virtue ethics in ancient philosophy',
    limit: 10,
    context: 'philosophical'
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
      python: `import requests

url = 'https://api.logos.ai/v1/search/semantic'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}
data = {
    'query': 'virtue ethics in ancient philosophy',
    'limit': 10,
    'context': 'philosophical'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
      curl: `curl -X POST "https://api.logos.ai/v1/search/semantic" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "virtue ethics in ancient philosophy",
    "limit": 10,
    "context": "philosophical"
  }'`
    },
    translate: {
      javascript: `fetch('https://api.logos.ai/v1/translate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'γνῶθι σεαυτόν',
    from: 'ancient-greek',
    to: 'english',
    preserve_meaning: true
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
      python: `import requests

url = 'https://api.logos.ai/v1/translate'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}
data = {
    'text': 'γνῶθι σεαυτόν',
    'from': 'ancient-greek',
    'to': 'english',
    'preserve_meaning': True
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
      curl: `curl -X POST "https://api.logos.ai/v1/translate" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "γνῶθι σεαυτόν",
    "from": "ancient-greek",
    "to": "english",
    "preserve_meaning": true
  }'`
    },
    semantia: {
      javascript: `fetch('https://api.logos.ai/v1/semantia/word/wisdom', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
      python: `import requests

url = 'https://api.logos.ai/v1/semantia/word/wisdom'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(url, headers=headers)
print(response.json())`,
      curl: `curl -X GET "https://api.logos.ai/v1/semantia/word/wisdom" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    patterns: {
      javascript: `fetch('https://api.logos.ai/v1/discovery/patterns?domain=philosophy&depth=3', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => response.json())
.then(data => console.log(data));`,
      python: `import requests

url = 'https://api.logos.ai/v1/discovery/patterns'
params = {
    'domain': 'philosophy',
    'depth': 3
}
headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

response = requests.get(url, params=params, headers=headers)
print(response.json())`,
      curl: `curl -X GET "https://api.logos.ai/v1/discovery/patterns?domain=philosophy&depth=3" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    verify: {
      javascript: `fetch('https://api.logos.ai/v1/verify/claim', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    claim: 'Aristotle was a student of Plato',
    context: 'historical',
    sources: ['academic', 'primary']
  })
})
.then(response => response.json())
.then(data => console.log(data));`,
      python: `import requests

url = 'https://api.logos.ai/v1/verify/claim'
headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}
data = {
    'claim': 'Aristotle was a student of Plato',
    'context': 'historical',
    'sources': ['academic', 'primary']
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`,
      curl: `curl -X POST "https://api.logos.ai/v1/verify/claim" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "claim": "Aristotle was a student of Plato",
    "context": "historical",
    "sources": ["academic", "primary"]
  }'`
    }
  };

  const handleTryIt = async () => {
    // Simulate API call
    setTryItResponse({
      status: 200,
      data: {
        results: [
          {
            title: "The Nicomachean Ethics",
            relevance: 0.95,
            excerpt: "Virtue ethics as developed by Aristotle focuses on character rather than actions or consequences...",
            source: "Aristotle, 4th century BCE"
          }
        ]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-blue-400">LOGOS API</div>
              <div className="hidden md:flex space-x-6">
                <a href="#getting-started" className="text-gray-300 hover:text-white transition-colors">Getting Started</a>
                <a href="#endpoints" className="text-gray-300 hover:text-white transition-colors">Endpoints</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Get API Key
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-blue-400">LOGOS</span> API
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Integrate Classical Intelligence
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Access millennia of human wisdom through our advanced AI. Search classical texts, 
            translate ancient languages, analyze philosophical concepts, and verify historical claims.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
              Start Building
            </button>
            <button className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold transition-colors">
              View Examples
            </button>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Getting Started</h2>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">1. Get Your API Key</h3>
            <p className="text-gray-300 mb-4">
              Sign up for a free account to get your API key. You'll get 1,000 free requests per month.
            </p>
            <div className="bg-gray-900 rounded p-4 font-mono text-sm">
              <span className="text-gray-400">Your API Key: </span>
              <span className="text-green-400">logos_sk_1234567890abcdef...</span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">2. Make Your First Request</h3>
            <p className="text-gray-300 mb-4">
              All API requests require authentication using your API key in the Authorization header.
            </p>
            <div className="bg-gray-900 rounded p-4">
              <pre className="text-sm overflow-x-auto">
                <code className="text-green-400">{`curl -X POST "https://api.logos.ai/v1/search/semantic" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "meaning of life", "limit": 5}'`}</code>
              </pre>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">3. Base URL</h3>
            <p className="text-gray-300 mb-4">
              All API endpoints are available at:
            </p>
            <div className="bg-gray-900 rounded p-4 font-mono text-blue-400">
              https://api.logos.ai/v1/
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">API Endpoints</h2>

          {/* Semantic Search */}
          <div className="mb-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-4">POST</span>
                <h3 className="text-2xl font-bold">/api/search/semantic</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Perform semantic search across classical texts and philosophical works.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Request Parameters</h4>
                  <div className="space-y-3">
                    <div className="border-l-2 border-blue-500 pl-4">
                      <div className="font-mono text-sm text-blue-400">query</div>
                      <div className="text-gray-400">Search query string</div>
                    </div>
                    <div className="border-l-2 border-gray-600 pl-4">
                      <div className="font-mono text-sm text-gray-300">limit</div>
                      <div className="text-gray-400">Number of results (max 50)</div>
                    </div>
                    <div className="border-l-2 border-gray-600 pl-4">
                      <div className="font-mono text-sm text-gray-300">context</div>
                      <div className="text-gray-400">Search context (philosophical, historical, etc.)</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Example Response</h4>
                  <div className="bg-gray-900 rounded p-4 text-sm overflow-x-auto">
                    <pre><code className="text-green-400">{`{
  "results": [
    {
      "title": "The Nicomachean Ethics",
      "author": "Aristotle",
      "relevance": 0.95,
      "excerpt": "Virtue ethics...",
      "source": "Book X, Chapter 7"
    }
  ],
  "total": 156,
  "query_time": "0.23s"
}`}</code></pre>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex space-x-2 mb-4">
                  {['javascript', 'python', 'curl'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-4 py-2 rounded text-sm font-mono ${
                        selectedLanguage === lang
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      } transition-colors`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="bg-gray-900 rounded p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-green-400">{codeExamples.search[selectedLanguage]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* AI Translation */}
          <div className="mb-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-4">POST</span>
                <h3 className="text-2xl font-bold">/api/translate</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Translate text between modern and ancient languages with context preservation.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Supported Languages</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-blue-400">Ancient Greek</div>
                    <div className="text-blue-400">Latin</div>
                    <div className="text-blue-400">Sanskrit</div>
                    <div className="text-blue-400">Hebrew</div>
                    <div className="text-blue-400">Arabic</div>
                    <div className="text-blue-400">Chinese (Classical)</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Example Response</h4>
                  <div className="bg-gray-900 rounded p-4 text-sm">
                    <pre><code className="text-green-400">{`{
  "translation": "Know thyself",
  "original": "γνῶθι σεαυτόν",
  "etymology": "From gnosis (knowledge)...",
  "cultural_context": "Delphic maxim...",
  "confidence": 0.98
}`}</code></pre>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="bg-gray-900 rounded p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-green-400">{codeExamples.translate[selectedLanguage]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Word Analysis */}
          <div className="mb-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-4">GET</span>
                <h3 className="text-2xl font-bold">/api/semantia/word/{`{word}`}</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Get deep semantic analysis of words including etymology, philosophical usage, and cultural context.
              </p>

              <div className="mt-8">
                <div className="bg-gray-900 rounded p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-green-400">{codeExamples.semantia[selectedLanguage]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Discovery */}
          <div className="mb-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-mono mr-4">GET</span>
                <h3 className="text-2xl font-bold">/api/discovery/patterns</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Discover higher-order patterns and connections across philosophical and historical domains.
              </p>

              <div className="mt-8">
                <div className="bg-gray-900 rounded p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-green-400">{codeExamples.patterns[selectedLanguage]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Verification */}
          <div className="mb-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex items-center mb-6">
                <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-mono mr-4">POST</span>
                <h3 className="text-2xl font-bold">/api/verify/claim</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Verify historical and philosophical claims against primary sources and scholarly consensus.
              </p>

              <div className="mt-8">
                <div className="bg-gray-900 rounded p-4">
                  <pre className="text-sm overflow-x-auto">
                    <code className="text-green-400">{codeExamples.verify[selectedLanguage]}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Try It Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Try It Out</h2>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Test Semantic Search</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Enter your search query..."
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={tryItInput}
                    onChange={(e) => setTryItInput(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Your API Key"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button
                    onClick={handleTryIt}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Response</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-auto">
                  {tryItResponse ? (
                    <pre className="text-sm text-green-400">
                      {JSON.stringify(tryItResponse, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-gray-500">Response will appear here...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits & Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Rate Limits & Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Rate Limits</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span>Free Tier</span>
                  <span className="text-blue-400">100 req/hour</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span>Pro Tier</span>
                  <span className="text-blue-400">1,000 req/hour</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span>Enterprise</span>
                  <span className="text-blue-400">Custom limits</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Error Handling</h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-red-400">429</span> - Rate limit exceeded</div>
                <div><span className="text-red-400">401</span> - Invalid API key</div>
                <div><span className="text-red-400">400</span> - Bad request</div>
                <div><span className="text-green-400">200</span> - Success</div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Free</h3>
              <div className="text-3xl font-bold mb-2">$0<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• 1,000 requests/month</li>
                <li>• Basic semantic search</li>
                <li>• Translation API</li>
                <li>• Community support</li>
              </ul>
              <button className="w-full py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <div className="text-3xl font-bold mb-2">$49<span className="text-lg font-normal">/month</span></div>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• 50,000 requests/month</li>
                <li>• All API endpoints</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </ul>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Upgrade to Pro
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold mb-2">Custom</div>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>• Unlimited requests</li>
                <li>• Custom integrations</li>
                <li>• Dedicated support</li>
                <li>• SLA guarantees</li>
              </ul>
              <button className="w-full py-3 border border-gray-600 rounded-lg hover:border-gray-500 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">API Reference</a>
                <a href="#" className="block hover:text-white transition-colors">SDKs</a>
                <a href="#" className="block hover:text-white transition-colors">Status</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Developers</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Documentation</a>
                <a href="#" className="block hover:text-white transition-colors">Guides</a>
                <a href="#" className="block hover:text-white transition-colors">Examples</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">About</a>
                <a href="#" className="block hover:text-white transition-colors">Blog</a>
                <a href="#" className="block hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block hover:text-white transition-colors">Community</a>
                <a href="#" className="block hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Logos AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}