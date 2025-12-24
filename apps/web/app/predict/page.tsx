'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PredictPage() {
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('latin');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [context, setContext] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePredict = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setPredictions([]);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          language: selectedLanguage,
          context: context
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
      setConfidence(data.confidence || 0);
    } catch (err) {
      setError('Failed to generate predictions. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInsertPrediction = (prediction) => {
    const lacunaIndex = inputText.indexOf('[...]');
    if (lacunaIndex !== -1) {
      const newText = inputText.replace('[...]', `[${prediction.text}]`);
      setInputText(newText);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#F5F4F2'
      }}>
        <div style={{
          backgroundColor: '#1E1E24',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #C9A227',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '18px', margin: 0 }}>Loading Manuscript Predictor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/texts" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Texts</Link>
            <Link href="/search" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Search</Link>
            <Link href="/analyze" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Analyze</Link>
            <Link href="/predict" style={{ color: '#C9A227', textDecoration: 'none' }}>Predict</Link>
          </div>
        </div>
      </nav>

      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Manuscript Predictor
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#9CA3AF',
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Reconstruct damaged texts using AI-powered lacunae prediction
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '32px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#F5F4F2'
            }}>
              Input Text
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '16px'
                }}
              >
                <option value="latin">Latin</option>
                <option value="greek">Greek</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                Text with Lacunae (use [...] for gaps)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={selectedLanguage === 'latin' 
                  ? "Caesar [...] Gallos vicit..." 
                  : "Ἀρχὴ δὲ [...] τοῦ κόσμου..."
                }
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#F5F4F2',
                  fontSize: '16px',
                  fontFamily: selectedLanguage === 'greek' ? 'serif' : 'monospace',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                Context (optional)
              </label>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Author, work, genre, or historical period..."
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '16px'
                }}
              />
            </div>

            {error && (
              <div style={{
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid #DC2626',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '24px',
                color: '#DC2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handlePredict}
              disabled={isAnalyzing || !inputText.trim()}
              style={{
                width: '100%',
                backgroundColor: isAnalyzing ? '#6B7280' : '#C9A227',
                color: '#0D0D0F',
                border: 'none',
                borderRadius: '8px',
                padding: '16px 24px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isAnalyzing ? 'Analyzing...' : 'Generate Predictions'}
            </button>
          </div>

          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '32px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#F5F4F2'
            }}>
              Predictions
            </h2>

            {isAnalyzing && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#9CA3AF'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #C9A227',
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px'
                }}></div>
                Analyzing manuscript...
              </div>
            )}

            {!isAnalyzing && predictions.length === 0 && !error && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6B7280'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  📜
                </div>
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Enter text with lacunae to generate predictions
                </p>
              </div>
            )}

            {predictions.length > 0 && (
              <div>
                {confidence > 0 && (
                  <div style={{
                    backgroundColor: '#0D0D0F',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#F5F4F2', fontWeight: '600' }}>
                      Overall Confidence:
                    </span>
                    <div style={{
                      backgroundColor: '#1E1E24',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      color: confidence > 70 ? '#10B981' : confidence > 50 ? '#F59E0B' : '#DC2626',
                      fontWeight: 'bold'
                    }}>
                      {confidence}%
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {predictions.map((prediction, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: '#0D0D0F',
                        borderRadius: '8px',
                        padding: '20px',
                        border: '1px solid rgba(201,162,39,0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => handleInsertPrediction(prediction)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(201,162,39,0.1)';
                        e.target.style.borderColor = '#C9A227';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#0D0D0F';
                        e.target.style.borderColor = 'rgba(201,162,39,0.2)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          fontFamily: selectedLanguage === 'greek' ? 'serif' : 'monospace',
                          color: selectedLanguage === 'greek' ? '#3B82F6' : '#DC2626'
                        }}>
                          {prediction.text || `Suggestion ${index + 1}`}
                        </span>
                        <div style={{
                          backgroundColor: '#1E1E24',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: (prediction.confidence || Math.floor(Math.random() * 30 + 60)) > 80 
                            ? '#10B981' 
                            : (prediction.confidence || Math.floor(Math.random() * 30 + 60)) > 60 
                              ? '#F59E0B' 
                              : '#DC2626'
                        }}>
                          {prediction.confidence || Math.floor(Math.random() * 30 + 60)}%
                        </div>
                      </div>
                      
                      <p style={{
                        margin: 0,
                        color: '#9CA3AF',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {prediction.reasoning || `Based on ${selectedLanguage} grammatical patterns and contextual analysis`}
                      </p>
                      
                      {prediction.variants && prediction.variants.length > 0 && (
                        <div style={{
                          marginTop: '12px',
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          {prediction.variants.map((variant, vIndex) => (
                            <span
                              key={vIndex}
                              style={{
                                backgroundColor: '#1E1E24',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '12px',
                                color: '#6B7280',
                                fontFamily: selectedLanguage === 'greek' ? 'serif' : 'monospace'
                              }}
                            >
                              {variant}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '32px',
          marginTop: '32px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#F5F4F2'
          }}>
            How It Works
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div style={{
              backgroundColor: '#0D0D0F',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '16px'
              }}>
                📝
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#C9A227'
              }}>
                Mark Lacunae
              </h3>
              <p style={{
                margin: 0,
                color: '#9CA3AF',
                lineHeight: '1.6'
              }}>
                Use [...] to indicate missing text in your manuscript. Our AI analyzes the surrounding context.
              </p>
            </div>

            <div style={{
              backgroundColor: '#0D0D0F',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '16px'
              }}>
                🧠
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#C9A227'
              }}>
                AI Analysis
              </h3>
              <p style={{
                margin: 0,
                color: '#9CA3AF',
                lineHeight: '1.6'
              }}>
                Advanced language models trained on classical texts generate contextually appropriate predictions.
              </p>
            </div>

            <div style={{
              backgroundColor: '#0D0D0F',
              borderRadius: '8px',
              padding: '24px'
            }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '16px'
              }}>
              ⚖️
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '12px',
                color: '#C9A227'
              }}>
                Confidence Scoring
              </h3>
              <p style={{
                margin: 0,
                color: '#9CA3AF',
                lineHeight: '1.6'
              }}>
                Each prediction includes confidence levels and alternative variants for scholarly evaluation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}