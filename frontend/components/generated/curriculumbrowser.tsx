import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';

type Module = {
  id: number;
  title: string;
  completed: boolean;
};

type CurriculumBrowserProps = {
  levels: string[];
  modules: Module[];
};

const CurriculumBrowser: React.FC<CurriculumBrowserProps> = ({ levels, modules }) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(levels[0]);
  const [progress, setProgress] = useState<number>(0);

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
    // Reset progress or fetch new progress based on level
    setProgress(0);
  };

  const handleModuleClick = (moduleId: number) => {
    // Handle module click, toggle completion or navigate
    const updatedModules = modules.map(module =>
      module.id === moduleId ? { ...module, completed: !module.completed } : module
    );
    const completedCount = updatedModules.filter(module => module.completed).length;
    setProgress((completedCount / modules.length) * 100);
  };

  return (
    <div className="bg-[#0D0D0F] text-white min-h-screen p-6">
      <div className="mb-4">
        <label htmlFor="level-select" className="block mb-2 text-gold">
          Select Level:
        </label>
        <select
          id="level-select"
          className="bg-[#0D0D0F] border border-gold text-gold p-2 rounded"
          value={selectedLevel}
          onChange={(e) => handleLevelChange(e.target.value)}
          aria-label="Select Level"
        >
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <p className="text-gold">Progress: {progress.toFixed(0)}%</p>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <motion.div
            className="bg-gold h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.map((module) => (
          <motion.div
            key={module.id}
            className={`p-4 border border-gold rounded cursor-pointer ${
              module.completed ? 'bg-gold text-[#0D0D0F]' : 'bg-[#0D0D0F]'
            }`}
            onClick={() => handleModuleClick(module.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="button"
            aria-pressed={module.completed}
          >
            <h3>{module.title}</h3>
            <p>{module.completed ? 'Completed' : 'Incomplete'}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumBrowser;
