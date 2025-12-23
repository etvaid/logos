'use client';

import React, { useState } from 'react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "What texts are included?",
      answer: "LOGOS includes the complete corpus of Greek and Latin literature from antiquity through the Byzantine period. This encompasses works from Homer to Nonnus, Plato to Plotinus, Cicero to Augustine, and thousands of other authors. Our collection includes poetry, prose, philosophy, history, drama, rhetoric, and technical treatises - totaling over 15 million words of ancient text with comprehensive metadata and linguistic annotation."
    },
    {
      question: "How is this different from TLG?",
      answer: "While TLG focuses on text preservation and basic search functionality, LOGOS revolutionizes classical scholarship with AI-powered semantic search, real-time translation, contextual analysis, and cross-linguistic comparison tools. We offer modern UI/UX, collaborative features, citation management, and pedagogical tools designed for 21st-century scholars and students."
    },
    {
      question: "How does semantic search work?",
      answer: "Our semantic search uses advanced natural language processing to understand meaning rather than just matching keywords. You can search for concepts like 'divine justice' or 'political virtue' and find relevant passages even when different vocabulary is used. The system analyzes context, identifies thematic relationships, and ranks results by conceptual relevance across both Greek and Latin corpora."
    },
    {
      question: "What is SEMANTIA?",
      answer: "SEMANTIA is our proprietary AI engine that powers intelligent text analysis, automated translation suggestions, contextual commentary generation, and cross-textual relationship mapping. It combines transformer-based language models trained specifically on ancient languages with classical scholarship databases to provide unprecedented insights into ancient texts."
    },
    {
      question: "How accurate are translations?",
      answer: "Our AI-assisted translations achieve 85-92% accuracy for standard prose and 78-85% for poetry, significantly outperforming general translation tools. However, we always recommend human review for scholarly work. The system provides confidence scores, alternative renderings, and highlights potentially ambiguous passages to support critical evaluation."
    },
    {
      question: "Can I cite LOGOS?",
      answer: "Absolutely. LOGOS provides persistent URLs for every text passage, complete bibliographic metadata following scholarly standards, and automated citation generation in MLA, Chicago, APA, and custom academic formats. All texts include provenance information and editorial notes necessary for rigorous scholarly citation."
    },
    {
      question: "Is there an API?",
      answer: "Yes, LOGOS offers a comprehensive RESTful API for developers and researchers. Access text data, search functionality, translation services, and metadata programmatically. API tiers include free access for educational use, premium plans for commercial applications, and enterprise solutions for institutional integration."
    },
    {
      question: "Student verification?",
      answer: "Students can verify their status through institutional email addresses (.edu domains), direct integration with university systems, or manual verification with valid student ID documentation. Verified students receive significant discounts on premium features and extended access to research tools."
    },
    {
      question: "Data privacy?",
      answer: "LOGOS employs enterprise-grade security with end-to-end encryption, GDPR compliance, and transparent data practices. Personal research data remains private by default. We never sell user data or academic work to third parties. Users maintain full control over their annotations, notes, and research projects."
    },
    {
      question: "Offline access?",
      answer: "Premium subscribers can download text collections for offline reading and basic search functionality. The offline app includes essential texts, saved searches, personal annotations, and reading lists. Full semantic search and AI features require internet connectivity due to computational requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[#F5F4F2]/70 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about LOGOS and our revolutionary approach to classical scholarship
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-[#F5F4F2]/10 rounded-xl overflow-hidden hover:border-[#C9A227]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/5"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-[#F5F4F2]/5 transition-all duration-300 group"
              >
                <h3 className="text-xl font-semibold text-[#F5F4F2] group-hover:text-[#C9A227] transition-colors duration-300 pr-4">
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${openItems.includes(index) ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-[#C9A227]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                openItems.includes(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-8 pb-6">
                  <div className="w-12 h-px bg-[#C9A227] mb-6"></div>
                  <p className="text-[#F5F4F2]/80 leading-relaxed text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 border border-[#C9A227]/20 rounded-xl bg-[#C9A227]/5">
          <h3 className="text-2xl font-semibold mb-4 text-[#C9A227]">
            Still have questions?
          </h3>
          <p className="text-[#F5F4F2]/70 mb-6 text-lg">
            Our team of classical scholars and technical experts is here to help
          </p>
          <button className="bg-[#C9A227] text-[#0D0D0F] px-8 py-3 rounded-lg font-semibold hover:bg-[#C9A227]/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/20 transform hover:scale-105">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}