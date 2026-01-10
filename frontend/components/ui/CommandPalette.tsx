'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  href?: string;
  action?: () => void;
  category: string;
}

const defaultCommands: CommandItem[] = [
  // Navigation
  { id: 'home', title: 'Home', icon: '🏠', href: '/', category: 'Navigation' },
  { id: 'passage', title: 'Passage Viewer', subtitle: 'Read with split view', icon: '📖', href: '/passage', category: 'Navigation' },
  { id: 'quality', title: 'Translation Quality', subtitle: 'Dashboard & scores', icon: '📊', href: '/translations/quality', category: 'Navigation' },
  { id: 'q-explorer', title: 'Q Explorer', subtitle: 'Reconstruction analysis', icon: '👻', href: '/q/explorer', category: 'Navigation' },
  { id: 'intertexts', title: 'Intertextual Map', subtitle: 'Force-directed graph', icon: '🕸️', href: '/intertexts/map', category: 'Navigation' },
  { id: 'drift', title: 'Semantic Drift', subtitle: 'Term evolution', icon: '📈', href: '/drift', category: 'Navigation' },
  { id: 'library', title: 'Library', icon: '📚', href: '/library', category: 'Navigation' },
  { id: 'translate', title: 'Translate', icon: '🌐', href: '/translate', category: 'Navigation' },
  { id: 'search', title: 'Search', icon: '🔍', href: '/search', category: 'Navigation' },

  // Quick Actions
  { id: 'random-passage', title: 'Random Passage', subtitle: 'Discover something new', icon: '🎲', href: '/passage/random', category: 'Quick Actions' },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredCommands = defaultCommands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.subtitle?.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const selected = filteredCommands[selectedIndex];
          if (selected) {
            if (selected.href) {
              router.push(selected.href);
            } else if (selected.action) {
              selected.action();
            }
            setIsOpen(false);
            setQuery('');
          }
          break;
      }
    },
    [isOpen, filteredCommands, selectedIndex, router]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setQuery('');
        }}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-xl mx-4 bg-[#1A1A1D] border border-[#C9A962]/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-[#C9A962]/20">
          <svg className="w-5 h-5 text-[#C9A962]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-[#F5F3EF] placeholder-[#F5F3EF]/40 outline-none text-lg"
          />
          <kbd className="hidden sm:block px-2 py-1 text-xs text-[#F5F3EF]/50 bg-[#0D0D0F] rounded border border-[#C9A962]/20">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className="mb-4">
              <div className="px-3 py-1.5 text-xs font-medium text-[#C9A962]/70 uppercase tracking-wide">
                {category}
              </div>
              {commands.map((cmd) => {
                const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id);
                const isSelected = globalIndex === selectedIndex;

                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      if (cmd.href) {
                        router.push(cmd.href);
                      } else if (cmd.action) {
                        cmd.action();
                      }
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-[#C9A962]/20 text-[#F5F3EF]'
                        : 'text-[#F5F3EF]/70 hover:bg-[#C9A962]/10'
                    }`}
                  >
                    <span className="text-xl">{cmd.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{cmd.title}</div>
                      {cmd.subtitle && (
                        <div className="text-sm text-[#F5F3EF]/50 truncate">{cmd.subtitle}</div>
                      )}
                    </div>
                    {isSelected && (
                      <kbd className="px-2 py-0.5 text-xs text-[#F5F3EF]/50 bg-[#0D0D0F] rounded">
                        Enter
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="py-8 text-center text-[#F5F3EF]/50">
              No commands found for "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#C9A962]/20 text-xs text-[#F5F3EF]/40">
          <div className="flex gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-[#0D0D0F] rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-[#0D0D0F] rounded">↵</kbd> Select</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 bg-[#0D0D0F] rounded">⌘K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
