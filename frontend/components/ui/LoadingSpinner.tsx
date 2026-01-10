'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={`
        ${sizes[size]}
        border-[#C9A962]/30 border-t-[#C9A962]
        rounded-full animate-spin
        ${className}
      `}
    />
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-[#F5F3EF]/50">{message}</p>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-[#F5F3EF]/50">Loading LOGOS...</p>
      </div>
    </div>
  );
}
