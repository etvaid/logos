'use client';

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Loader } from 'lucide-react';

export default function ReaderHub() {
    const [works, setWorks] = useState([]);
    const [selectedWork, setSelectedWork] = useState('');
    const [recentReads, setRecentReads] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const worksResponse = await fetch('/api/works');
                const recentReadsResponse = await fetch('/api/recent-reads');
                const bookmarksResponse = await fetch('/api/bookmarks');

                if (!worksResponse.ok || !recentReadsResponse.ok || !bookmarksResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const worksData = await worksResponse.json();
                const recentReadsData = await recentReadsResponse.json();
                const bookmarksData = await bookmarksResponse.json();

                setWorks(worksData);
                setRecentReads(recentReadsData);
                setBookmarks(bookmarksData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleWorkChange = (event) => {
        setSelectedWork(event.target.value);
    };

    const handleContinueReading = () => {
        alert(`Continuing reading: ${selectedWork}`);
    };

    return (
        <div style={{ backgroundColor: '#0D0D0F', padding: '20px', color: '#F5F3EF' }}>
            <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Reader Hub</h1>

            {loading ? (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <Loader size={48} style={{ color: '#C9A962' }} />
                </div>
            ) : error ? (
                <div style={{ color: '#DC2626', textAlign: 'center' }}>
                    <p>Error: {error}</p>
                </div>
            ) : (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="work-selector" style={{ marginRight: '10px' }}>Select Work:</label>
                        <select
                            id="work-selector"
                            value={selectedWork}
                            onChange={handleWorkChange}
                            style={{
                                backgroundColor: '#1E1E24',
                                color: '#F5F3EF',
                                border: '1px solid rgba(201,169,98,0.15)',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            <option value="" disabled>Select a work</option>
                            {works.map((work) => (
                                <option key={work.id} value={work.id}>{work.title}</option>
                            ))}
                        </select>
                    </div>

                    <h2 style={{ borderBottom: '1px solid rgba(201,169,98,0.15)' }}>Recent Reads</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {recentReads.map((read) => (
                            <li key={read.id} style={{ margin: '10px 0', backgroundColor: '#1E1E24', padding: '10px', borderRadius: '5px' }}>
                                <BookOpen size={16} style={{ marginRight: '10px', color: '#C9A962' }} />
                                {read.title}
                            </li>
                        ))}
                    </ul>

                    <h2 style={{ borderBottom: '1px solid rgba(201,169,98,0.15)', marginTop: '20px' }}>Bookmarks</h2>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {bookmarks.map((bookmark) => (
                            <li key={bookmark.id} style={{ margin: '10px 0', backgroundColor: '#1E1E24', padding: '10px', borderRadius: '5px' }}>
                                <BookOpen size={16} style={{ marginRight: '10px', color: '#C9A962' }} />
                                {bookmark.title}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleContinueReading}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            background: 'linear-gradient(135deg, #C9A962, #E8D5A3)',
                            color: '#0D0D0F',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        Continue Reading
                    </button>
                </div>
            )}
        </div>
    );
}