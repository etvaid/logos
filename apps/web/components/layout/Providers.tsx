'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui';
import KeyboardShortcutsProvider from './KeyboardShortcutsProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <KeyboardShortcutsProvider />
    </ToastProvider>
  );
}
