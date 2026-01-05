import React from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

type Citation = {
  id: number;
  text: string;
  source: string;
};

type RelatedContent = {
  id: number;
  title: string;
  link: string;
};

type EssayReaderProps = {
  title: string;
  content: string;
  citations: Citation[];
  relatedContent: RelatedContent[];
};

const EssayReader: React.FC<EssayReaderProps> = ({ title, content, citations, relatedContent }) => {
  if (!title || !content) {
    console.error('Title and content are required.');
    return <p className="text-red-500">Error: Missing title or content.</p>;
  }

  return (
    <div className="bg-[#0D0D0F] text-white min-h-screen p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-[#C9A962] mb-6">{title}</h1>
        <article className="prose prose-lg md:prose-xl prose-invert">
          <p>{content}</p>
        </article>
        <section aria-labelledby="citations" className="mt-8">
          <h2 id="citations" className="text-2xl font-semibold text-[#C9A962]">Citations</h2>
          <ul className="list-disc list-inside mt-4">
            {citations.map(citation => (
              <li key={citation.id} className="mb-2">
                <span className="italic">{citation.text}</span> - <a href={citation.source} className="underline text-[#C9A962]">{citation.source}</a>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="related-content" className="mt-8">
          <h2 id="related-content" className="text-2xl font-semibold text-[#C9A962]">Related Content</h2>
          <ul className="list-disc list-inside mt-4">
            {relatedContent.map(content => (
              <li key={content.id} className="mb-2">
                <a href={content.link} className="underline text-[#C9A962]">{content.title}</a>
              </li>
            ))}
          </ul>
        </section>
      </motion.div>
    </div>
  );
};

export default EssayReader;
