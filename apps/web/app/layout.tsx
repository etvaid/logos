import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LOGOS | AI-Powered Classical Research Platform',
  description: 'Search 69M+ words of Greek & Latin by meaning. AI translation, intertextuality detection, and higher-order discovery. Free for students.',
  keywords: ['classical research', 'Greek', 'Latin', 'AI translation', 'semantic search', 'digital humanities', 'Homer', 'Virgil'],
  authors: [{ name: 'LOGOS' }],
  openGraph: {
    title: 'LOGOS | AI-Powered Classical Research Platform',
    description: 'Search 69M+ words of Greek & Latin by meaning.',
    url: 'https://logosclassics.com',
    siteName: 'LOGOS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LogosClassics',
    title: 'LOGOS | AI-Powered Classical Research',
    description: 'Search 69M+ words of Greek & Latin by meaning.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-obsidian text-marble min-h-screen">
        {/* Floating Greek Letters Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'].map((letter, i) => (
            <span
              key={i}
              className="absolute text-gold floating-letter font-greek"
              style={{
                fontSize: `${4 + (i % 3)}rem`,
                left: `${5 + i * 12}%`,
                top: `${10 + (i * 17) % 80}%`,
                animationDelay: `${i * -2.5}s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
