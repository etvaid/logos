'use client';

import React from 'react';

const gold = '#C9A227';

const features = [
  {
    name: 'Search Limit',
    free: '100/month',
    scholar: 'Unlimited',
    student: 'Unlimited',
    institution: 'Unlimited',
  },
  {
    name: 'API Access',
    free: '❌',
    scholar: '✅',
    student: '✅',
    institution: '✅',
  },
  {
    name: 'Discovery Engine',
    free: '❌',
    scholar: '✅',
    student: '✅',
    institution: '✅',
  },
  {
    name: 'Priority Support',
    free: '❌',
    scholar: '✅',
    student: '✅',
    institution: '✅',
  },
    {
    name: 'SSO Integration',
    free: '❌',
    scholar: '❌',
    student: '❌',
    institution: '✅',
  },
      {
    name: 'LMS Integration',
    free: '❌',
    scholar: '❌',
    student: '❌',
    institution: '✅',
  },
    {
    name: 'Bulk Export',
    free: '❌',
    scholar: '❌',
    student: '❌',
    institution: '✅',
  },
];

const faq = [
  {
    question: 'What is the Logos Discovery Engine?',
    answer:
      'The Discovery Engine allows you to explore relationships between historical texts.  Think of it as literature search, but for the ancient world!',
  },
  {
    question: 'How do I verify my student email?',
    answer:
      'Enter your .edu email on the Student plan signup page.  We will automatically email you a verification link to activate your account.',
  },
  {
    question: 'What is SSO?',
    answer:
      'Single Sign-On (SSO) lets your institution&apos;s users access Logos with their existing credentials, simplifying user management and improving security.',
  },
    {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing cycle.',
  },
];

const PricingPage = () => {
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: gold }}>Logos Pricing</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: gold }}>Free</h2>
          <p style={{ fontSize: '1.2em' }}>100 searches/month</p>
          <p style={{ fontSize: '0.9em' }}>Basic features</p>
          <button style={{ backgroundColor: gold, color: '#0D0D0F', padding: '10px 20px', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
            Get Started
          </button>
        </div>

        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: gold }}>Scholar</h2>
          <p style={{ fontSize: '1.2em' }}>$9/month</p>
          <p style={{ fontSize: '0.9em' }}>Unlimited searches, API, Discovery Engine</p>
          <button style={{ backgroundColor: gold, color: '#0D0D0F', padding: '10px 20px', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
            Subscribe
          </button>
        </div>

        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: gold }}>Student</h2>
          <p style={{ fontSize: '1.2em' }}>FREE with .edu email</p>
          <p style={{ fontSize: '0.9em' }}>Everything</p>
          <button style={{ backgroundColor: gold, color: '#0D0D0F', padding: '10px 20px', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
            Verify Email
          </button>
        </div>

        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', color: gold }}>Institution</h2>
          <p style={{ fontSize: '1.2em' }}>$29/seat</p>
          <p style={{ fontSize: '0.9em' }}>SSO, LMS, bulk export</p>
          <button style={{ backgroundColor: gold, color: '#0D0D0F', padding: '10px 20px', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>
            Contact Us
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: '40px', marginBottom: '20px', color: gold }}>Feature Comparison</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1E1E24', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#2D2D33', color: '#F5F4F2' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Feature</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Free</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Scholar</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Student</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Institution</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#1E1E24' : '#24242A' }}>
              <td style={{ padding: '12px' }}>{feature.name}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{feature.free}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{feature.scholar}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{feature.student}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>{feature.institution}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '40px', marginBottom: '20px', color: gold }}>Frequently Asked Questions</h2>

      {faq.map((item, index) => (
        <div key={index} style={{ marginBottom: '20px', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: gold }}>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default PricingPage;