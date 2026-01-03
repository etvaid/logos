'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'ui';
}

export function useKeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const shortcuts: Shortcut[] = [
    // Navigation shortcuts (g + key)
    { key: 'g h', description: 'Go to Home', action: () => router.push('/'), category: 'navigation' },
    { key: 'g p', description: 'Go to Passage Viewer', action: () => router.push('/reader'), category: 'navigation' },
    { key: 'g q', description: 'Go to Q Explorer', action: () => router.push('/q/explorer'), category: 'navigation' },
    { key: 'g m', description: 'Go to Intertextual Map', action: () => router.push('/intertexts/map'), category: 'navigation' },
    { key: 'g d', description: 'Go to Semantic Drift', action: () => router.push('/drift'), category: 'navigation' },
    { key: 'g t', description: 'Go to Translate', action: () => router.push('/translate'), category: 'navigation' },
    { key: 'g r', description: 'Go to Review Queue', action: () => router.push('/review'), category: 'navigation' },

    // Quick actions
    { key: '/', description: 'Focus search', action: () => focusSearch(), category: 'actions' },
    { key: '?', description: 'Show keyboard shortcuts', action: () => setShowHelp(true), category: 'ui' },
    { key: 'Escape', description: 'Close modal/panel', action: () => setShowHelp(false), category: 'ui' },
  ];

  const focusSearch = useCallback(() => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Handle ? for help
      if (e.key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Handle Escape
      if (key === 'escape') {
        setShowHelp(false);
        setPendingKey(null);
        return;
      }

      // Handle / for search
      if (key === '/' && !pendingKey) {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Handle g + key combinations
      if (pendingKey === 'g') {
        e.preventDefault();
        const combo = `g ${key}`;
        const shortcut = shortcuts.find((s) => s.key === combo);
        if (shortcut) {
          shortcut.action();
        }
        setPendingKey(null);
        return;
      }

      // Start pending key sequence
      if (key === 'g') {
        setPendingKey('g');
        timeout = setTimeout(() => setPendingKey(null), 1000);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [pendingKey, shortcuts, focusSearch]);

  return { showHelp, setShowHelp, shortcuts, pendingKey };
}

export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const categories = {
    navigation: 'Navigation',
    actions: 'Quick Actions',
    ui: 'UI',
  };

  const shortcuts = [
    { key: 'g h', description: 'Go to Home', category: 'navigation' },
    { key: 'g p', description: 'Go to Passage Viewer', category: 'navigation' },
    { key: 'g q', description: 'Go to Q Explorer', category: 'navigation' },
    { key: 'g m', description: 'Go to Intertextual Map', category: 'navigation' },
    { key: 'g d', description: 'Go to Semantic Drift', category: 'navigation' },
    { key: 'g t', description: 'Go to Translate', category: 'navigation' },
    { key: 'g r', description: 'Go to Review Queue', category: 'navigation' },
    { key: '/', description: 'Focus search', category: 'actions' },
    { key: '?', description: 'Show this help', category: 'ui' },
    { key: 'Esc', description: 'Close modal/panel', category: 'ui' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        padding="lg"
        className="max-w-lg w-full mx-4 shadow-2xl"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#C9A962]">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-[#F5F3EF]/50 hover:text-[#F5F3EF] text-2xl"
          >
            ×
          </button>
        </div>

        {Object.entries(categories).map(([key, label]) => (
          <div key={key} className="mb-6 last:mb-0">
            <h3 className="text-sm font-medium text-[#F5F3EF]/50 uppercase tracking-wide mb-3">
              {label}
            </h3>
            <div className="space-y-2">
              {shortcuts
                .filter((s) => s.category === key)
                .map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-1"
                  >
                    <span className="text-sm text-[#F5F3EF]/80">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-[#C9A962]/10 border border-[#C9A962]/30 rounded text-xs font-mono text-[#C9A962]">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="mt-6 pt-4 border-t border-[#C9A962]/20 text-center">
          <p className="text-xs text-[#F5F3EF]/40">
            Press <kbd className="px-1 py-0.5 bg-[#C9A962]/10 rounded">?</kbd> anytime to see this help
          </p>
        </div>
      </Card>
    </div>
  );
}

// Pending key indicator
export function PendingKeyIndicator({ pendingKey }: { pendingKey: string | null }) {
  if (!pendingKey) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg shadow-lg font-mono text-sm">
        {pendingKey} + ...
      </div>
    </div>
  );
}
