'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Library', href: '/library' },
  { name: 'Reader', href: '/reader' },
  { name: 'Search', href: '/search' },
  { name: 'Translate', href: '/translate' },
  { name: 'SEMANTIA', href: '/semantia' },
  { name: 'CHRONOS', href: '/chronos' },
  { name: 'Learn', href: '/learn' },
];

const moreLinks = [
  { name: 'Connectome', href: '/connectome' },
  { name: 'Analysis', href: '/analysis' },
  { name: 'Synoptic', href: '/synoptic' },
  { name: 'Calibration', href: '/calibration' },
  { name: 'Atlas', href: '/atlas' },
  { name: 'Ghost', href: '/ghost' },
  { name: 'Forensic', href: '/forensic' },
  { name: 'Context', href: '/context' },
  { name: 'Research', href: '/research' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-sm border-b border-[#C9A962]/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#C9A962]">LOGOS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-[#C9A962]/20 text-[#C9A962]'
                        : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10'
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="px-3 py-2 text-sm font-medium text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10 rounded-lg transition-all flex items-center gap-1"
              >
                More
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {moreMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMoreMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg shadow-xl z-20">
                    {moreLinks.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMoreMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F5F3EF]/70 hover:text-[#F5F3EF]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#C9A962]/20">
            <div className="flex flex-col gap-1">
              {[...navigation, ...moreLinks].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      px-4 py-3 text-sm font-medium rounded-lg
                      ${
                        isActive
                          ? 'bg-[#C9A962]/20 text-[#C9A962]'
                          : 'text-[#F5F3EF]/70 hover:bg-[#C9A962]/10'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
