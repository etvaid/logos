'use client';

import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const bgColor = '#0D0D0F';
const textColor = '#F5F4F2';
const accentColor = '#C9A227';

const ApiDocs = () => {
  return (
    <div style={{ backgroundColor: bgColor, color: textColor, fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5em', marginBottom: '20px', color: accentColor }}>
        LOGOS API Documentation
      </h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          1. Getting Started
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          Welcome to the LOGOS API! This platform provides access to a vast collection of classical passages, semantic data, and translation capabilities, all powered by advanced AI. Explore the resources below to get started.
        </p>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          2. Authentication
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          All API requests require an API key. You can obtain a free key with limited usage or upgrade to a paid plan for unlimited access.
        </p>
        <p style={{ lineHeight: '1.6' }}>
          To authenticate, include the <code>X-API-Key</code> header in your requests:
        </p>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {'X-API-Key: YOUR_API_KEY'}
        </SyntaxHighlighter>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          3. Endpoints
        </h2>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          GET /api/search?q=...
        </h3>
        <p style={{ lineHeight: '1.6' }}>
          Searches for passages based on the query parameter <code>q</code>.
        </p>
        <p>
          <b>Example:</b>
        </p>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`curl -H "X-API-Key: YOUR_API_KEY" "https://api.logos.example.com/api/search?q=virtue"`}
        </SyntaxHighlighter>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          GET /api/passage/&#123;id&#125;
        </h3>
        <p style={{ lineHeight: '1.6' }}>
          Retrieves a specific passage by its ID.
        </p>
        <p>
          <b>Example:</b>
        </p>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`curl -H "X-API-Key: YOUR_API_KEY" "https://api.logos.example.com/api/passage/12345"`}
        </SyntaxHighlighter>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          GET /api/semantia/&#123;word&#125;
        </h3>
        <p style={{ lineHeight: '1.6' }}>
          Retrieves semantic information about a given word.
        </p>
        <p>
          <b>Example:</b>
        </p>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`curl -H "X-API-Key: YOUR_API_KEY" "https://api.logos.example.com/api/semantia/love"`}
        </SyntaxHighlighter>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          POST /api/translate
        </h3>
        <p style={{ lineHeight: '1.6' }}>
          Translates text to another language. Requires a JSON payload with <code>text</code> and <code>targetLanguage</code> fields.
        </p>
        <p>
          <b>Example:</b>
        </p>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`curl -X POST \\
-H "X-API-Key: YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"text": "Amor vincit omnia", "targetLanguage": "en"}' \\
"https://api.logos.example.com/api/translate"`}
        </SyntaxHighlighter>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          4. Code Examples
        </h2>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          Python
        </h3>
        <SyntaxHighlighter language="python" style={atomDark}>
          {`import requests

url = "https://api.logos.example.com/api/search?q=virtue"
headers = {"X-API-Key": "YOUR_API_KEY"}

response = requests.get(url, headers=headers)

print(response.json())`}
        </SyntaxHighlighter>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          JavaScript
        </h3>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {`const url = "https://api.logos.example.com/api/search?q=virtue";
const headers = {"X-API-Key": "YOUR_API_KEY"};

fetch(url, { headers })
  .then(response => response.json())
  .then(data => console.log(data));`}
        </SyntaxHighlighter>

        <h3 style={{ fontSize: '1.4em', marginBottom: '5px', color: accentColor }}>
          cURL
        </h3>
        <SyntaxHighlighter language="bash" style={atomDark}>
          {`curl -H "X-API-Key: YOUR_API_KEY" "https://api.logos.example.com/api/search?q=virtue"`}
        </SyntaxHighlighter>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          5. Rate Limits
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          The free tier is limited to 100 requests per minute. For unlimited access, please upgrade to a paid plan.
        </p>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '10px', borderBottom: '1px solid #444' }}>
          6. Response Formats
        </h2>
        <p style={{ lineHeight: '1.6' }}>
          All API responses are returned in JSON format.  The structure may vary depending on the endpoint.  Refer to the endpoint descriptions for specifics.
        </p>
      </section>
    </div>
  );
};

export default ApiDocs;