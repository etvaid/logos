'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/learn" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px' }}>Learn</Link>
          <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px' }}>Research</Link>
          <Link href="/community" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px' }}>Community</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', flex: '1' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Available Courses</h1>

        {loading && <p style={{ color: '#9CA3AF' }}>Loading courses...</p>}

        {error && <p style={{ color: '#DC2626' }}>Error: {error}</p>}

        {!loading && !error && courses.length === 0 && (
          <p style={{ color: '#9CA3AF' }}>No courses available at the moment.</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <div key={course.id} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', transition: 'all 0.2s', ':hover': { boxShadow: '0 0 30px rgba(201,162,39,0.3)' } }}>
              <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>{course.title}</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>{course.description}</p>
              <Link href={`/learn/courses/${course.id}`} style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', transition: 'all 0.2s', ':hover': { backgroundColor: '#E8D5A3' } }}>
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}