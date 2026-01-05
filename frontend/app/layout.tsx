import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LOGOS - Classical Research Platform',
  description: 'Revolutionary tools for classical scholarship',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D0D0F] text-[#F5F3EF] min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  )
}
