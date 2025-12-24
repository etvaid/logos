import type { Metadata } from 'next'
import './globals.css'
import FloatingGreekLetters from '@/components/FloatingGreekLetters'

export const metadata: Metadata = {
  title: 'LOGOS - Classical Text Analysis & Discovery',
  description: 'Explore ancient Greek and Latin texts with advanced analysis tools.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0D0D0F] text-[#F5F4F2] font-sans antialiased min-h-screen">
        <FloatingGreekLetters />
        {children}
      </body>
    </html>
  )
}
