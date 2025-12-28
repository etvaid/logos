'use client';

import React, { useEffect, useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';

export default function Morphology() {
    const [word, setWord] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const parseWord = async () => {
        if (!word) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/parse?word=${word}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data) {
            console.log(data);
        }
    }, [data]);

    const handleInputChange = (e) => {
        setWord(e.target.value);
    };

    const handleParseClick = () => {
        parseWord();
    };

    return (
        <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', padding: '20px', minHeight: '100vh' }}>
            <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2em', textAlign: 'center' }}>Morphology</h1>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                <input
                    type="text"
                    value={word}
                    onChange={handleInputChange}
                    placeholder="Enter a word"
                    style={{
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #C9A962',
                        backgroundColor: '#1E1E24',
                        color: '#F5F3EF',
                        fontFamily: 'Crimson Pro',
                        width: '300px',
                    }}
                />
                <button
                    onClick={handleParseClick}
                    style={{
                        padding: '10px 15px',
                        marginLeft: '10px',
                        backgroundColor: '#C9A962',
                        color: '#0D0D0F',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontFamily: 'Crimson Pro',
                    }}
                >
                    Parse
                </button>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Loader style={{ color: '#C9A962', fontSize: '40px' }} />
                </div>
            )}

            {error && (
                <div style={{ color: '#DC2626', textAlign: 'center', margin: '20px 0' }}>
                    <AlertCircle style={{ verticalAlign: 'middle' }} /> {error}
                </div>
            )}

            {data && (
                <div style={{ marginTop: '20px', backgroundColor: '#1E1E24', padding: '20px', borderRadius: '5px' }}>
                    <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5em' }}>Parsed Data</h2>
                    <div style={{ fontFamily: 'Crimson Pro' }}>
                        <h3 style={{ color: '#C9A962' }}>Word: <span style={{ color: '#F5F3EF' }}>{data.word}</span></h3>
                        <h4 style={{ color: '#C9A962' }}>Paradigms:</h4>
                        <ul style={{ listStyleType: 'none', padding: '0' }}>
                            {data.paradigms.map((paradigm, index) => (
                                <li key={index} style={{ margin: '5px 0' }}>
                                    <span style={{ color: '#3B82F6', cursor: 'pointer' }} onClick={() => alert(`Clicked on ${paradigm}`)}>{paradigm}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}