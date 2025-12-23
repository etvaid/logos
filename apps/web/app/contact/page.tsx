import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      padding: '2rem',
      fontFamily: 'sans-serif',
    }}>

      <h1 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#C9A227'
      }}>Contact Us</h1>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>

        {/* Contact Form */}
        <div style={{
          backgroundColor: '#1E1E24',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#F5F4F2', fontWeight: 'bold' }}>Send us a Message</h2>
          <form>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: '#F5F4F2' }}>Name:</label>
              <input type="text" id="name" name="name" style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #4A5568',
                backgroundColor: '#2D3748',
                color: '#F5F4F2',
              }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: '#F5F4F2' }}>Email:</label>
              <input type="email" id="email" name="email" style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #4A5568',
                backgroundColor: '#2D3748',
                color: '#F5F4F2',
              }} />
            </div>
             <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="institution" style={{ display: 'block', marginBottom: '0.5rem', color: '#F5F4F2' }}>Institution (optional):</label>
              <input type="text" id="institution" name="institution" style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #4A5568',
                backgroundColor: '#2D3748',
                color: '#F5F4F2',
              }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: '#F5F4F2' }}>Message:</label>
              <textarea id="message" name="message" rows={4} style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #4A5568',
                backgroundColor: '#2D3748',
                color: '#F5F4F2',
                resize: 'vertical',
              }} />
            </div>
            <button type="submit" style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.2s ease-in-out',
            }}>Submit</button>
          </form>
        </div>

        {/* Other Contact Information */}
        <div style={{
          backgroundColor: '#1E1E24',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#F5F4F2', fontWeight: 'bold' }}>More Ways to Connect</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Email:</strong> <a href="mailto:hello@logosclassics.com" style={{ color: '#3B82F6', textDecoration: 'none' }}>hello@logosclassics.com</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Twitter:</strong> <a href="https://twitter.com/LogosClassics" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'none' }}>@LogosClassics</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>GitHub:</strong> (GitHub Link Placeholder)
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>For Academics:</strong> Research Collaboration Inquiry (link to separate form/page)
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>For Institutions:</strong> Sales Inquiry (link to separate form/page)
            </li>
            <li>
              <strong>Office Hours (Demos):</strong> [Placeholder for Scheduling Link/Info]
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;