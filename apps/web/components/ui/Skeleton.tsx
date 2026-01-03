'use client';

import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`
        bg-[#C9A962]/10 rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 border border-[#C9A962]/20 rounded-lg ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-[#C9A962]/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-[#C9A962]/5 border-b border-[#C9A962]/20">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-[#C9A962]/10 last:border-0"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonPassageViewer() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left - Source */}
      <div className="border border-[#C9A962]/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Center - Translation */}
      <div className="border border-[#C9A962]/20 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <SkeletonText lines={6} />
        <div className="mt-6 pt-4 border-t border-[#C9A962]/20">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-2 flex-1 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right - Intertexts */}
      <div className="border border-[#C9A962]/20 rounded-lg p-4">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonGraph() {
  return (
    <div className="border border-[#C9A962]/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="relative h-96 flex items-center justify-center">
        {/* Fake nodes */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 120;
          const x = 50 + Math.cos(angle) * radius / 4;
          const y = 50 + Math.sin(angle) * radius / 4;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          );
        })}
        {/* Center node */}
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}

// Wrapper to show skeleton while loading
export function SkeletonWrapper({
  loading,
  skeleton,
  children,
}: {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
}) {
  if (loading) return <>{skeleton}</>;
  return <>{children}</>;
}
