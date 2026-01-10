'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#C9A962]/20 bg-[#0D0D0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Browse */}
          <div>
            <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Browse</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/library" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/reader" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Reader
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/translate" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Translate
                </Link>
              </li>
              <li>
                <Link href="/semantia" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  SEMANTIA
                </Link>
              </li>
              <li>
                <Link href="/analysis" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Analysis
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/chronos" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  CHRONOS
                </Link>
              </li>
              <li>
                <Link href="/connectome" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Connectome
                </Link>
              </li>
              <li>
                <Link href="/context" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Context
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Learn</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/learn" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/learn?lang=greek" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Greek
                </Link>
              </li>
              <li>
                <Link href="/learn?lang=latin" className="text-sm text-[#F5F3EF]/50 hover:text-[#C9A962]">
                  Latin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#C9A962]/20 text-center">
          <p className="text-sm text-[#F5F3EF]/50">
            <span className="text-[#C9A962]">LOGOS</span> — The Complete Classical Research Platform
          </p>
          <p className="text-xs text-[#F5F3EF]/30 mt-2">
            6.7M passages • 74,000+ authors • Powered by AI
          </p>
        </div>
      </div>
    </footer>
  );
}
