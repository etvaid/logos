'use client';

import { useKeyboardShortcuts, KeyboardShortcutsHelp, PendingKeyIndicator } from '@/components/KeyboardShortcuts';

export default function KeyboardShortcutsProvider() {
  const { showHelp, setShowHelp, pendingKey } = useKeyboardShortcuts();

  return (
    <>
      <KeyboardShortcutsHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <PendingKeyIndicator pendingKey={pendingKey} />
    </>
  );
}
