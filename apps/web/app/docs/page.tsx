'use client';

import React, { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/search',
      description: 'Search for words with semantic similarity',
      parameters: [
        { name: 'query', type: 'string', required: true, description: 'Search term' },
        { name: 'limit', type: 'number', required: false, description: 'Maximum results (default: 10)' }
      ]
    },
    {
      method: 'POST',
      path: '/api/translate',
      description: 'Translate text between languages',
      parameters: [
        { name: 'text', type: 'string', required: true, description: 'Text to translate' },
        { name: 'from', type: 'string', required: true, description: 'Source language code' },
        { name: 'to', type: 'string', required: true, description: 'Target language code' }
      ]
    },
    {
      method: 'GET',
      path: '/api/semantia/word/{word}',
      description: 'Get detailed information about a specific word',
      parameters: [
        { name: 'word', type: 'string', required: true, description: 'The word to analyze' }
      ]
    }
  ];

  const codeExamples = {
    search: {
      curl: `curl -X POST https://api.semantia.com/api/search \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "query": "happiness",
    "limit": 5
  }'`,
      python: `import requests

url = "https://api.semantia.com/api/search"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "query": "happiness",
    "limit": 5
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
      javascript: `const response = await fetch('https://api.semantia.com/api/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    query: 'happiness',
    limit: 5
  })
});

const result = await response.json();
console.log(result);`
    },
    translate: {
      curl: `curl -X POST https://api.semantia.com/api/translate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "text": "Hello world",
    "from": "en",
    "to": "es"
  }'`,
      python: `import requests

url = "https://api.semantia.com/api/translate"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "text": "Hello world",
    "from": "en",
    "to": "es"
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`,
      javascript: `const response = await fetch('https://api.semantia.com/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    text: 'Hello world',
    from: 'en',
    to: 'es'
  })
});

const result = await response.json();
console.log(result);`
    },
    word: {
      curl: `curl -X GET https://api.semantia.com/api/semantia/word/happiness \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      python: `import requests

url = "https://api.semantia.com/api/semantia/word/happiness"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
result = response.json()
print(result)`,
      javascript: `const response = await fetch('https://api.semantia.com/api/semantia/word/happiness', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

const result = await response.json();
console.log(result);`
    }
  };

  const navigation = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'examples', label: 'Code Examples' }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            API Documentation
          </h1>
          <p className="text-xl text-[#F5F4F2]/70 max-w-2xl mx-auto">
            Complete reference for integrating with the Semantia API
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-[#C9A227] text-[#0D0D0F] font-semibold'
                        : 'hover:bg-[#F5F4F2]/10 hover:text-[#C9A227]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Getting Started */}
            {activeTab === 'getting-started' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#C9A227] mb-6">Getting Started</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-[#F5F4F2]/80 mb-6">
                      Welcome to the Semantia API! Our powerful semantic search and language processing API
                      enables you to build intelligent applications with natural language understanding.
                    </p>
                    
                    <div className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6 mb-6">
                      <h3 className="text-xl font-semibold text-[#C9A227] mb-4">Base URL</h3>
                      <code className="bg-[#0D0D0F] px-3 py-2 rounded text-[#C9A227]">
                        https://api.semantia.com
                      </code>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-[#C9A227] mb-3">Quick Start</h3>
                        <ol className="list-decimal list-inside space-y-2 text-[#F5F4F2]/80">
                          <li>Sign up for an API key</li>
                          <li>Include your key in requests</li>
                          <li>Make your first API call</li>
                          <li>Start building amazing features</li>
                        </ol>
                      </div>
                      
                      <div className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-[#C9A227] mb-3">Rate Limits</h3>
                        <ul className="space-y-2 text-[#F5F4F2]/80">
                          <li>• Free tier: 1,000 requests/day</li>
                          <li>• Pro tier: 10,000 requests/day</li>
                          <li>• Enterprise: Unlimited</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication */}
            {activeTab === 'authentication' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-[#C9A227] mb-6">Authentication</h2>
                
                <div className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#C9A227] mb-4">API Key Authentication</h3>
                  <p className="text-[#F5F4F2]/80 mb-4">
                    All API requests must include your API key in the Authorization header:
                  </p>
                  
                  <div className="relative bg-[#0D0D0F] rounded-lg p-4 border border-[#F5F4F2]/20">
                    <pre className="text-[#C9A227] overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                      className="absolute top-2 right-2 px-3 py-1 bg-[#C9A227] text-[#0D0D0F] text-sm rounded hover:bg-[#C9A227]/80 transition-colors"
                    >
                      {copiedCode === 'auth' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#C9A227] mb-4">Error Responses</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">401 Unauthorized</h4>
                      <p className="text-[#F5F4F2]/70">Missing or invalid API key</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">429 Too Many Requests</h4>
                      <p className="text-[#F5F4F2]/70">Rate limit exceeded</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Endpoints */}
            {activeTab === 'endpoints' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-[#C9A227] mb-6">API Endpoints</h2>
                
                <div className="space-y-6">
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6 hover:border-[#C9A227]/30 transition-colors">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          endpoint.method === 'GET' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-[#C9A227] font-mono">{endpoint.path}</code>
                      </div>
                      
                      <p className="text-[#F5F4F2]/80 mb-4">{endpoint.description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-[#C9A227] mb-3">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-[#F5F4F2]/20">
                                <th className="text-left py-2 text-[#C9A227]">Name</th>
                                <th className="text-left py-2 text-[#C9A227]">Type</th>
                                <th className="text-left py-2 text-[#C9A227]">Required</th>
                                <th className="text-left py-2 text-[#C9A227]">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.parameters.map((param, paramIndex) => (
                                <tr key={paramIndex} className="border-b border-[#F5F4F2]/10">
                                  <td className="py-2 font-mono">{param.name}</td>
                                  <td className="py-2">{param.type}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      param.required 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {param.required ? 'Required' : 'Optional'}
                                    </span>
                                  </td>
                                  <td className="py-2 text-[#F5F4F2]/70">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Code Examples */}
            {activeTab === 'examples' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-[#C9A227] mb-6">Code Examples</h2>
                
                <div className="space-y-8">
                  {Object.entries(codeExamples).map(([endpoint, examples]) => (
                    <div key={endpoint} className="bg-[#F5F4F2]/5 border border-[#F5F4F2]/20 rounded-lg p-6">
                      <h3 className="text-2xl font-semibold text-[#C9A227] mb-6 capitalize">
                        {endpoint.replace('_', ' ')} Examples
                      </h3>
                      
                      <div className="space-y-6">
                        {Object.entries(examples).map(([lang, code]) => (
                          <div key={lang}>
                            <h4 className="text-lg font-semibold mb-3 capitalize text-[#F5F4F2]">
                              {lang === 'javascript' ? 'JavaScript' : lang}
                            </h4>
                            <div className="relative bg-[#0D0D0F] rounded-lg p-4 border border-[#F5F4F2]/20">
                              <pre className="text-[#C9A227] overflow-x-auto text-sm">
                                <code>{code}</code>
                              </pre>
                              <button
                                onClick={() => copyToClipboard(code, `${endpoint}-${lang}`)}
                                className="absolute top-2 right-2 px-3 py-1 bg-[#C9A227] text-[#0D0D0F] text-sm rounded hover:bg-[#C9A227]/80 transition-colors"
                              >
                                {copiedCode === `${endpoint}-${lang}` ? 'Copied!' : 'Copy'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}