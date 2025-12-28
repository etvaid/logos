'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';

export default function Homepage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/homepage-stats')
            .then(response => response.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to fetch data");
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ backgroundColor: '#0D0D0F', color: '#F5F3EF', minHeight: '100vh', padding: '20px' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ color: '#C9A962', fontSize: '50px' }}>LOGOS</h1>
                <p style={{ color: 'rgba(245,243,239,0.7)' }}>A Classical Research Platform</p>
            </header>
            <main>
                <section style={{ marginBottom: '60px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        {loading ? (
                            <div style={{ color: '#C9A962' }}>Loading...</div>
                        ) : error ? (
                            <div style={{ color: '#DC2626' }}>{error}</div>
                        ) : (
                            <>
                                <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)' }}>
                                    <h2 style={{ color: '#E8D5A3' }}>{data.passages} Passages</h2>
                                </div>
                                <div style={{ padding: '20px', borderRadius: '10px', background: 'rgba(30,30,36,0.8)', backdropFilter: 'blur(10px)' }}>
                                    <h2 style={{ color: '#E8D5A3' }}>{data.authors} Authors</h2>
                                </div>
                            </>
                        )}
                    </div>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '60%',
                        transform: 'translate(-60%,-50%)',
                        color: '#3B82F6',
                        fontSize: '80px',
                        opacity: 0.1,
                        animation: 'float 6s ease-in-out infinite'
                    }}>
                        θ
                    </div>
                </section>
                <section style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                    {[...Array(5)].map((_, index) => (
                        <div key={index} style={{
                            width: '180px',
                            height: '100px',
                            margin: '10px',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px solid rgba(201,169,98,0.15)',
                            background: 'rgba(30,30,36,0.8)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 8px rgba(201,169,98,0.3)'
                        }}>
                            <h3 style={{ color: '#E8D5A3', textAlign: 'center' }}>Analysis {index + 1}</h3>
                        </div>
                    ))}
                </section>
                <section style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button style={{
                        margin: '10px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                        color: '#0D0D0F',
                        border: 'none',
                        cursor: 'pointer'
                    }}>Explore Now</button>
                    <button style={{
                        margin: '10px',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                        color: '#0D0D0F',
                        border: 'none',
                        cursor: 'pointer'
                    }}>Sign Up</button>
                </section>
            </main>
            <style jsx>{`
                @keyframes float {
                    0% { transform: translatey(0px); }
                    50% { transform: translatey(-20px); }
                    100% { transform: translatey(0px); }
                }
            `}</style>
        </div>
    );
}