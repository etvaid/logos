'use client'

import { useState } from 'react'

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
}

const ERA_LABELS = {
  archaic: 'Archaic',
  classical: 'Classical',
  hellenistic: 'Hellenistic',
  imperial: 'Imperial',
  lateAntique: 'Late Antique',
  byzantine: 'Byzantine'
}

export default function EraLegend() {
  const [selectedEras, setSelectedEras] = useState<string[]>([])

  const toggleEra = (era: string) => {
    setSelectedEras(prev => 
      prev.includes(era) 
        ? prev.filter(e => e !== era)
        : [...prev, era]
    )
  }

  const clearFilters = () => {
    setSelectedEras([])
  }

  return (
    <div className="bg-[#1E1E24] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#F5F4F2] font-medium text-sm">Filter by Era</h3>
        {selectedEras.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-[#C9A227] hover:text-[#F5F4F2] text-xs transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(ERA_COLORS).map(([era, color]) => {
          const isSelected = selectedEras.includes(era)
          
          return (
            <button
              key={era}
              onClick={() => toggleEra(era)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md border transition-all
                ${isSelected 
                  ? 'border-[#C9A227] bg-[#C9A227]/10' 
                  : 'border-[#1E1E24] hover:border-[#C9A227]/50'
                }
              `}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[#F5F4F2] text-sm">
                {ERA_LABELS[era as keyof typeof ERA_LABELS]}
              </span>
            </button>
          )
        })}
      </div>
      
      {selectedEras.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#0D0D0F]">
          <p className="text-[#F5F4F2]/70 text-xs">
            Filtering by: {selectedEras.map(era => ERA_LABELS[era as keyof typeof ERA_LABELS]).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}