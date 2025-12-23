```jsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// AuthContext
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('admin_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp > Date.now() / 1000) {
          setUser({ email: payload.email });
        } else {
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        setUser({ email: data.email });
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Login Page Component
export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Admin Login
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555' }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>
          
          {error && (
            <div style={{ 
              color: '#dc3545', 
              marginBottom: '1rem', 
              padding: '0.5rem',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Protected Route Wrapper
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Admin Header */}
      <header style={{
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Admin Panel</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Welcome, {user.email}</span>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
};

// Logout Button Component
const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      style={{
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Logout
    </button>
  );
};

// API Route Handler (for reference - should be in pages/api/auth/login.js or app/api/auth/login/route.js)
/*
// For pages/api/auth/login.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(JSON.stringify({
      email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    })).toString('base64');

    const jwt = `header.${token}.signature`;
    
    res.status(200).json({ 
      success: true, 
      token: jwt, 
      email 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}

// For app/api/auth/login/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(JSON.stringify({
      email,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    })).toString('base64');

    const jwt = `header.${token}.signature`;
    
    return NextResponse.json({ 
      success: true, 
      token: jwt, 
      email 
    });
  } else {
    return NextResponse.json(
      { message: 'Invalid credentials' }, 
      { status: 401 }
    );
  }
}
*/

// Usage Examples:

// In your app layout or _app.js:
/*
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
*/

// Login page (pages/admin/login.js or app/admin/login/page.js):
/*
import { LoginPage } from '../path/to/this/file';

export default function AdminLogin() {
  return <LoginPage />;
}
*/

// Protected admin page (pages/admin/dashboard.js or app/admin/dashboard/page.js):
/*
import { ProtectedRoute } from '../path/to/this/file';

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <p>This is a protected admin area.</p>
      </div>
    </ProtectedRoute>
  );
}
*/
```

This complete admin authentication system includes:

1. **AuthContext**: Manages authentication state, login/logout functions
2. **LoginPage**: Complete login form with error handling
3. **ProtectedRoute**: Wrapper that redirects unauthorized users
4. **JWT Storage**: Uses localStorage to persist authentication
5. **Environment Variables**: Checks against ADMIN_EMAIL and ADMIN_PASSWORD
6. **API Integration**: Ready for /api/auth/login endpoint

Key features:
- Automatic token validation on app load
- Token expiration handling
- Loading states
- Error handling
- Responsive design
- Admin header with logout button
- Automatic redirects

Don't forget to:
1. Set up your API route at `/api/auth/login`
2. Add ADMIN_EMAIL and ADMIN_PASSWORD to your .env file
3. Wrap your app with AuthProvider
4. Use ProtectedRoute for admin pages