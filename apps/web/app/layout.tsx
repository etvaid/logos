'use client'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LOGOS - AI-Powered Classical Research',
  description: 'Search 1.7M passages by meaning. 5 Analysis Layers. SEMANTIA. Higher-order discovery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}