'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Persona {
  name: string;
  icon: string;
  description: string;
}

interface ScholarStyle {
  name: string;
  description: string;
}

const personas: Record<string, Persona> = {
  student: {
    name: 'Student',
    icon: '📚',
    description: 'Simple vocabulary, explanatory notes, learning-focused',
  },
  professor: {
    name: 'Professor',
    icon: '🎓',
    description: 'Scholarly precision, nuanced vocabulary, academic tone',
  },
  linguist: {
    name: 'Linguist',
    icon: '🔬',
    description: 'Technical accuracy, morphological notes, etymology',
  },
  historian: {
    name: 'Historian',
    icon: '📜',
    description: 'Historical context, period-appropriate language',
  },
  archaeologist: {
    name: 'Archaeologist',
    icon: '⛏️',
    description: 'Material culture focus, artifact references',
  },
  digital_humanist: {
    name: 'Digital Humanist',
    icon: '💻',
    description: 'Computational perspective, data-aware',
  },
  general_reader: {
    name: 'General Reader',
    icon: '📖',
    description: 'Literary, accessible, beautiful prose',
  },
};

const scholarStyles: Record<string, ScholarStyle> = {
  lattimore: {
    name: 'Richmond Lattimore',
    description: 'Literal, line-for-line, preserves meter',
  },
  fagles: {
    name: 'Robert Fagles',
    description: 'Dynamic, dramatic, modern idiom',
  },
  fitzgerald: {
    name: 'Robert Fitzgerald',
    description: 'Poetic, elevated, musical',
  },
  wilson: {
    name: 'Emily Wilson',
    description: 'Contemporary, fresh, feminist lens',
  },
  rouse: {
    name: 'W.H.D. Rouse',
    description: 'Plain prose, accessible, story-focused',
  },
  loeb: {
    name: 'A.T. Murray (Loeb)',
    description: 'Precise, scholarly, reference-oriented',
  },
  plain: {
    name: 'Plain Language',
    description: 'Modern, simple, no flourishes',
  },
};

interface TranslationStyleDialProps {
  onChange?: (selectedPersona: string, selectedScholarStyle: string) => void;
  className?: string;
}

const TranslationStyleDial: React.FC<TranslationStyleDialProps> = ({ onChange, className = '' }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('general_reader');
  const [selectedScholarStyle, setSelectedScholarStyle] = useState<string>('fagles');
  const [isOpen, setIsOpen] = useState(false);

  const handlePersonaClick = (personaKey: string) => {
    setSelectedPersona(personaKey);
    if (onChange && selectedScholarStyle) {
      onChange(personaKey, selectedScholarStyle);
    }
  };

  const handleScholarStyleClick = (styleKey: string) => {
    setSelectedScholarStyle(styleKey);
    if (onChange) {
      onChange(selectedPersona, styleKey);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-[#1A1A1F] border border-[#C9A962]/30 rounded-lg hover:border-[#C9A962]/50 transition-colors"
      >
        <span className="text-xl">{personas[selectedPersona]?.icon || '📖'}</span>
        <div className="text-left">
          <div className="text-sm text-[#C9A962] font-medium">
            {personas[selectedPersona]?.name || 'Select Persona'}
          </div>
          <div className="text-xs text-[#F5F3EF]/60">
            {scholarStyles[selectedScholarStyle]?.name || 'Select Translator'}
          </div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#F5F3EF]/40"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-[500px] bg-[#1A1A1F] border border-[#C9A962]/30 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-[#C9A962]/20">
              <h3 className="text-[#C9A962] font-serif text-lg">Translation Settings</h3>
              <p className="text-[#F5F3EF]/60 text-sm">Choose your reading persona and preferred translator style</p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#C9A962]/20">
              {/* Persona Selection */}
              <div className="p-4">
                <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-3">Reading Persona</h4>
                <div className="space-y-1">
                  {Object.entries(personas).map(([key, persona]) => (
                    <motion.button
                      key={key}
                      whileHover={{ x: 4 }}
                      onClick={() => handlePersonaClick(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                        selectedPersona === key
                          ? 'bg-[#C9A962]/20 text-[#C9A962]'
                          : 'hover:bg-white/5 text-[#F5F3EF]/80'
                      }`}
                    >
                      <span className="text-lg">{persona.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{persona.name}</div>
                        <div className="text-xs text-[#F5F3EF]/50">{persona.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Scholar Style Selection */}
              <div className="p-4">
                <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-3">Translator Style</h4>
                <div className="space-y-1">
                  {Object.entries(scholarStyles).map(([key, style]) => (
                    <motion.button
                      key={key}
                      whileHover={{ x: 4 }}
                      onClick={() => handleScholarStyleClick(key)}
                      className={`w-full flex flex-col px-3 py-2 rounded-lg transition-colors text-left ${
                        selectedScholarStyle === key
                          ? 'bg-[#7C9885]/20 text-[#7C9885]'
                          : 'hover:bg-white/5 text-[#F5F3EF]/80'
                      }`}
                    >
                      <div className="text-sm font-medium">{style.name}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{style.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Preview */}
            <div className="p-4 bg-gradient-to-r from-[#C9A962]/10 to-[#7C9885]/10 border-t border-[#C9A962]/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[#F5F3EF]">
                    <span className="text-[#C9A962]">{personas[selectedPersona]?.name}</span>
                    {' reading '}
                    <span className="text-[#7C9885]">{scholarStyles[selectedScholarStyle]?.name}</span>
                  </div>
                  <div className="text-xs text-[#F5F3EF]/50 mt-1">
                    {personas[selectedPersona]?.description}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg text-sm font-medium hover:bg-[#E8D5A3] transition-colors"
                >
                  Apply
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default TranslationStyleDial;
