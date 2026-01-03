'use client';

import { useState } from 'react';
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { useExplain } from '@/lib/hooks/useAI';

interface ExplainButtonProps {
  type: 'confidence' | 'translation' | 'intertext' | 'drift' | 'general';
  context: Record<string, unknown>;
  label?: string;
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ExplainButton({
  type,
  context,
  label = 'Explain',
  variant = 'ghost',
  size = 'sm',
  className = '',
}: ExplainButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { explanation, loading, error, explain, reset } = useExplain();

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      reset();
      return;
    }

    setIsOpen(true);
    await explain({ type, ...context });
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className="flex items-center gap-1"
      >
        <span className="text-base">💡</span>
        {label}
      </Button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 right-0 w-80 max-w-[90vw]">
          <Card padding="md" className="shadow-xl border border-[#C9A962]/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-[#C9A962]">AI Explanation</h4>
              <button
                onClick={() => { setIsOpen(false); reset(); }}
                className="text-[#F5F3EF]/50 hover:text-[#F5F3EF] text-lg"
              >
                ×
              </button>
            </div>

            {loading && (
              <div className="flex items-center gap-2 py-4">
                <LoadingSpinner size="sm" />
                <span className="text-sm text-[#F5F3EF]/50">Generating explanation...</span>
              </div>
            )}

            {error && (
              <div className="p-2 bg-red-900/20 border border-red-400/30 rounded text-xs text-red-400">
                {error}
              </div>
            )}

            {explanation && (
              <div className="text-sm text-[#F5F3EF]/80 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </div>
            )}

            {!loading && !error && !explanation && (
              <div className="text-sm text-[#F5F3EF]/50">
                Click to generate an AI-powered explanation...
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// Inline version that shows explanation below
export function ExplainInline({
  type,
  context,
  triggerLabel = 'Why this score?',
}: {
  type: 'confidence' | 'translation' | 'intertext' | 'drift' | 'general';
  context: Record<string, unknown>;
  triggerLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { explanation, loading, error, explain, reset } = useExplain();

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      reset();
      return;
    }

    setIsOpen(true);
    await explain({ type, ...context });
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        className="text-xs text-[#C9A962] hover:underline flex items-center gap-1"
      >
        <span>💡</span>
        {isOpen ? 'Hide explanation' : triggerLabel}
      </button>

      {isOpen && (
        <div className="p-3 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
          {loading && (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-xs text-[#F5F3EF]/50">Generating...</span>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-400">{error}</div>
          )}

          {explanation && (
            <div className="text-xs text-[#F5F3EF]/80 leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Gate badge with explanation
export function GateBadgeWithExplain({
  gate,
  passed,
  context,
}: {
  gate: string;
  passed: boolean;
  context: Record<string, unknown>;
}) {
  const [showExplain, setShowExplain] = useState(false);
  const { explanation, loading, explain, reset } = useExplain();

  const handleClick = async () => {
    if (showExplain) {
      setShowExplain(false);
      reset();
      return;
    }

    setShowExplain(true);
    await explain({
      type: 'general',
      question: `Explain why this passage ${passed ? 'passed' : 'failed'} the ${gate} gate. Context: ${JSON.stringify(context)}`,
    });
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={`
          px-2 py-0.5 text-xs rounded-full font-medium transition
          ${passed
            ? 'bg-green-900/30 text-green-400 border border-green-400/30'
            : 'bg-red-900/30 text-red-400 border border-red-400/30'
          }
          hover:opacity-80
        `}
        title={`Click to explain ${gate}`}
      >
        {gate} {passed ? '✓' : '✗'}
      </button>

      {showExplain && (
        <div className="absolute z-50 top-full mt-1 left-0 w-64">
          <Card padding="sm" className="shadow-lg text-xs">
            {loading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-[#F5F3EF]/50">Explaining...</span>
              </div>
            ) : (
              <div className="text-[#F5F3EF]/80">{explanation}</div>
            )}
            <button
              onClick={() => { setShowExplain(false); reset(); }}
              className="absolute top-1 right-2 text-[#F5F3EF]/50 hover:text-[#F5F3EF]"
            >
              ×
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
