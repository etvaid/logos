import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './TranslationStyleDial.css';

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
  onChange: (selectedPersona: string, selectedScholarStyle: string) => void;
}

const TranslationStyleDial: React.FC<TranslationStyleDialProps> = ({ onChange }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedScholarStyle, setSelectedScholarStyle] = useState<string>('');

  const handlePersonaClick = (personaKey: string) => {
    setSelectedPersona(personaKey);
    setSelectedScholarStyle('');
  };

  const handleScholarStyleClick = (styleKey: string) => {
    setSelectedScholarStyle(styleKey);
    onChange(selectedPersona, styleKey);
  };

  return (
    <div className="dial-container">
      <motion.div
        className="outer-dial"
        initial={{ rotate: 0 }}
        animate={{ rotate: selectedPersona ? 360 : 0 }}
        transition={{ duration: 1 }}
      >
        {Object.entries(personas).map(([key, persona]) => (
          <motion.div
            key={key}
            className={`persona-segment ${selectedPersona === key ? 'selected' : ''}`}
            onClick={() => handlePersonaClick(key)}
            tabIndex={0}
            role="button"
            aria-label={`Select ${persona.name}`}
            style={{ transform: `rotate(${(360 / 7) * Object.keys(personas).indexOf(key)}deg)` }}
          >
            <span className="persona-icon">{persona.icon}</span>
            <span className="persona-name">{persona.name}</span>
          </motion.div>
        ))}
      </motion.div>
      {selectedPersona && (
        <motion.div
          className="inner-dial"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {Object.entries(scholarStyles).map(([key, style]) => (
            <motion.div
              key={key}
              className={`style-segment ${selectedScholarStyle === key ? 'selected' : ''}`}
              onClick={() => handleScholarStyleClick(key)}
              tabIndex={0}
              role="button"
              aria-label={`Select ${style.name}`}
            >
              <span className="style-name">{style.name}</span>
            </motion.div>
          ))}
        </motion.div>
      )}
      <div className="details">
        {selectedPersona && (
          <div className="persona-details">
            <h2 className="font-display">{personas[selectedPersona].name}</h2>
            <p>{personas[selectedPersona].description}</p>
          </div>
        )}
        {selectedScholarStyle && (
          <div className="style-details">
            <h2 className="font-display">{scholarStyles[selectedScholarStyle].name}</h2>
            <p>{scholarStyles[selectedScholarStyle].description}</p>
          </div>
        )}
        {selectedPersona && selectedScholarStyle && (
          <button className="view-translation-button">View Translation</button>
        )}
      </div>
    </div>
  );
};

export default TranslationStyleDial;
