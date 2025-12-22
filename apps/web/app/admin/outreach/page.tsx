'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const professors = [
  { id: 1, name: 'Gregory Nagy', email: 'nagy@chs.harvard.edu', institution: 'Harvard', specialty: 'Homer, Greek poetry', status: 'pending' },
  { id: 2, name: 'Richard Thomas', email: 'rthomas@fas.harvard.edu', institution: 'Harvard', specialty: 'Virgil, intertextuality', status: 'pending' },
  { id: 3, name: 'Kathleen Coleman', email: 'kcoleman@fas.harvard.edu', institution: 'Harvard', specialty: 'Latin, Roman spectacle', status: 'pending' },
  { id: 4, name: 'Mark Schiefsky', email: 'schiefsk@fas.harvard.edu', institution: 'Harvard', specialty: 'Ancient science, DH', status: 'pending' },
  { id: 5, name: 'Emma Dench', email: 'edench@fas.harvard.edu', institution: 'Harvard', specialty: 'Roman history', status: 'pending' },
  { id: 6, name: 'Emily Greenwood', email: 'emily_greenwood@harvard.edu', institution: 'Harvard', specialty: 'Classics and race', status: 'pending' },
  { id: 7, name: 'Christopher Krebs', email: 'ckrebs@stanford.edu', institution: 'Stanford', specialty: 'Latin literature', status: 'pending' },
  { id: 8, name: 'Denis Feeney', email: 'dfeeney@princeton.edu', institution: 'Princeton', specialty: 'Latin poetry', status: 'pending' },
]

export default function OutreachPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState(professors)
  const [selectedContact, setSelectedContact] = useState<typeof professors[0] | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('logos_admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const sendEmail = (id: number) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'sent' } : c
    ))
    setSelectedContact(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('logos_admin_token')
    router.push('/admin/login')
  }

  if (isLoading) {
    return <main className="min-h-screen bg-obsidian flex items-center justify-center"><p className="text-marble/50">Loading...</p></main>
  }

  if (!isAuthenticated) return null

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
            <span className="text-marble/50">Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-marble/70 hover:text-gold transition-colors">Dashboard</Link>
            <Link href="/admin/outreach" className="text-gold">Outreach</Link>
            <Link href="/admin/twitter" className="text-marble/70 hover:text-gold transition-colors">Twitter</Link>
            <Link href="/admin/analytics" className="text-marble/70 hover:text-gold transition-colors">Analytics</Link>
            <button onClick={handleLogout} className="text-crimson hover:text-crimson/80">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-gold">Harvard & Ivy Outreach</h1>
            <p className="text-marble/60 mt-1">Click to preview and send emails to professors.</p>
          </div>
          <div className="text-marble/50 text-sm">
            {contacts.filter(c => c.status === 'sent').length} / {contacts.length} sent
          </div>
        </div>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-obsidian-light">
              <tr>
                <th className="text-left px-6 py-4 text-marble/70 font-medium">Name</th>
                <th className="text-left px-6 py-4 text-marble/70 font-medium">Institution</th>
                <th className="text-left px-6 py-4 text-marble/70 font-medium">Specialty</th>
                <th className="text-left px-6 py-4 text-marble/70 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-marble/70 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-t border-gold/10">
                  <td className="px-6 py-4">
                    <div className="text-marble font-medium">{contact.name}</div>
                    <div className="text-marble/50 text-sm">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 text-marble/70">{contact.institution}</td>
                  <td className="px-6 py-4 text-marble/70">{contact.specialty}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${contact.status === 'sent' ? 'bg-emerald/20 text-emerald' : 'bg-amber/20 text-amber'}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {contact.status === 'pending' ? (
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="px-4 py-2 bg-gold text-obsidian rounded-lg text-sm font-medium hover:bg-gold-light transition-colors"
                      >
                        Preview & Send
                      </button>
                    ) : (
                      <span className="text-marble/50">Sent ✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedContact && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gold/20">
                <h2 className="font-serif text-xl text-gold">Email Preview</h2>
                <p className="text-marble/60">To: {selectedContact.name} ({selectedContact.email})</p>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="text-marble/50 text-sm">Subject</label>
                  <p className="text-marble">LOGOS — AI-powered classical research platform</p>
                </div>
                
                <div className="mb-6">
                  <label className="text-marble/50 text-sm">Message</label>
                  <div className="bg-obsidian-light rounded-lg p-4 mt-2 text-marble/80 whitespace-pre-line">
{`Dear Professor ${selectedContact.name},

I'm reaching out because your work on ${selectedContact.specialty} has been foundational for my project.

I've built LOGOS, an AI-powered platform for classical research that offers:

• Cross-lingual semantic search across 69M words of Greek & Latin
• AI translation in 3 styles (literal, literary, student)
• Automated intertextuality detection
• Higher-order pattern discovery

Would you have 15 minutes this week for a brief demo?

Best regards,
Ettan Tau Vaid
LOGOS — https://logos-classics.com`}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 px-4 py-3 border border-gold/20 rounded-lg text-marble/70 hover:text-marble transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => sendEmail(selectedContact.id)}
                    className="flex-1 px-4 py-3 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
