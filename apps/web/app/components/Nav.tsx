'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { name: 'LOGOS', href: '/', isLogo: true },
    { name: 'Search', href: '/search' },
    { name: 'Translate', href: '/translate' },
    { name: 'Discover', href: '/discover' },
    { name: 'SEMANTIA', href: '/semantia' },
    { name: 'Maps', href: '/maps' },
    { name: 'Docs', href: '/docs' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0D0D0F]/80 border-b border-[#1E1E24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  transition-colors duration-200 font-medium
                  ${link.isLogo 
                    ? 'text-[#C9A227] text-xl font-bold hover:text-[#C9A227]/80' 
                    : isActive(link.href)
                    ? 'text-[#C9A227]'
                    : 'text-[#F5F4F2] hover:text-[#C9A227]'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center justify-between w-full">
            <Link
              href="/"
              className="text-[#C9A227] text-xl font-bold"
            >
              LOGOS
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#F5F4F2] hover:text-[#C9A227] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#1E1E24] border-t border-[#1E1E24] absolute left-0 right-0 top-16 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              {links.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    block py-2 px-3 rounded-md transition-colors duration-200
                    ${isActive(link.href)
                      ? 'text-[#C9A227] bg-[#C9A227]/10'
                      : 'text-[#F5F4F2] hover:text-[#C9A227] hover:bg-[#C9A227]/5'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}