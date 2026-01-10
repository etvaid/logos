import './globals.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components - they won't block initial page render
const Header = dynamic(() => import('@/components/layout/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/ui/CommandPalette'), { ssr: false });
const KeyboardShortcutsProvider = dynamic(
  () => import('@/components/layout/KeyboardShortcutsProvider'),
  { ssr: false }
);

export const metadata = {
  title: 'LOGOS - The Complete Classical Research Platform',
  description: '6.7M passages of Greek, Latin, and ancient texts with AI-powered analysis, translation, and discovery tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0D0D0F] text-[#F5F3EF] antialiased">
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="min-h-screen">{children}</main>
        <Suspense fallback={null}>
          <Footer />
          <CommandPalette />
          <KeyboardShortcutsProvider />
        </Suspense>
      </body>
    </html>
  );
}
