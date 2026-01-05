import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

type Annotation = {
  id: string;
  text: string;
  description: string;
};

type Word = {
  id: string;
  text: string;
  morphology: string;
  annotations?: Annotation[];
};

type Sentence = {
  id: string;
  words: Word[];
};

type TextViewerProps = {
  parallelTexts: { source: Sentence[]; target: Sentence[] };
};

const TextViewer: React.FC<TextViewerProps> = ({ parallelTexts }) => {
  const [hoveredWord, setHoveredWord] = useState<Word | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

  const handleWordHover = (word: Word) => {
    setHoveredWord(word);
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  return (
    <div className="bg-[#0D0D0F] text-white p-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['source', 'target'].map((type) => (
          <div key={type} className="space-y-4">
            {parallelTexts[type as keyof typeof parallelTexts].map((sentence) => (
              <motion.div
                key={sentence.id}
                className="p-2 bg-[#1A1A1D] rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {sentence.words.map((word) => (
                  <span
                    key={word.id}
                    className="relative inline-block mx-1 cursor-pointer"
                    onMouseEnter={() => handleWordHover(word)}
                    onMouseLeave={() => setHoveredWord(null)}
                  >
                    <span
                      className={`hover:text-[#C9A962] ${
                        hoveredWord?.id === word.id ? 'text-[#C9A962]' : ''
                      }`}
                    >
                      {word.text}
                    </span>
                    {hoveredWord?.id === word.id && (
                      <span className="absolute left-0 top-full mt-1 text-xs text-[#C9A962]">
                        {word.morphology}
                      </span>
                    )}
                    {word.annotations?.map((annotation) => (
                      <button
                        key={annotation.id}
                        className="ml-1 text-xs text-[#C9A962] underline"
                        onClick={() => handleAnnotationClick(annotation)}
                        aria-label={`Annotation: ${annotation.description}`}
                      >
                        *
                      </button>
                    ))}
                  </span>
                ))}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      {selectedAnnotation && (
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1A1A1D] p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-[#C9A962]">
            {selectedAnnotation.text}
          </h3>
          <p className="text-sm">{selectedAnnotation.description}</p>
          <button
            className="mt-2 text-sm text-[#C9A962] underline"
            onClick={() => setSelectedAnnotation(null)}
          >
            Close
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default TextViewer;
