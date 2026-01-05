import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

type FAQItem = {
  question: string;
  answer: string;
};

type HelpPanelProps = {
  faqs: FAQItem[];
  shortcuts: { key: string; description: string }[];
};

const HelpPanel: React.FC<HelpPanelProps> = ({ faqs, shortcuts }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#0D0D0F] text-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="flex items-center mb-4">
        <Search className="text-[#C9A962] mr-2 h-4 w-4" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="bg-transparent border-b border-[#C9A962] focus:outline-none flex-grow"
          aria-label="Search FAQs"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">FAQs</h2>
        {filteredFaqs.length ? (
          filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left flex items-center justify-between py-2 focus:outline-none"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-content-${index}`}
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="text-[#C9A962] h-4 w-4" />
                ) : (
                  <ChevronDown className="text-[#C9A962] h-4 w-4" />
                )}
              </button>
              {activeIndex === index && (
                <motion.div
                  id={`faq-content-${index}`}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pl-4">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-[#C9A962]">No FAQs found</p>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Keyboard Shortcuts</h2>
        <ul>
          {shortcuts.map((shortcut, index) => (
            <li key={index} className="flex justify-between py-1">
              <span>{shortcut.description}</span>
              <span className="text-[#C9A962]">{shortcut.key}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HelpPanel;
