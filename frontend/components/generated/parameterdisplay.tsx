import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

interface ParameterDisplayProps {
  metric: number;
  label: string;
  description: string;
}

const ParameterDisplay: React.FC<ParameterDisplayProps> = ({ metric, label, description }) => {
  const handleExport = () => {
    try {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify({ metric, label, description })
      )}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `${label.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <div className="bg-[#0D0D0F] text-gold p-4 rounded-lg shadow-lg w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="text-2xl font-bold" id={`metric-${label}`} title={description}>
          {metric}
        </div>
        <div className="text-lg mt-2" aria-labelledby={`metric-${label}`}>
          {label}
        </div>
        <button
          onClick={handleExport}
          className="mt-4 flex items-center text-gold hover:text-white transition-colors"
          aria-label={`Export ${label}`}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </button>
      </motion.div>
    </div>
  );
};

export default ParameterDisplay;
