import React from 'react';
import { motion } from 'framer-motion';

type ScholarCardProps = {
  biography: string;
  works: string[];
  timeline: { year: number; event: string }[];
};

const ScholarCard: React.FC<ScholarCardProps> = ({ biography, works, timeline }) => {
  if (!biography || !works.length || !timeline.length) {
    console.error('ScholarCard: Missing required props.');
    return null;
  }

  return (
    <div className="bg-[#0D0D0F] text-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#C9A962] mb-4">Scholar Biography</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-sm md:text-base">{biography}</p>
      </motion.div>

      <h3 className="text-xl font-semibold text-[#C9A962] mb-3">Works</h3>
      <motion.ul
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="list-disc list-inside mb-6 space-y-2"
      >
        {works.map((work, index) => (
          <li key={index} className="text-sm md:text-base">
            {work}
          </li>
        ))}
      </motion.ul>

      <h3 className="text-xl font-semibold text-[#C9A962] mb-3">Timeline</h3>
      <motion.ul
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        {timeline.map((entry, index) => (
          <li key={index} className="flex items-center text-sm md:text-base">
            <span className="font-bold mr-2">{entry.year}:</span>
            <span>{entry.event}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default ScholarCard;
