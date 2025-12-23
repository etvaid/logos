'use client';
import React, { useState } from 'react';

export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const events = [
    {
      id: 1,
      title: "Battle of Marathon",
      year: -490,
      date: "490 BCE",
      category: "Political",
      description: "The Athenians defeated the Persian invasion force, marking a crucial victory for Greek independence and the preservation of democracy.",
      details: "Approximately 11,000 Athenians and Plataeans faced 25,000 Persian troops. The Greeks' tactical brilliance led to a decisive victory with minimal losses.",
      era: "Classical Antiquity"
    },
    {
      id: 2,
      title: "Death of Socrates",
      year: -399,
      date: "399 BCE",
      category: "Intellectual",
      description: "The execution of Socrates marked a turning point in philosophy, as his method of questioning became the foundation of Western philosophical thought.",
      details: "Accused of corrupting youth and impiety, Socrates chose death over exile, drinking hemlock while discussing the immortality of the soul.",
      era: "Classical Antiquity"
    },
    {
      id: 3,
      title: "Alexander's Death",
      year: -323,
      date: "323 BCE",
      category: "Political",
      description: "Alexander the Great's death at 32 ended his unprecedented conquest, but his empire's cultural fusion shaped the Hellenistic world for centuries.",
      details: "Dying in Babylon after conquering most of the known world, Alexander's empire stretched from Egypt to India, spreading Greek culture across three continents.",
      era: "Classical Antiquity"
    },
    {
      id: 4,
      title: "Assassination of Caesar",
      year: -44,
      date: "44 BCE",
      category: "Political",
      description: "Julius Caesar's assassination on the Ides of March ended the Roman Republic and paved the way for the Roman Empire under Augustus.",
      details: "Stabbed 23 times by senators led by Brutus and Cassius, Caesar's death triggered civil wars that ultimately destroyed republican government in Rome.",
      era: "Classical Antiquity"
    },
    {
      id: 5,
      title: "Constantine's Conversion",
      year: 312,
      date: "312 CE",
      category: "Religious",
      description: "Emperor Constantine's conversion to Christianity before the Battle of Milvian Bridge transformed the Roman Empire and spread Christianity.",
      details: "After seeing a vision of the Chi-Rho symbol, Constantine legalized Christianity and became its patron, fundamentally changing European civilization.",
      era: "Late Antiquity"
    }
  ];

  const filters = ['All', 'Political', 'Religious', 'Intellectual'];

  const filteredEvents = activeFilter === 'All' 
    ? events 
    : events.filter(event => event.category === activeFilter);

  const getEraColor = (era) => {
    switch(era) {
      case 'Classical Antiquity': return 'from-purple-900/20 to-blue-900/20';
      case 'Late Antiquity': return 'from-orange-900/20 to-red-900/20';
      default: return 'from-gray-900/20 to-gray-800/20';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Political': return 'bg-red-600';
      case 'Religious': return 'bg-[#C9A227]';
      case 'Intellectual': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const timelineStart = -500;
  const timelineEnd = 400;
  const totalYears = timelineEnd - timelineStart;

  const getPosition = (year) => {
    return ((year - timelineStart) / totalYears) * 100;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-[#C9A227] mb-4">Historical Timeline</h1>
        <p className="text-lg text-[#F5F4F2]/80 mb-6">
          Explore pivotal moments that shaped Western civilization
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#C9A227] text-[#0D0D0F]'
                  : 'bg-[#F5F4F2]/10 text-[#F5F4F2] hover:bg-[#F5F4F2]/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-x-auto pb-8">
          <div className="relative w-[1200px] h-64 mx-auto">
            {/* Era Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-orange-900/20 rounded-lg"></div>
            
            {/* Timeline Line */}
            <div className="absolute top-32 left-0 right-0 h-1 bg-[#F5F4F2]/30"></div>

            {/* Year Markers */}
            {[-500, -400, -300, -200, -100, 0, 100, 200, 300, 400].map((year) => (
              <div
                key={year}
                className="absolute top-28 transform -translate-x-1/2"
                style={{ left: `${getPosition(year)}%` }}
              >
                <div className="w-0.5 h-8 bg-[#F5F4F2]/50 mb-2"></div>
                <span className="text-sm text-[#F5F4F2]/60 whitespace-nowrap">
                  {year === 0 ? '1 CE' : year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`}
                </span>
              </div>
            ))}

            {/* Event Markers */}
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="absolute top-32 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${getPosition(event.year)}%` }}
              >
                <button
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                  className={`w-4 h-4 rounded-full border-4 border-[#0D0D0F] transition-all duration-300 hover:scale-150 hover:shadow-lg hover:shadow-[#C9A227]/30 ${getCategoryColor(event.category)}`}
                >
                  <div className="sr-only">{event.title}</div>
                </button>
                
                {/* Event Label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-xs font-medium text-[#C9A227] whitespace-nowrap">
                    {event.title}
                  </div>
                  <div className="text-xs text-[#F5F4F2]/60 whitespace-nowrap">
                    {event.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm text-[#F5F4F2]/80">Political</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#C9A227]"></div>
            <span className="text-sm text-[#F5F4F2]/80">Religious</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-sm text-[#F5F4F2]/80">Intellectual</span>
          </div>
        </div>

        {/* Event Details Popup */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1A1A1D] border border-[#F5F4F2]/20 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#C9A227] mb-2">
                    {selectedEvent.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-lg text-[#F5F4F2]/80">{selectedEvent.date}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedEvent.category)} text-white`}>
                      {selectedEvent.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-[#F5F4F2]/60 hover:text-[#F5F4F2] text-2xl font-bold transition-colors duration-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-[#F5F4F2] leading-relaxed">
                  {selectedEvent.description}
                </p>
                <div className="border-t border-[#F5F4F2]/20 pt-4">
                  <h4 className="text-[#C9A227] font-semibold mb-2">Details</h4>
                  <p className="text-[#F5F4F2]/80 leading-relaxed">
                    {selectedEvent.details}
                  </p>
                </div>
                <div className="bg-[#F5F4F2]/5 rounded-lg p-3">
                  <span className="text-[#C9A227] font-medium">Era: </span>
                  <span className="text-[#F5F4F2]">{selectedEvent.era}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}