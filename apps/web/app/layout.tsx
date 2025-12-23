import type { Metadata } from 'next'
import FloatingGreekLetters from '@/components/FloatingGreekLetters'

export const metadata: Metadata = {
  title: 'LOGOS - Classical Text Analysis & Discovery',
  description: 'Explore ancient Greek and Latin texts with advanced analysis tools. Discover patterns, meanings, and connections across classical literature from archaic to Byzantine periods.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0D0D0F] text-[#F5F4F2] font-sans antialiased min-h-screen">
        <div className="relative min-h-screen">
          <FloatingGreekLetters />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}