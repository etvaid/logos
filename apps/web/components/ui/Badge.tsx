'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'greek' | 'latin' | 'hebrew';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#C9A962]/10 text-[#C9A962] border-[#C9A962]/20',
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border-red-500/20',
    greek: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    latin: 'bg-red-500/10 text-red-400 border-red-500/20',
    hebrew: 'bg-green-500/10 text-green-400 border-green-500/20',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`
        inline-flex items-center border rounded-full font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

export function LanguageBadge({ language }: { language: string }) {
  const lang = language.toLowerCase();
  const variant = lang === 'greek' ? 'greek' : lang === 'latin' ? 'latin' : lang === 'hebrew' ? 'hebrew' : 'default';

  return <Badge variant={variant}>{language}</Badge>;
}
