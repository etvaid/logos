'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: ''
  });
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    type: 'translation'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, assignmentsRes] = await Promise.all([
        fetch('/api/teacher/students'),
        fetch('/api/teacher/assignments')
      ]);

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teacher/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        const student = await response.json();
        setStudents([...students, student]);
        setNewStudent({ name: '', email: '', grade: '' });
        setShowCreateStudent(false);
      }
    } catch (err) {
      setError('Failed to create student');
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/teacher/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        const assignment = await response.json();
        setAssignments([...assignments, assignment]);
        setNewAssignment({ title: '', description: '', dueDate: '', type: 'translation' });
        setShowCreateAssignment(false);
      }
    } catch (err) {
      setError('Failed to create assignment');
    }
  };

  const removeStudent = async (studentId) => {
    try {
      const response = await fetch(`/api/teacher/students/${studentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStudents(students.filter(s => s.id !== studentId));
      }
    } catch (err) {
      setError('Failed to remove student');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div style={{ color: '#9CA3AF', fontSize: '18px' }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Learn
            </Link>
            <Link href="/library" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Library
            </Link>
            <div style={{ padding: '8px 16px', backgroundColor: '#C9A227', color: '#0D0D0F', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
              Teacher
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{ backgroundColor: '#DC2626', color: '#F5F4F2', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#F5F4F2' }}>
            Teacher Dashboard
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '16px' }}>
            Manage your students and assignments
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <button
            onClick={() => setActiveTab('students')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: activeTab === 'students' ? '#C9A227' : '#1E1E24',
              color: activeTab === 'students' ? '#0D0D0F' : '#F5F4F2',
              transition: 'all 0.2s'
            }}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: activeTab === 'assignments' ? '#C9A227' : '#1E1E24',
              color: activeTab === 'assignments' ? '#0D0D0F' : '#F5F4F2',
              transition: 'all 0.2s'
            }}
          >
            Assignments ({assignments.length})
          </button>
        </div>

        {activeTab === 'students' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5F4F2' }}>Students</h2>
              <button
                onClick={() => setShowCreateStudent(true)}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                Add Student
              </button>
            </div>

            {showCreateStudent && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
                  Add New Student
                </h3>
                <form onSubmit={createStudent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input
                    type="text"
                    placeholder="Student Name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                    required
                  />
                  <select
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                    required
                  >
                    <option value="">Select Grade Level</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                    <option value="college">College</option>
                  </select>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#C9A227',
                        color: '#0D0D0F',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Add Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateStudent(false)}
                      style={{
                        backgroundColor: '#4B5563',
                        color: '#F5F4F2',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {students.length === 0 ? (
                <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '16px' }}>No students yet. Add your first student to get started.</p>
                </div>
              ) : (
                students.map((student, index) => (
                  <div key={student.id || index} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px', color: '#F5F4F2' }}>
                        {student.name}
                      </h3>
                      <p style={{ color: '#9CA3AF', marginBottom: '4px' }}>{student.email}</p>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          backgroundColor: '#C9A227', 
                          color: '#0D0D0F', 
                          borderRadius: '4px', 
                          fontSize: '12px', 
                          fontWeight: 'bold' 
                        }}>
                          Grade {student.grade}
                        </span>
                        <span style={{ color: '#6B7280', fontSize: '14px' }}>
                          Progress: {student.progress || 0}%
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link 
                        href={`/learn/teacher/student/${student.id}`}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#3B82F6',
                          color: '#F5F4F2',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        View Progress
                      </Link>
                      <button
                        onClick={() => removeStudent(student.id)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#DC2626',
                          color: '#F5F4F2',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5F4F2' }}>Assignments</h2>
              <button
                onClick={() => setShowCreateAssignment(true)}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.2s'
                }}
              >
                Create Assignment
              </button>
            </div>

            {showCreateAssignment && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
                  Create New Assignment
                </h3>
                <form onSubmit={createAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input
                    type="text"
                    placeholder="Assignment Title"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                    required
                  />
                  <textarea
                    placeholder="Assignment Description"
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                    required
                  />
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                    required
                  />
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })}
                    style={{
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      color: '#F5F4F2',
                      fontSize: '16px'
                    }}
                  >
                    <option value="translation">Translation Exercise</option>
                    <option value="grammar">Grammar Practice</option>
                    <option value="vocabulary">Vocabulary Quiz</option>
                    <option value="reading">Reading Comprehension</option>
                  </select>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#C9A227',
                        color: '#0D0D0F',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Create Assignment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateAssignment(false)}
                      style={{
                        backgroundColor: '#4B5563',
                        color: '#F5F4F2',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ display: 'grid', gap: '16px' }}>
              {assignments.length === 0 ? (
                <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '16px' }}>No assignments yet. Create your first assignment to get started.</p>
                </div>
              ) : (
                assignments.map((assignment, index) => (
                  <div key={assignment.id || index} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#F5F4F2' }}>
                          {assignment.title}
                        </h3>
                        <p style={{ color: '#9CA3AF', marginBottom: '12px', lineHeight: '1.5' }}>
                          {assignment.description}
                        </p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            backgroundColor: assignment.type === 'translation' ? '#3B82F6' : 
                                            assignment.type === 'grammar' ? '#DC2626' :
                                            assignment.type === 'vocabulary' ? '#D97706' : '#059669', 
                            color: '#F5F4F2', 
                            borderRadius: '4px', 
                            fontSize: '12px', 
                            fontWeight: 'bold' 
                          }}>
                            {assignment.type.charAt(0).toUpperCase() + assignment.type.slice(1)}
                          </span>
                          <span style={{ color: '#6B7280', fontSize: '14px' }}>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </span>
                          <span style={{ color: '#6B7280', fontSize: '14px' }}>
                            Submissions: {assignment.submissions || 0}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Link 
                          href={`/learn/teacher/assignment/${assignment.id}`}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#C9A227',
                            color: '#0D0D0F',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          View Submissions
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}