'use client';

import React from 'react';

const PricingPage = () => {
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Unlock Deeper Insights with Logos</h1>
        <p>Choose the plan that's right for you.</p>
        <p>Stats: 1.7M passages, 892K embeddings, 500K connections</p>
      </header>

      <section style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', padding: '2rem' }}>
        {/* Free Tier */}
        <div style={{ border: '1px solid #C9A227', padding: '1rem', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
          <h2>Free</h2>
          <p>Perfect for getting started.</p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>100 Searches/Month</li>
            <li>Basic Features</li>
          </ul>
          <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Get Started
          </button>
        </div>

        {/* Scholar Tier */}
        <div style={{ border: '1px solid #C9A227', padding: '1rem', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
          <h2>Scholar</h2>
          <p>For serious researchers and academics.</p>
          <p><strong>$9/mo</strong></p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>Unlimited Searches</li>
            <li>API Access</li>
            <li>Discovery Engine</li>
            <li>SEMANTIA Full</li>
          </ul>
          <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Upgrade to Scholar
          </button>
        </div>

        {/* Student Tier */}
        <div style={{ border: '1px solid #C9A227', padding: '1rem', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
          <h2>Student</h2>
          <p>Full access for students.</p>
          <p><strong>FREE with .edu email</strong></p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>Full Access</li>
          </ul>
          <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Verify .edu Email
          </button>
        </div>

        {/* Institution Tier */}
        <div style={{ border: '1px solid #C9A227', padding: '1rem', borderRadius: '8px', width: '300px', textAlign: 'center' }}>
          <h2>Institution</h2>
          <p>For universities and research organizations.</p>
          <p><strong>$29/seat</strong></p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>SSO Integration</li>
            <li>LMS Integration</li>
            <li>Bulk Export</li>
            <li>Priority Support</li>
          </ul>
          <button style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Contact Sales
          </button>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{ padding: '2rem' }}>
        <h2>Feature Comparison</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{backgroundColor: '#222'}}>
              <th style={tableHeaderStyle}>Feature</th>
              <th style={tableHeaderStyle}>Free</th>
              <th style={tableHeaderStyle}>Scholar</th>
              <th style={tableHeaderStyle}>Student</th>
              <th style={tableHeaderStyle}>Institution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCellStyle}>Searches/Month</td>
              <td style={tableCellStyle}>100</td>
              <td style={tableCellStyle}>Unlimited</td>
              <td style={tableCellStyle}>Unlimited</td>
              <td style={tableCellStyle}>Unlimited</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>API Access</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Discovery Engine</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>SEMANTIA Full</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>SSO</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
             <tr>
              <td style={tableCellStyle}>LMS Integration</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
             <tr>
              <td style={tableCellStyle}>Bulk Export</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Priority Support</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>-</td>
              <td style={tableCellStyle}>✓</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* FAQ */}
      <section style={{ padding: '2rem' }}>
        <h2>Frequently Asked Questions</h2>
        <div style={{ marginBottom: '1rem' }}>
          <h3>What is the Discovery Engine?</h3>
          <p>The Discovery Engine helps you uncover hidden connections and patterns in the classical literature.</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h3>How do I verify my student status?</h3>
          <p>Click the "Verify .edu Email" button and follow the instructions.</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h3>What is SEMANTIA?</h3>
          <p>SEMANTIA is our advanced semantic analysis tool.  The "full" version provides deeper analysis and insights.</p>
        </div>
         <div style={{ marginBottom: '1rem' }}>
          <h3>How does institutional pricing work?</h3>
          <p>The institutional price is per seat (user) per month. Please contact sales for custom quotes.</p>
        </div>

      </section>

      <footer style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid #C9A227' }}>
        <p>&copy; 2024 LOGOS</p>
      </footer>
    </div>
  );
};

const tableHeaderStyle = {
    backgroundColor: '#333',
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #C9A227',
    fontWeight: 'bold'
  };

  const tableCellStyle = {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #444'
  };

export default PricingPage;