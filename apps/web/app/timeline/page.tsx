'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Event {
  year: number;
  title: string;
  era: string;
  category: string;
}

const events: Event[] = [
  { year: -800, title: 'Homer composes epics', era: 'archaic', category: 'intellectual' },
  { year: -490, title: 'Battle of Marathon', era: 'classical', category: 'political' },
  { year: -399, title: 'Death of Socrates', era: 'classical', category: 'intellectual' },
  { year: -323, title: 'Death of Alexander', era: 'hellenistic', category: 'political' },
  { year: -44, title: 'Caesar assassination', era: 'imperial', category: 'political' },
  { year: 33, title: 'Crucifixion', era: 'imperial', category: 'religious' },
  { year: 313, title: 'Edict of Milan', era: 'lateAntique', category: 'religious' },
  { year: 410, title: 'Sack of Rome', era: 'lateAntique', category: 'political' },
  { year: 476, title: 'Fall of Western Empire', era: 'lateAntique', category: 'political' },
  { year: 529, title: 'Academy closes', era: 'byzantine', category: 'intellectual' },
  { year: 1453, title: 'Fall of Constantinople', era: 'byzantine', category: 'political' },
];

const eraColors: { [key: string]: string } = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#10B981',
};

const backgroundColor = '#0D0D0F';
const textColor = '#F5F4F2';
const accentColor = '#C9A227';

const minYear = Math.min(...events.map(e => e.year));
const maxYear = Math.max(...events.map(e => e.year));
const timelineWidth = 1000;
const yearRange = maxYear - minYear;

const Timeline = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [animationYear, setAnimationYear] = useState(minYear);
  const animationInterval = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
      }
    };
  }, []);


  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
  };

  const filteredEvents = categoryFilter === 'all'
    ? events
    : events.filter(event => event.category === categoryFilter);

  const getPosition = (year: number) => {
    return ((year - minYear) / yearRange) * timelineWidth;
  };

  const handlePlay = () => {
    if (animationInterval.current) {
      clearInterval(animationInterval.current);
      animationInterval.current = null;
      return;
    }

    animationInterval.current = setInterval(() => {
      setAnimationYear(prevYear => {
        const newYear = prevYear + 10;
        if (newYear > maxYear) {
          clearInterval(animationInterval.current);
          animationInterval.current = null;
          return minYear; //restart animation
        }
        return newYear;
      });
    }, 100);
  };


  return (
    <div style={{ backgroundColor, color: textColor, padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Classical World Timeline</h1>

      <div>
        <label htmlFor="categoryFilter">Filter by Category:</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ backgroundColor: '#333', color: textColor, border: 'none', padding: '5px', margin: '5px' }}
        >
          <option value="all">All</option>
          <option value="political">Political</option>
          <option value="religious">Religious</option>
          <option value="intellectual">Intellectual</option>
        </select>
        <button onClick={handlePlay} style={{padding: '5px 10px', backgroundColor: accentColor, color: backgroundColor, border: 'none', cursor: 'pointer'}}>
          {animationInterval.current ? 'Stop' : 'Play'}
        </button>
      </div>


      <div style={{ position: 'relative', width: timelineWidth, height: '50px', backgroundColor: '#222', margin: '20px 0' }}>
        {Object.entries(eraColors).map(([era, color]) => {
          const eraEvents = events.filter(e => e.era === era);
          if (eraEvents.length === 0) return null;

          const startYear = Math.min(...eraEvents.map(e => e.year));
          const endYear = Math.max(...eraEvents.map(e => e.year));
          const startPosition = getPosition(startYear);
          const endPosition = getPosition(endYear);
          const width = endPosition - startPosition;

          return (
            <div
              key={era}
              style={{
                position: 'absolute',
                left: `${startPosition}px`,
                top: 0,
                height: '100%',
                width: `${width}px`,
                backgroundColor: color,
                opacity: 0.3,
                pointerEvents: 'none',
              }}
            />
          );
        })}


        {filteredEvents.map((event) => {
          const position = getPosition(event.year);
          const size = event.category === 'political' ? 10 : event.category === 'religious' ? 8 : 6;

          return (
            <div
              key={event.year}
              style={{
                position: 'absolute',
                left: `${position - size / 2}px`,
                top: '50%',
                transform: 'translateY(-50%)',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: eraColors[event.era],
                cursor: 'pointer',
                opacity: event.year <= animationYear ? 1 : 0.3
              }}
              onClick={() => handleEventClick(event)}
              title={event.title}
            />
          );
        })}
        <div
        style={{
          position: 'absolute',
          left: `${getPosition(animationYear)}px`,
          top: 0,
          height: '100%',
          width: '2px',
          backgroundColor: accentColor,
          pointerEvents: 'none',
        }}
      />
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>{minYear} BCE</div>
          <div>{maxYear} CE</div>
      </div>

      {selectedEvent && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#333', color: textColor, padding: '20px', borderRadius: '5px' }}>
          <h3>{selectedEvent.title}</h3>
          <p>Year: {selectedEvent.year}</p>
          <p>Era: {selectedEvent.era}</p>
          <p>Category: {selectedEvent.category}</p>
          <button onClick={handleClosePopup} style={{ backgroundColor: accentColor, color: backgroundColor, border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Timeline;