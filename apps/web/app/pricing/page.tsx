import React from 'react';

const LogosPricingPage = () => {

  const eraColors = {
    Archaic: "#D97706",
    Classical: "#F59E0B",
    Hellenistic: "#3B82F6",
    ImperialRome: "#DC2626",
    LateAntiquity: "#7C3AED",
    Byzantine: "#059669",
  };

  const languageColors = {
    Greek: "#3B82F6",
    Latin: "#DC2626",
    Hebrew: "#059669",
    Syriac: "#D97706",
    Coptic: "#EC4899",
    Arabic: "#7C3AED",
  };

  const contextLayerColors = {
    Political: "#DC2626",
    Economic: "#059669",
    Social: "#7C3AED",
    Religious: "#F59E0B",
    Intellectual: "#3B82F6",
  };

  const theme = {
    Background: "#0D0D0F",
    Secondary: "#1E1E24",
    Text: "#F5F4F2",
    AccentGold: "#C9A227",
  };

  const marketingClaims = [
    "World's largest searchable classical corpus",
    "1.7+ million passages",
    "892,000 semantic embeddings",
    "500,000+ intertextual connections",
    "The only 5-layer analysis system",
  ];

  const faqs = [
    { question: "What is SEMANTIA?", answer: "SEMANTIA is our advanced semantic analysis engine, providing insights into the relationships between texts." },
    { question: "Can I cancel my subscription?", answer: "Yes, you can cancel your subscription at any time." },
    { question: "Do you offer custom plans?", answer: "Yes, contact us for enterprise solutions and custom pricing." },
    { question: "What languages does Logos support?", answer: "Logos supports a wide range of ancient languages including Greek, Latin, Hebrew, Syriac, Coptic, and Arabic." },
  ];

  const tierData = [
    {
      name: "Student",
      price: "Free",
      features: [
        "100 searches/day",
        "Basic translation",
        "Full corpus access",
      ],
      cta: "Get Started (Free)",
      isFree: true,
    },
    {
      name: "Scholar",
      price: "$9/mo",
      features: [
        "Unlimited everything",
        "API access",
        "SEMANTIA full access",
        "Priority support",
      ],
      cta: "Subscribe Now",
      isFree: false,
    },
    {
      name: "Institution",
      price: "$29/seat/mo",
      features: [
        "Everything",
        "SSO",
        "LMS integration",
        "Bulk export",
        "Custom training",
      ],
      cta: "Contact Sales",
      isFree: false,
    },
  ];


  return (
    <div style={{ backgroundColor: theme.Background, color: theme.Text, padding: '20px' }}>

      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Unlock the Power of Ancient Texts with Logos</h1>
        <p>Choose the plan that's right for you.</p>
      </header>

      <section style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        {tierData.map((tier, index) => (
          <div key={index} style={{
            backgroundColor: theme.Secondary,
            padding: '20px',
            borderRadius: '8px',
            width: '300px',
            textAlign: 'center',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <h3>{tier.name}</h3>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold', color: theme.AccentGold }}>
              {tier.price === "Free" ? "Free" : tier.price}
            </p>
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'left' }}>
              {tier.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>{feature}</li>
              ))}
            </ul>
            <button style={{
              backgroundColor: tier.isFree ? '#059669' : theme.AccentGold,
              color: theme.Text,
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px'
            }}>{tier.cta}</button>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Feature Comparison</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: theme.Secondary }}>
          <thead>
            <tr style={{ backgroundColor: theme.Secondary }}>
              <th style={tableHeaderStyle}>Feature</th>
              <th style={tableHeaderStyle}>Student</th>
              <th style={tableHeaderStyle}>Scholar</th>
              <th style={tableHeaderStyle}>Institution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableCellStyle}>Searches per day</td>
              <td style={tableCellStyle}>100</td>
              <td style={tableCellStyle}>Unlimited</td>
              <td style={tableCellStyle}>Unlimited</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Basic Translation</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Full Corpus Access</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>API Access</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>SEMANTIA Full Access</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Priority Support</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>SSO</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>LMS Integration</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Bulk Export</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
            <tr>
              <td style={tableCellStyle}>Custom Training</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>❌</td>
              <td style={tableCellStyle}>✅</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4 style={{ color: theme.AccentGold }}>{faq.question}</h4>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Trusted By</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          {/* Replace with actual trust badges/logos */}
          <span>University Logo</span>
          <span>Research Institute Logo</span>
          <span>Library Logo</span>
        </div>
      </section>

      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#9CA3AF' }}>
        <p>&copy; 2024 Logos. All rights reserved.</p>
      </footer>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: '#2D2D33',
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: `1px solid #4B5563`,
};

const tableCellStyle = {
  padding: '12px',
  borderBottom: `1px solid #4B5563`,
};

export default LogosPricingPage;
npx create-react-app my-logos-pricing --template typescript
cd my-logos-pricing
npm start