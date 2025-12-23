'use client';
import React, { useState } from 'react';

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How does the .edu email verification work for Student plans?",
      answer: "Simply sign up with your .edu email address and we'll automatically verify your student status. Verification is instant and you'll have immediate access to your free Student account."
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the end of your current billing cycle."
    },
    {
      question: "What's included in the API access for Scholar plans?",
      answer: "Scholar plans include full REST API access with up to 10,000 requests per month, webhooks, and comprehensive documentation to integrate SEMANTIA into your workflows."
    },
    {
      question: "How does Institution billing work for multiple seats?",
      answer: "Institution plans are billed monthly per seat. You can add or remove seats at any time, and you'll only be charged for active users in that billing period."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial, and you can cancel at any time."
    }
  ];

  const features = [
    { name: "Daily searches", student: "100/day", scholar: "Unlimited", institution: "Unlimited" },
    { name: "Document upload", student: "✓", scholar: "✓", institution: "✓" },
    { name: "Citation generator", student: "✓", scholar: "✓", institution: "✓" },
    { name: "Advanced AI analysis", student: "✗", scholar: "✓", institution: "✓" },
    { name: "API access", student: "✗", scholar: "✓", institution: "✓" },
    { name: "Priority support", student: "✗", scholar: "✓", institution: "✓" },
    { name: "SSO integration", student: "✗", scholar: "✗", institution: "✓" },
    { name: "LMS integration", student: "✗", scholar: "✗", institution: "✓" },
    { name: "Bulk export", student: "✗", scholar: "Basic", institution: "Advanced" },
    { name: "Custom branding", student: "✗", scholar: "✗", institution: "✓" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-[#F5F4F2]/80 mb-8 max-w-2xl mx-auto">
            From students to institutions, we have the perfect plan to accelerate your research journey
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Student Plan */}
          <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Student</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#C9A227]">Free</span>
              </div>
              <p className="text-[#F5F4F2]/70">Perfect for students with .edu email</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                100 searches per day
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                .edu email verification
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Basic document analysis
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Citation generator
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Community support
              </li>
            </ul>
            
            <button className="w-full bg-[#C9A227] text-[#0D0D0F] font-semibold py-3 px-6 rounded-xl hover:bg-[#C9A227]/90 transition-all duration-200 transform hover:scale-105">
              Start Free
            </button>
          </div>

          {/* Scholar Plan - Popular */}
          <div className="bg-[#1A1A1D] rounded-2xl p-8 border-2 border-[#C9A227] relative hover:border-[#C9A227]/80 transition-all duration-300 transform hover:-translate-y-2">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#C9A227] text-[#0D0D0F] px-6 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Scholar</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#C9A227]">$9</span>
                <span className="text-[#F5F4F2]/70 ml-2">/month</span>
              </div>
              <p className="text-[#F5F4F2]/70">Advanced research capabilities</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Unlimited searches
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Full SEMANTIA AI access
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                API access included
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Priority support
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Export capabilities
              </li>
            </ul>
            
            <button className="w-full bg-[#C9A227] text-[#0D0D0F] font-semibold py-3 px-6 rounded-xl hover:bg-[#C9A227]/90 transition-all duration-200 transform hover:scale-105">
              Start Free Trial
            </button>
          </div>

          {/* Institution Plan */}
          <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Institution</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-[#C9A227]">$29</span>
                <span className="text-[#F5F4F2]/70 ml-2">/seat/month</span>
              </div>
              <p className="text-[#F5F4F2]/70">Enterprise-grade research platform</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Everything in Scholar
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                SSO integration
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                LMS integration
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Bulk data export
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Custom branding
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-[#C9A227] rounded-full mr-3"></span>
                Dedicated support
              </li>
            </ul>
            
            <button className="w-full bg-transparent border-2 border-[#C9A227] text-[#C9A227] font-semibold py-3 px-6 rounded-xl hover:bg-[#C9A227] hover:text-[#0D0D0F] transition-all duration-200 transform hover:scale-105">
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Compare Features</h2>
        <div className="bg-[#1A1A1D] rounded-2xl overflow-hidden border border-[#F5F4F2]/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0D0D0F]/50">
                <tr>
                  <th className="text-left p-6 font-semibold">Features</th>
                  <th className="text-center p-6 font-semibold">Student</th>
                  <th className="text-center p-6 font-semibold text-[#C9A227]">Scholar</th>
                  <th className="text-center p-6 font-semibold">Institution</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-t border-[#F5F4F2]/10 hover:bg-[#0D0D0F]/30 transition-colors">
                    <td className="p-6 font-medium">{feature.name}</td>
                    <td className="p-6 text-center">{feature.student}</td>
                    <td className="p-6 text-center text-[#C9A227]">{feature.scholar}</td>
                    <td className="p-6 text-center">{feature.institution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#1A1A1D] rounded-xl border border-[#F5F4F2]/10 overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-[#0D0D0F]/30 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className={`text-[#C9A227] text-2xl transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 text-[#F5F4F2]/80 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-[#C9A227]/20 to-[#C9A227]/10 rounded-2xl p-12 border border-[#C9A227]/20">
          <h2 className="text-3xl font-bold mb-4">Ready to accelerate your research?</h2>
          <p className="text-[#F5F4F2]/80 mb-8 text-lg">
            Join thousands of researchers who trust SEMANTIA for their academic work
          </p>
          <button className="bg-[#C9A227] text-[#0D0D0F] font-semibold py-4 px-8 rounded-xl hover:bg-[#C9A227]/90 transition-all duration-200 transform hover:scale-105 text-lg">
            Start Free Today
          </button>
        </div>
      </div>
    </div>
  );
}