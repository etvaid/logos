'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GrammarTable {
  id: string;
  title: string;
  type: 'declension' | 'conjugation';
  language: 'greek' | 'latin';
  forms: Array<{
    case?: string;
    person?: string;
    number: string;
    form: string;
    translation?: string;
  }>;
}

export default function GrammarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<GrammarTable[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'declension' | 'conjugation'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'greek' | 'latin'>('all');
  const [selectedTable, setSelectedTable] = useState<GrammarTable | null>(null);

  useEffect(() => {
    const fetchGrammarTables = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/grammar/tables');
        if (!response.ok) {
          throw new Error('Failed to fetch grammar tables');
        }
        const data = await response.json();
        setTables(data.tables || [
          {
            id: '1',
            title: 'First Declension (Latin) - rosa, rosae',
            type: 'declension',
            language: 'latin',
            forms: [
              { case: 'Nominative', number: 'singular', form: 'rosa', translation: 'rose (subject)' },
              { case: 'Nominative', number: 'plural', form: 'rosae', translation: 'roses (subject)' },
              { case: 'Genitive', number: 'singular', form: 'rosae', translation: 'of the rose' },
              { case: 'Genitive', number: 'plural', form: 'rosarum', translation: 'of the roses' },
              { case: 'Dative', number: 'singular', form: 'rosae', translation: 'to/for the rose' },
              { case: 'Dative', number: 'plural', form: 'rosis', translation: 'to/for the roses' },
              { case: 'Accusative', number: 'singular', form: 'rosam', translation: 'rose (object)' },
              { case: 'Accusative', number: 'plural', form: 'rosas', translation: 'roses (object)' },
              { case: 'Ablative', number: 'singular', form: 'rosa', translation: 'by/with/from the rose' },
              { case: 'Ablative', number: 'plural', form: 'rosis', translation: 'by/with/from the roses' }
            ]
          },
          {
            id: '2',
            title: 'Present Tense (Latin) - amare (to love)',
            type: 'conjugation',
            language: 'latin',
            forms: [
              { person: '1st', number: 'singular', form: 'amo', translation: 'I love' },
              { person: '2nd', number: 'singular', form: 'amas', translation: 'you love' },
              { person: '3rd', number: 'singular', form: 'amat', translation: 'he/she/it loves' },
              { person: '1st', number: 'plural', form: 'amamus', translation: 'we love' },
              { person: '2nd', number: 'plural', form: 'amatis', translation: 'you (all) love' },
              { person: '3rd', number: 'plural', form: 'amant', translation: 'they love' }
            ]
          },
          {
            id: '3',
            title: 'First Declension (Greek) - χώρα, χώρας',
            type: 'declension',
            language: 'greek',
            forms: [
              { case: 'Nominative', number: 'singular', form: 'χώρα', translation: 'country (subject)' },
              { case: 'Nominative', number: 'plural', form: 'χῶραι', translation: 'countries (subject)' },
              { case: 'Genitive', number: 'singular', form: 'χώρας', translation: 'of the country' },
              { case: 'Genitive', number: 'plural', form: 'χωρῶν', translation: 'of the countries' },
              { case: 'Dative', number: 'singular', form: 'χώρᾳ', translation: 'to/for the country' },
              { case: 'Dative', number: 'plural', form: 'χώραις', translation: 'to/for the countries' },
              { case: 'Accusative', number: 'singular', form: 'χώραν', translation: 'country (object)' },
              { case: 'Accusative', number: 'plural', form: 'χώρας', translation: 'countries (object)' }
            ]
          },
          {
            id: '4',
            title: 'Present Tense (Greek) - λύω (to loosen)',
            type: 'conjugation',
            language: 'greek',
            forms: [
              { person: '1st', number: 'singular', form: 'λύω', translation: 'I loosen' },
              { person: '2nd', number: 'singular', form: 'λύεις', translation: 'you loosen' },
              { person: '3rd', number: 'singular', form: 'λύει', translation: 'he/she/it loosens' },
              { person: '1st', number: 'plural', form: 'λύομεν', translation: 'we loosen' },
              { person: '2nd', number: 'plural', form: 'λύετε', translation: 'you (all) loosen' },
              { person: '3rd', number: 'plural', form: 'λύουσι(ν)', translation: 'they loosen' }
            ]
          }
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load grammar tables');
      } finally {
        setLoading(false);
      }
    };

    fetchGrammarTables();
  }, []);

  const filteredTables = tables.filter(table => {
    const typeMatch = selectedType === 'all' || table.type === selectedType;
    const languageMatch = selectedLanguage === 'all' || table.language === selectedLanguage;
    return typeMatch && languageMatch;
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div style={{ color: '#C9A227', fontSize: '18px' }}>Loading grammar tables...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div style={{ color: '#DC2626', fontSize: '18px' }}>Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(201,162,39,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#C9A227', 
          textDecoration: 'none' 
        }}>
          LOGOS
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
            Learn
          </Link>
          <Link href="/texts" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
            Texts
          </Link>
          <Link href="/dictionary" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
            Dictionary
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Grammar Tables
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', marginBottom: '32px' }}>
            Master declensions and conjugations with interactive reference tables
          </p>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#F5F4F2',
                fontSize: '16px'
              }}
            >
              <option value="all">All Types</option>
              <option value="declension">Declensions</option>
              <option value="conjugation">Conjugations</option>
            </select>

            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              style={{
                backgroundColor: '#1E1E24',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#F5F4F2',
                fontSize: '16px'
              }}
            >
              <option value="all">All Languages</option>
              <option value="latin">Latin</option>
              <option value="greek">Greek</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedTable ? '300px 1fr' : '1fr', gap: '32px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#C9A227' }}>
              Available Tables
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => setSelectedTable(selectedTable?.id === table.id ? null : table)}
                  style={{
                    backgroundColor: selectedTable?.id === table.id ? 'rgba(201,162,39,0.1)' : '#1E1E24',
                    border: selectedTable?.id === table.id ? '2px solid #C9A227' : '2px solid transparent',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#F5F4F2' }}>
                    {table.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                      backgroundColor: table.type === 'declension' ? '#3B82F6' : '#DC2626',
                      color: '#F5F4F2',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {table.type}
                    </span>
                    <span style={{
                      backgroundColor: table.language === 'greek' ? '#3B82F6' : '#DC2626',
                      color: '#F5F4F2',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {table.language === 'greek' ? 'Greek' : 'Latin'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTable && (
            <div>
              <div style={{
                backgroundColor: '#1E1E24',
                borderRadius: '12px',
                padding: '32px',
                border: '1px solid rgba(201,162,39,0.2)'
              }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#C9A227' }}>
                  {selectedTable.title}
                </h2>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {selectedTable.type === 'declension' ? (
                          <>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Case
                            </th>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Singular
                            </th>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Plural
                            </th>
                          </>
                        ) : (
                          <>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Person
                            </th>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Form
                            </th>
                            <th style={{ 
                              backgroundColor: '#141419', 
                              color: '#C9A227', 
                              padding: '16px', 
                              textAlign: 'left', 
                              fontWeight: 'bold',
                              borderBottom: '2px solid #C9A227'
                            }}>
                              Translation
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTable.type === 'declension' ? (
                        ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Ablative'].map((caseName) => {
                          const singularForm = selectedTable.forms.find(f => f.case === caseName && f.number === 'singular');
                          const pluralForm = selectedTable.forms.find(f => f.case === caseName && f.number === 'plural');
                          
                          if (!singularForm && !pluralForm) return null;
                          
                          return (
                            <tr key={caseName}>
                              <td style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid #4B5563',
                                color: '#F5F4F2',
                                fontWeight: 'bold'
                              }}>
                                {caseName}
                              </td>
                              <td style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid #4B5563',
                                color: '#F5F4F2'
                              }}>
                                {singularForm ? (
                                  <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                      {singularForm.form}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                                      {singularForm.translation}
                                    </div>
                                  </div>
                                ) : '-'}
                              </td>
                              <td style={{ 
                                padding: '16px', 
                                borderBottom: '1px solid #4B5563',
                                color: '#F5F4F2'
                              }}>
                                {pluralForm ? (
                                  <div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                      {pluralForm.form}
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                                      {pluralForm.translation}
                                    </div>
                                  </div>
                                ) : '-'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        selectedTable.forms.map((form, index) => (
                          <tr key={index}>
                            <td style={{ 
                              padding: '16px', 
                              borderBottom: '1px solid #4B5563',
                              color: '#F5F4F2',
                              fontWeight: 'bold'
                            }}>
                              {form.person} {form.number}
                            </td>
                            <td style={{ 
                              padding: '16px', 
                              borderBottom: '1px solid #4B5563',
                              color: '#F5F4F2',
                              fontWeight: 'bold',
                              fontSize: '18px'
                            }}>
                              {form.form}
                            </td>
                            <td style={{ 
                              padding: '16px', 
                              borderBottom: '1px solid #4B5563',
                              color: '#9CA3AF'
                            }}>
                              {form.translation}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredTables.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#9CA3AF'
          }}>
            <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>No tables found</h3>
            <p>Try adjusting your filters to see more grammar tables.</p>
          </div>
        )}
      </main>
    </div>
  );
}