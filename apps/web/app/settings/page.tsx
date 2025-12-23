import React, { useState } from 'react';

// Define the type for the profile section
interface Profile {
  name: string;
  email: string;
  institution: string;
}

const UserSettings: React.FC = () => {
  // State management for each section
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    institution: ''
  });

  const [preferences, setPreferences] = useState({
    translationStyle: 'classic',
    sourceLanguage: 'Greek',
    resultsPerPage: 10,
    showSideBySide: true
  });

  const [appearance, setAppearance] = useState({
    themeMode: 'dark',
    fontSize: 'medium',
    greekFont: 'default'
  });

  const [api, setApi] = useState({
    apiKey: 'your-api-key',
    usageStats: 'N/A'
  });

  // Change handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleAppearanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppearance({ ...appearance, [e.target.name]: e.target.value });
  };

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApi({ ...api, [e.target.name]: e.target.value });
  };

  // User settings page rendering
  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '20px' }}>
      <h1>User Settings</h1>
      <form>
        <section>
          <h2>Profile</h2>
          <input
            name="name"
            placeholder="Name"
            value={profile.name}
            onChange={handleProfileChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={profile.email}
            onChange={handleProfileChange}
          />
          <input
            name="institution"
            placeholder="Institution"
            value={profile.institution}
            onChange={handleProfileChange}
          />
        </section>

        <section>
          <h2>Preferences</h2>
          <label>
            Default Translation Style:
            <select name="translationStyle" value={preferences.translationStyle} onChange={handlePreferencesChange}>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </label>
          <label>
            Default Source Language:
            <select name="sourceLanguage" value={preferences.sourceLanguage} onChange={handlePreferencesChange}>
              <option value="Greek">Greek</option>
              <option value="Latin">Latin</option>
            </select>
          </label>
          <label>
            Results Per Page:
            <input
              name="resultsPerPage"
              type="number"
              value={preferences.resultsPerPage}
              onChange={handlePreferencesChange}
            />
          </label>
          <label>
            Show Greek/Latin side by side:
            <input
              name="showSideBySide"
              type="checkbox"
              checked={preferences.showSideBySide}
              onChange={(e) => setPreferences({ ...preferences, showSideBySide: e.target.checked })}
            />
          </label>
        </section>

        <section>
          <h2>Appearance</h2>
          <label>
            Theme Mode:
            <select name="themeMode" value={appearance.themeMode} onChange={handleAppearanceChange}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>
          <label>
            Font Size:
            <select name="fontSize" value={appearance.fontSize} onChange={handleAppearanceChange}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
          <label>
            Greek Font Choice:
            <select name="greekFont" value={appearance.greekFont} onChange={handleAppearanceChange}>
              <option value="default">Default</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
            </select>
          </label>
        </section>

        <section>
          <h2>API</h2>
          <label>
            API Key:
            <input
              name="apiKey"
              type="text"
              disabled
              value={api.apiKey}
              onChange={handleApiChange}
            />
          </label>
          <p>Usage Stats: {api.usageStats}</p>
        </section>

        <section>
          <h2>Notifications</h2>
          {/* Notifications Setup UI goes here */}
        </section>

        <section>
          <h2>Export/Delete Data</h2>
          {/* Export and delete data controls go here */}
        </section>
      </form>
    </div>
  );
};

export default UserSettings;