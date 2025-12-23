'use client'

import React, { useState } from 'react'

const EVENTS = [
  {year:-800,title:"Homer composes epics",type:"intellectual",era:"archaic"},
  {year:-490,title:"Battle of Marathon",type:"political",era:"classical"},
  {year:-399,title:"Death of Socrates",type:"intellectual",era:"classical"},
  {year:-323,title:"Death of Alexander",type:"political",era:"hellenistic"},
  {year:-44,title:"Caesar assassination",type:"political",era:"imperial"},
  {year:33,title:"Crucifixion",type:"religious",era:"imperial"},
  {year:313,title:"Edict of Milan",type:"religious",era:"lateAntique"},
  {year:476,title:"Fall of Western Rome",type:"political",era:"lateAntique"},
  {year:529,title:"Academy closes",type:"intellectual",era:"byzantine"},
];

const ERA_COLORS: Record<string,string> = {
  archaic:"#D97706",
  classical:"#F59E0B",
  hellenistic:"#3B82F6",
  imperial:"#DC2626",
  lateAntique:"#7C3AED",
  byzantine:"#059669"
};

const TYPE_COLORS: Record<string,string> = {
  political:"#DC2626",
  intellectual:"#3B82F6",
  religious:"#7C3AED"
};

export default function Timeline() {
  const [filter, setFilter] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null)

  const filteredEvents = EVENTS.filter(event => 
    filter === 'all' || event.type === filter
  )

  const minYear = Math.min(...EVENTS.map(e => e.year))
  const maxYear = Math.max(...EVENTS.map(e => e.year))
  const yearRange = maxYear - minYear

  const getPositionPercent = (year: number) => {
    return ((year - minYear) / yearRange) * 100
  }

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setSelectedEvent(null)
  }

  const handleEventClick = (event: typeof EVENTS[0]) => {
    setSelectedEvent(selectedEvent?.year === event.year ? null : event)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      padding: '2rem'
    }}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: '#C9A227'
        }}>
          Historical Timeline
        </h1>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap'
        }}>
          {['all', 'political', 'intellectual', 'religious'].map(type => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: filter === type ? '#C9A227' : '#1E1E24',
                color: filter === type ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Timeline Container */}
        <div style={{
          position: 'relative',
          height: '200px',
          marginBottom: '2rem',
          backgroundColor: '#1E1E24',
          borderRadius: '1rem',
          padding: '2rem',
          overflow: 'hidden'
        }}>
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '2rem',
            right: '2rem',
            height: '2px',
            backgroundColor: '#C9A227',
            transform: 'translateY(-50%)'
          }} />

          {/* Year Markers */}
          <div style={{
            position: 'absolute',
            top: '75%',
            left: '2rem',
            right: '2rem',
            height: '1px'
          }}>
            {[-800, -500, -200, 0, 200, 500].map(year => (
              <div
                key={year}
                style={{
                  position: 'absolute',
                  left: `${getPositionPercent(year)}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '0.75rem',
                  color: '#C9A227',
                  marginTop: '0.5rem'
                }}
              >
                {formatYear(year)}
              </div>
            ))}
          </div>

          {/* Events */}
          {filteredEvents.map((event, index) => (
            <div
              key={`${event.year}-${index}`}
              onClick={() => handleEventClick(event)}
              style={{
                position: 'absolute',
                left: `calc(2rem + ${getPositionPercent(event.year)}%)`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '16px',
                height: '16px',
                backgroundColor: ERA_COLORS[event.era],
                borderRadius: '50%',
                cursor: 'pointer',
                border: selectedEvent?.year === event.year ? '3px solid #C9A227' : '2px solid #F5F4F2',
                zIndex: 10,
                transition: 'all 0.2s'
              }}
              title={`${event.title} (${formatYear(event.year)})`}
            />
          ))}
        </div>

        {/* Event Details */}
        {selectedEvent && (
          <div style={{
            backgroundColor: '#1E1E24',
            padding: '2rem',
            borderRadius: '1rem',
            border: `2px solid ${ERA_COLORS[selectedEvent.era]}`,
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: ERA_COLORS[selectedEvent.era],
                borderRadius: '50%'
              }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#C9A227',
                margin: 0
              }}>
                {selectedEvent.title}
              </h3>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '2rem',
              fontSize: '0.9rem'
            }}>
              <div>
                <strong style={{color: '#C9A227'}}>Year:</strong> {formatYear(selectedEvent.year)}
              </div>
              <div>
                <strong style={{color: '#C9A227'}}>Era:</strong> 
                <span style={{
                  textTransform: 'capitalize',
                  marginLeft: '0.5rem'
                }}>
                  {selectedEvent.era}
                </span>
              </div>
              <div>
                <strong style={{color: '#C9A227'}}>Type:</strong> 
                <span style={{
                  textTransform: 'capitalize',
                  marginLeft: '0.5rem',
                  color: TYPE_COLORS[selectedEvent.type]
                }}>
                  {selectedEvent.type}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <h4 style={{
              color: '#C9A227',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              Eras
            </h4>
            {Object.entries(ERA_COLORS).map(([era, color]) => (
              <div key={era} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color,
                  borderRadius: '50%'
                }} />
                <span style={{textTransform: 'capitalize'}}>{era}</span>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#1E1E24',
            padding: '1.5rem',
            borderRadius: '1rem'
          }}>
            <h4 style={{
              color: '#C9A227',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}>
              Event Types
            </h4>
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: color,
                  borderRadius: '50%'
                }} />
                <span style={{textTransform: 'capitalize'}}>{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#1E1E24',
          borderRadius: '0.5rem',
          textAlign: 'center',
          color: '#C9A227'
        }}>
          Showing {filteredEvents.length} of {EVENTS.length} events
          {filter !== 'all' && (
            <span> • Filtered by: <strong style={{textTransform: 'capitalize'}}>{filter}</strong></span>
          )}
        </div>
      </div>
    </div>
  )
}