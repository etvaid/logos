'use client';

import { useState, useRef, useEffect } from 'react';

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description?: string;
  type: 'author' | 'work' | 'event';
  language?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  minYear?: number;
  maxYear?: number;
  onEventClick?: (event: TimelineEvent) => void;
  selectedEventId?: string;
}

const TYPE_COLORS = {
  author: '#C9A962',
  work: '#87CEEB',
  event: '#F87171',
};

export default function Timeline({
  events,
  minYear = -800,
  maxYear = 600,
  onEventClick,
  selectedEventId,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);

  // Calculate position on timeline
  const getPosition = (year: number) => {
    const range = maxYear - minYear;
    return ((year - minYear) / range) * 100;
  };

  // Format year for display
  const formatYear = (year: number) => {
    if (year < 0) return `${Math.abs(year)} BCE`;
    if (year === 0) return '1 CE';
    return `${year} CE`;
  };

  // Generate century markers
  const centuryMarkers = [];
  for (let year = Math.ceil(minYear / 100) * 100; year <= maxYear; year += 100) {
    centuryMarkers.push(year);
  }

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX - offset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset(e.clientX - dragStart);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Distribute events vertically to avoid overlap
  const getVerticalPosition = (event: TimelineEvent, index: number) => {
    // Alternate between top and bottom, with some variation
    const base = index % 2 === 0 ? 20 : 60;
    const variation = (index % 4) * 5;
    return base + variation;
  };

  return (
    <div className="relative w-full">
      {/* Zoom controls */}
      <div className="absolute top-0 right-0 z-10 flex gap-2">
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
          className="w-8 h-8 flex items-center justify-center bg-[#1A1A1D] border border-[#C9A962]/20 rounded text-[#F5F3EF] hover:bg-[#C9A962]/10"
        >
          -
        </button>
        <span className="w-16 h-8 flex items-center justify-center bg-[#1A1A1D] border border-[#C9A962]/20 rounded text-sm text-[#F5F3EF]/70">
          {(zoom * 100).toFixed(0)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
          className="w-8 h-8 flex items-center justify-center bg-[#1A1A1D] border border-[#C9A962]/20 rounded text-[#F5F3EF] hover:bg-[#C9A962]/10"
        >
          +
        </button>
      </div>

      {/* Timeline container */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto cursor-grab active:cursor-grabbing mt-12"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="relative h-48"
          style={{
            width: `${100 * zoom}%`,
            minWidth: '100%',
            transform: `translateX(${offset}px)`,
          }}
        >
          {/* Main axis */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A962]/20 via-[#C9A962]/40 to-[#C9A962]/20" />

          {/* Century markers */}
          {centuryMarkers.map((year) => (
            <div
              key={year}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${getPosition(year)}%` }}
            >
              <div className="w-px h-6 bg-[#C9A962]/30" />
              <span className="mt-2 text-xs text-[#F5F3EF]/40 whitespace-nowrap">
                {formatYear(year)}
              </span>
            </div>
          ))}

          {/* Events */}
          {events.map((event, index) => {
            const isSelected = selectedEventId === event.id;
            const isHovered = hoveredEvent?.id === event.id;
            const position = getPosition(event.year);
            const verticalPos = getVerticalPosition(event, index);
            const isTop = verticalPos < 50;

            return (
              <div
                key={event.id}
                className="absolute"
                style={{
                  left: `${position}%`,
                  top: `${verticalPos}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {/* Connecting line */}
                <div
                  className={`absolute left-1/2 w-px bg-[#C9A962]/20 ${
                    isTop ? 'bottom-0 h-6' : 'top-0 h-6'
                  }`}
                  style={{ transform: 'translateX(-50%)' }}
                />

                {/* Event dot */}
                <button
                  onClick={() => onEventClick?.(event)}
                  onMouseEnter={() => setHoveredEvent(event)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  className={`
                    relative w-4 h-4 rounded-full transition-all
                    ${isSelected || isHovered ? 'scale-150 z-10' : 'hover:scale-125'}
                  `}
                  style={{ backgroundColor: TYPE_COLORS[event.type] }}
                >
                  {/* Tooltip */}
                  {(isHovered || isSelected) && (
                    <div
                      className={`
                        absolute left-1/2 -translate-x-1/2 z-20
                        bg-[#1A1A1D] border border-[#C9A962]/30 rounded-lg p-3
                        whitespace-nowrap shadow-xl
                        ${isTop ? 'bottom-full mb-2' : 'top-full mt-2'}
                      `}
                    >
                      <div className="font-semibold text-[#C9A962]">{event.title}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{formatYear(event.year)}</div>
                      {event.description && (
                        <div className="text-xs text-[#F5F3EF]/70 mt-1 max-w-48">
                          {event.description}
                        </div>
                      )}
                    </div>
                  )}
                </button>

                {/* Label (always visible for important events) */}
                {zoom > 0.75 && (
                  <div
                    className={`
                      absolute left-1/2 -translate-x-1/2 text-xs text-center whitespace-nowrap
                      ${isTop ? 'top-full mt-1' : 'bottom-full mb-1'}
                    `}
                  >
                    <span className="text-[#F5F3EF]/60">{event.title}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-[#C9A962]/20">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-sm text-[#F5F3EF]/70 capitalize">{type}s</span>
          </div>
        ))}
      </div>
    </div>
  );
}
