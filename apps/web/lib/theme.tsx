```tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Theme types
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// CSS Variables
const cssVariables = `
  :root {
    --bg-color: #FFFFFF;
    --text-color: #1A1814;
    --accent-color: #8B2635;
    --transition: all 0.3s ease;
  }

  [data-theme="dark"] {
    --bg-color: #0D0D0F;
    --text-color: #F5F4F2;
    --accent-color: #8B2635;
  }

  * {
    transition: var(--transition);
  }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
  }

  .theme-toggle {
    background: none;
    border: 2px solid var(--accent-color);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  .theme-toggle:hover {
    background-color: var(--accent-color);
    transform: scale(1.05);
  }

  .theme-toggle svg {
    width: 20px;
    height: 20px;
    color: var(--accent-color);
    transition: var(--transition);
  }

  .theme-toggle:hover svg {
    color: var(--bg-color);
  }
`;

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

// useTheme Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Sun Icon Component
const SunIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

// Moon Icon Component
const MoonIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Theme Toggle Component
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

// Example usage component
export const ExampleApp: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px'
      }}>
        <h1 style={{ color: 'var(--accent-color)' }}>
          Theme System Demo
        </h1>
        <ThemeToggle />
      </div>
      
      <div style={{
        padding: '2rem',
        border: `2px solid var(--accent-color)`,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p>Current theme: <strong>{theme}</strong></p>
        <p style={{ color: 'var(--accent-color)' }}>
          This text uses the accent color
        </p>
      </div>
    </div>
  );
};

// Main App wrapper (use this in your _app.tsx or layout.tsx)
export const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};
```

## Usage Instructions:

1. **In your `_app.tsx` or `layout.tsx`:**
```tsx
import { App } from './path/to/theme-system';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <App>
          {children}
        </App>
      </body>
    </html>
  );
}
```

2. **In any component:**
```tsx
import { useTheme, ThemeToggle } from './path/to/theme-system';

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <h1>Current theme: {theme}</h1>
      <ThemeToggle />
    </div>
  );
}
```

**Features:**
- ✅ Automatic system theme detection
- ✅ Persistent theme storage in localStorage
- ✅ Smooth transitions between themes
- ✅ Hydration-safe (prevents SSR mismatches)
- ✅ Accessible theme toggle button
- ✅ CSS variables for easy styling
- ✅ Hover effects on toggle button
- ✅ Custom colors as specified

The system automatically detects the user's system preference on first visit and saves their choice for future visits.