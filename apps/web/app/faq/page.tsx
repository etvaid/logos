'use client';

import React, { useState } from 'react';

const FAQ = () => {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What texts are included?',
      answer: 'LOGOS includes a wide variety of classical texts, spanning Greek and Latin literature, philosophy, history, and more.  Our corpus is constantly expanding. See the full list on the [Texts page](link-to-texts-page).',
    },
    {
      question: 'How is this different from TLG/Perseus?',
      answer: 'LOGOS builds on the foundation of resources like TLG and Perseus by offering advanced AI-powered semantic search capabilities.  Unlike keyword search, LOGOS allows you to find passages based on meaning, not just exact word matches.  We also offer network visualizations to explore connections between ideas and texts.',
    },
    {
      question: 'How does semantic search work?',
      answer: 'Our semantic search utilizes large language models (LLMs) to understand the underlying meaning of your search query.  It then finds passages in our corpus that have similar meanings, even if they use different words. This allows you to discover relevant texts that you might have missed with traditional keyword search.',
    },
    {
      question: 'What is SEMANTIA?',
      answer: 'SEMANTIA is our proprietary AI model that powers LOGOS. It has been specifically trained on classical texts to understand the nuances and complexities of ancient languages and thought.  It allows for much more accurate and nuanced search results than general-purpose LLMs.',
    },
    {
      question: 'Are translations reliable?',
      answer: 'Translations are sourced from reputable public domain translations. While we strive for accuracy, translations can vary.  We always recommend consulting the original Greek or Latin text for the most accurate understanding. Translations are provided for convenience only.',
    },
    {
      question: 'Can I cite LOGOS in papers?',
      answer: 'Yes, you can cite LOGOS in your academic work. We suggest citing us as follows: LOGOS: AI-powered classical research platform. [Your search query/passage accessed] [Date accessed]. logos-platform.com.',
    },
    {
      question: 'Is there an API?',
      answer: 'We are currently developing an API for LOGOS. Please contact us at [email protected] to express your interest and learn more about potential future access.',
    },
    {
      question: 'How does student verification work?',
      answer: 'Student verification is performed through [Explain student verification process - e.g., using a student email address, university affiliation, etc.]. Once verified, you will have access to the student plan benefits.',
    },
    {
      question: 'What about data privacy?',
      answer: 'We take your data privacy seriously.  We do not sell your data to third parties. Please see our [Privacy Policy](link-to-privacy-policy) for detailed information about how we collect, use, and protect your data.',
    },
    {
      question: 'Can I use LOGOS offline?',
      answer: 'Currently, LOGOS requires an internet connection to access our database and utilize our AI-powered search features. Offline access is not supported at this time.',
    },
  ];

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <input
        type="text"
        placeholder="Search FAQs..."
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#1A1A1C',
          color: '#F5F4F2',
          border: 'none',
          borderRadius: '5px',
        }}
      />
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <button
            onClick={() => toggleQuestion(index)}
            style={{
              width: '100%',
              padding: '10px',
              textAlign: 'left',
              backgroundColor: '#1A1A1C',
              color: '#F5F4F2',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {faq.question}
            <span style={{ color: '#C9A227', fontSize: '1.2em' }}>
              {activeQuestion === index ? '-' : '+'}
            </span>
          </button>
          {activeQuestion === index && (
            <div style={{ padding: '10px', backgroundColor: '#262629', borderRadius: '5px', marginTop: '5px' }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;