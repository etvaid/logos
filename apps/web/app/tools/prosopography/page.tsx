'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Person {
  id: string;
  name: string;
  birth: string;
  death: string;
  origin: string;
  occupation: string[];
  era: string;
  culture: string;
  description: string;
  connections: string[];
}

export default function ProsopographyPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [persons, setPersons] = useState<Person[]>([]);
  const [filteredPersons, setFilteredPersons] = useState<Person[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedCulture, setSelectedCulture] = useState('all');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showNetwork, setShowNetwork] = useState(false);

  const eras = ['Archaic', 'Classical', 'Hellenistic', 'Imperial', 'Late Antique', 'Byzantine'];
  const cultures = ['Greek', 'Roman', 'Egyptian', 'Persian', 'Celtic', 'Germanic'];

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  const cultureColors = {
    'Greek': '#3B82F6',
    'Roman': '#DC2626',
    'Egyptian': '#F59E0B',
    'Persian': '#7C3AED',
    'Celtic': '#059669',
    'Germanic': '#D97706'
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  useEffect(() => {
    filterPersons();
  }, [persons, searchTerm, selectedEra, selectedCulture]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prosopography');
      if (!response.ok) throw new Error('Failed to fetch persons');
      const data = await response.json();
      setPersons(data);
    } catch (err) {
      setError('Failed to load historical persons database');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterPersons = () => {
    let filtered = persons;

    if (searchTerm) {
      filtered = filtered.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.occupation.some(occ => occ.toLowerCase().includes(searchTerm.toLowerCase())) ||
        person.origin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedEra !== 'all') {
      filtered = filtered.filter(person => person.era === selectedEra);
    }

    if (selectedCulture !== 'all') {
      filtered = filtered.filter(person => person.culture === selectedCulture);
    }

    setFilteredPersons(filtered);
  };

  const mockPersons: Person[] = [
    {
      id: '1',
      name: 'Marcus Tullius Cicero',
      birth: '106 BCE',
      death: '43 BCE',
      origin: 'Arpinum',
      occupation: ['Orator', 'Politician', 'Philosopher'],
      era: 'Imperial',
      culture: 'Roman',
      description: 'Roman statesman, lawyer, scholar, and Academic Skeptic philosopher.',
      connections: ['2', '3', '4']
    },
    {
      id: '2',
      name: 'Gaius Julius Caesar',
      birth: '100 BCE',
      death: '44 BCE',
      origin: 'Rome',
      occupation: ['General', 'Politician', 'Author'],
      era: 'Imperial',
      culture: 'Roman',
      description: 'Roman general and statesman who played a critical role in the events that led to the demise of the Roman Republic.',
      connections: ['1', '3', '5']
    },
    {
      id: '3',
      name: 'Aristotle',
      birth: '384 BCE',
      death: '322 BCE',
      origin: 'Stagira',
      occupation: ['Philosopher', 'Teacher', 'Scientist'],
      era: 'Classical',
      culture: 'Greek',
      description: 'Greek philosopher and polymath during the Classical period in Ancient Greece.',
      connections: ['1', '2', '6']
    },
    {
      id: '4',
      name: 'Plato',
      birth: '428 BCE',
      death: '348 BCE',
      origin: 'Athens',
      occupation: ['Philosopher', 'Teacher', 'Writer'],
      era: 'Classical',
      culture: 'Greek',
      description: 'Athenian philosopher during the Classical period in Ancient Greece.',
      connections: ['3', '6']
    },
    {
      id: '5',
      name: 'Cleopatra VII',
      birth: '69 BCE',
      death: '30 BCE',
      origin: 'Alexandria',
      occupation: ['Pharaoh', 'Politician'],
      era: 'Hellenistic',
      culture: 'Egyptian',
      description: 'The last active pharaoh of Ptolemaic Egypt.',
      connections: ['2']
    },
    {
      id: '6',
      name: 'Socrates',
      birth: '470 BCE',
      death: '399 BCE',
      origin: 'Athens',
      occupation: ['Philosopher', 'Teacher'],
      era: 'Classical',
      culture: 'Greek',
      description: 'Greek philosopher from Athens who is credited as one of the founders of Western philosophy.',
      connections: ['3', '4']
    }
  ];

  if (loading) {
    setPersons(mockPersons);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#C9A227',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#0D0D0F',
              fontSize: '18px'
            }}>
              Λ
            </div>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5F4F2' }}>LOGOS</span>
          </div>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Tools</Link>
          <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Research</Link>
          <Link href="/corpus" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}>Corpus</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            Prosopography Database
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '32px' }}>
            Comprehensive database of historical persons from the classical world with network analysis
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <input
              type="text"
              placeholder="Search persons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#F5F4F2',
                fontSize: '16px'
              }}
            />

            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#F5F4F2',
                fontSize: '16px'
              }}
            >
              <option value="all">All Eras</option>
              {eras.map(era => (
                <option key={era} value={era}>{era}</option>
              ))}
            </select>

            <select
              value={selectedCulture}
              onChange={(e) => setSelectedCulture(e.target.value)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#F5F4F2',
                fontSize: '16px'
              }}
            >
              <option value="all">All Cultures</option>
              {cultures.map(culture => (
                <option key={culture} value={culture}>{culture}</option>
              ))}
            </select>

            <button
              onClick={() => setShowNetwork(!showNetwork)}
              style={{
                backgroundColor: showNetwork ? '#C9A227' : '#1E1E24',
                color: showNetwork ? '#0D0D0F' : '#F5F4F2',
                border: '1px solid #C9A227',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showNetwork ? 'List View' : 'Network View'}
            </button>
          </div>
        </div>

        {error ? (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid #DC2626'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#DC2626' }}>Error</h3>
            <p style={{ color: '#9CA3AF' }}>{error}</p>
          </div>
        ) : filteredPersons.length === 0 ? (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>No Persons Found</h3>
            <p style={{ color: '#9CA3AF' }}>Try adjusting your search criteria</p>
          </div>
        ) : showNetwork ? (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px',
            minHeight: '600px',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Network Visualization</h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px'
            }}>
              {filteredPersons.map((person, index) => (
                <div
                  key={person.id}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: eraColors[person.era as keyof typeof eraColors] || '#C9A227',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0D0D0F',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}
                  onClick={() => setSelectedPerson(person)}
                >
                  {person.name.split(' ').slice(-1)[0]}
                  <div style={{
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: '#9CA3AF',
                    whiteSpace: 'nowrap'
                  }}>
                    {person.era}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {filteredPersons.map((person) => (
              <div
                key={person.id}
                style={{
                  backgroundColor: '#1E1E24',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: selectedPerson?.id === person.id ? '2px solid #C9A227' : '1px solid transparent'
                }}
                onClick={() => setSelectedPerson(selectedPerson?.id === person.id ? null : person)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                    {person.name}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      backgroundColor: eraColors[person.era as keyof typeof eraColors] || '#C9A227',
                      color: '#0D0D0F',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {person.era}
                    </span>
                    <span style={{
                      backgroundColor: cultureColors[person.culture as keyof typeof cultureColors] || '#9CA3AF',
                      color: '#0D0D0F',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {person.culture}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{ color: '#9CA3AF', margin: '0', fontSize: '14px' }}>
                    {person.birth} - {person.death}
                  </p>
                  <p style={{ color: '#9CA3AF', margin: '4px 0 0 0', fontSize: '14px' }}>
                    Origin: {person.origin}
                  </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {person.occupation.map((occ, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'rgba(201,162,39,0.1)',
                          color: '#C9A227',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          border: '1px solid rgba(201,162,39,0.3)'
                        }}
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPerson?.id === person.id && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #4B5563' }}>
                    <p style={{ color: '#F5F4F2', fontSize: '14px', lineHeight: '1.5' }}>
                      {person.description}
                    </p>
                    {person.connections.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#C9A227' }}>
                          Connected Persons ({person.connections.length})
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {person.connections.map((connectionId) => {
                            const connectedPerson = persons.find(p => p.id === connectionId);
                            return connectedPerson ? (
                              <button
                                key={connectionId}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPerson(connectedPerson);
                                }}
                                style={{
                                  backgroundColor: '#0D0D0F',
                                  color: '#9CA3AF',
                                  border: '1px solid #4B5563',
                                  borderRadius: '4px',
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                {connectedPerson.name}
                              </button>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}