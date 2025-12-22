'use client'

import { useState } from 'react'
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
  const [contacts, setContacts] = useState(professors)
  const [selectedContact, setSelectedContact] = useState<typeof professors[0] | null>(null)

  const sendEmail = (id: number) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'sent' } : c
    ))
    setSelectedContact(null)
  }

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Header */}
      <header className="glass border-b border-gold/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/" className="font-serif text-xl text-gold">LOGOS</Link>
            <span className="text-marble/50 ml-4">Harvard Outreach</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/admin" className="text-marble/70 hover:text-gold">Dashboard</Link>
            <Link href="/admin/outreach" className="text-gold">Outreach</Link>
            <Link href="/admin/growth" className="text-marble/70 hover:text-gold">Growth</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-gold">Harvard & Ivy Outreach</h1>
            <p className="text-marble/60 mt-1">Click "Send" to email professors with pre-written templates.</p>
          </div>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-obsidian-light rounded-lg text-marble/70">
              {contacts.filter(c => c.status === 'pending').length} pending
            </span>
            <span className="px-4 py-2 bg-emerald/20 rounded-lg text-emerald">
              {contacts.filter(c => c.status === 'sent').length} sent
            </span>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gold/20">
              <tr className="text-left">
                <th className="px-6 py-4 text-marble/50 font-medium">Name</th>
                <th className="px-6 py-4 text-marble/50 font-medium">Institution</th>
                <th className="px-6 py-4 text-marble/50 font-medium">Specialty</th>
                <th className="px-6 py-4 text-marble/50 font-medium">Status</th>
                <th className="px-6 py-4 text-marble/50 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-b border-gold/10 hover:bg-obsidian-light/50">
                  <td className="px-6 py-4">
                    <p className="text-marble font-medium">{contact.name}</p>
                    <p className="text-marble/50 text-sm">{contact.email}</p>
                  </td>
                  <td className="px-6 py-4 text-marble/70">{contact.institution}</td>
                  <td className="px-6 py-4 text-marble/70">{contact.specialty}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      contact.status === 'sent' 
                        ? 'bg-emerald/20 text-emerald' 
                        : 'bg-amber/20 text-amber'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {contact.status === 'pending' ? (
                      <button 
                        onClick={() => setSelectedContact(contact)}
                        className="px-4 py-2 bg-gold text-obsidian rounded font-medium hover:bg-gold-light transition-colors"
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

        {/* Email Preview Modal */}
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
LOGOS - logos-classics.com`}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedContact(null)}
                    className="flex-1 px-4 py-3 border border-gold/20 rounded text-marble/70 hover:text-marble transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => sendEmail(selectedContact.id)}
                    className="flex-1 px-4 py-3 bg-gold text-obsidian rounded font-medium hover:bg-gold-light transition-colors"
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
