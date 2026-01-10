/**
 * DESIGN TOKENS
 *
 * Centralized design tokens for consistent spacing, typography, and visual
 * hierarchy across the LOGOS platform.
 *
 * Usage:
 * ```tsx
 * import { SPACING, TYPOGRAPHY, COLORS } from '@/lib/design-tokens';
 *
 * <section className={SPACING.section.hero}>
 *   <h1 className={TYPOGRAPHY.heading.h1}>Title</h1>
 * </section>
 * ```
 */

/**
 * SPACING SYSTEM
 * Generous, consistent spacing for professional academic aesthetic
 */
export const SPACING = {
  /**
   * Section-level spacing (vertical padding for major page sections)
   */
  section: {
    /** Hero sections at top of pages - most generous */
    hero: 'py-20 md:py-24 lg:py-32',

    /** Main content sections - generous */
    main: 'py-16 md:py-20 lg:py-24',

    /** Compact sections for dense content */
    compact: 'py-12 md:py-16',

    /** Minimal spacing for tightly grouped content */
    minimal: 'py-8 md:py-12',
  },

  /**
   * Card and component-level spacing
   */
  card: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },

  /**
   * Gap spacing for flex/grid layouts
   */
  gap: {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  },

  /**
   * Margin utilities
   */
  margin: {
    section: 'mb-16 md:mb-20 lg:mb-24',
    subsection: 'mb-12 md:mb-16',
    element: 'mb-6 md:mb-8',
  },
} as const;

/**
 * TYPOGRAPHY SYSTEM
 * Academic, readable typography scale
 */
export const TYPOGRAPHY = {
  heading: {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    h5: 'text-lg md:text-xl font-semibold',
    h6: 'text-base md:text-lg font-semibold',
  },

  body: {
    large: 'text-lg md:text-xl leading-relaxed',
    base: 'text-base md:text-lg leading-relaxed',
    small: 'text-sm md:text-base leading-relaxed',
  },

  display: {
    large: 'text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter',
    medium: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    small: 'text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight',
  },

  code: {
    inline: 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded',
    block: 'font-mono text-sm',
  },
} as const;

/**
 * COLOR PALETTE
 * Professional academic color scheme
 */
export const COLORS = {
  primary: {
    DEFAULT: '#C9A962',  // Academic gold
    light: '#E5D4A6',
    dark: '#9A7E3F',
    hover: '#B89752',
  },

  text: {
    primary: '#1A1A1A',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
  },

  background: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
    tertiary: '#E5E5E5',
    dark: '#1A1A1A',
  },

  border: {
    DEFAULT: '#E5E5E5',
    dark: '#CCCCCC',
  },

  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;

/**
 * LAYOUT SYSTEM
 * Container and layout utilities
 */
export const LAYOUT = {
  container: {
    full: 'container mx-auto px-4 md:px-6 lg:px-8',
    narrow: 'container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl',
    wide: 'container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl',
  },

  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  },
} as const;

/**
 * ANIMATION & TRANSITIONS
 */
export const TRANSITIONS = {
  fast: 'transition-all duration-150 ease-in-out',
  base: 'transition-all duration-300 ease-in-out',
  slow: 'transition-all duration-500 ease-in-out',
} as const;

/**
 * SHADOWS
 */
export const SHADOWS = {
  sm: 'shadow-sm',
  base: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

/**
 * HELPER FUNCTIONS
 */

/**
 * Combine multiple class strings
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get responsive spacing class
 */
export function getResponsiveSpacing(
  size: keyof typeof SPACING.section
): string {
  return SPACING.section[size];
}

/**
 * Get typography class for heading level
 */
export function getHeadingClass(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  return TYPOGRAPHY.heading[`h${level}` as keyof typeof TYPOGRAPHY.heading];
}
