'use client';

import { useState, useEffect, ReactNode } from 'react';

interface InspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

const widthClasses = {
  sm: 'w-80',
  md: 'w-96',
  lg: 'w-[480px]',
};

export function InspectorDrawer({
  isOpen,
  onClose,
  title,
  children,
  width = 'md',
}: InspectorDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop - only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 bg-[#1A1A1D] border-l border-[#C9A962]/20 shadow-2xl transform transition-transform duration-300 ease-out ${
          widthClasses[width]
        } ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#C9A962]/20">
          <h2 className="text-lg font-semibold text-[#C9A962]">{title || 'Inspector'}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F5F3EF]/60 hover:text-[#F5F3EF] hover:bg-[#C9A962]/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-57px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}

// Inspector section component for consistent styling
export function InspectorSection({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full mb-3 ${
          collapsible ? 'cursor-pointer' : 'cursor-default'
        }`}
        disabled={!collapsible}
      >
        <h3 className="text-sm font-medium text-[#C9A962] uppercase tracking-wide">
          {title}
        </h3>
        {collapsible && (
          <svg
            className={`w-4 h-4 text-[#F5F3EF]/50 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

// Metric display component
export function InspectorMetric({
  label,
  value,
  unit,
  color,
  trend,
}: {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'gold' | 'green' | 'red' | 'blue';
  trend?: 'up' | 'down' | 'neutral';
}) {
  const colorClasses = {
    gold: 'text-[#C9A962]',
    green: 'text-green-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-[#C9A962]/10 last:border-0">
      <span className="text-sm text-[#F5F3EF]/60">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`font-medium ${color ? colorClasses[color] : 'text-[#F5F3EF]'}`}>
          {value}
          {unit && <span className="text-xs text-[#F5F3EF]/40 ml-0.5">{unit}</span>}
        </span>
        {trend && (
          <span
            className={`text-xs ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-[#F5F3EF]/40'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
    </div>
  );
}

// Gauge component for scores
export function InspectorGauge({
  value,
  max = 100,
  label,
  color = 'gold',
}: {
  value: number;
  max?: number;
  label: string;
  color?: 'gold' | 'green' | 'red' | 'blue';
}) {
  const percentage = (value / max) * 100;
  const colorClasses = {
    gold: 'bg-[#C9A962]',
    green: 'bg-green-400',
    red: 'bg-red-400',
    blue: 'bg-blue-400',
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-[#F5F3EF]/60">{label}</span>
        <span className="text-sm font-medium text-[#F5F3EF]">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}

export default InspectorDrawer;
