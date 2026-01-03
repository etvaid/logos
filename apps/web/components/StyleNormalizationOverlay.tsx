'use client';

import { useState, useMemo } from 'react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { RadarChart, BarChart } from '@/components/charts';

// Genre-conditioned neutral styles (centroids)
// Each genre has different expected style characteristics
export const GENRE_NEUTRAL_STYLES = {
  epic: {
    name: 'Epic Poetry',
    description: 'Elevated, formal, with heroic diction',
    style: {
      literalness: 0.5,
      poeticness: 0.85,
      formality: 0.8,
      accessibility: 0.4,
      scholarlyPrecision: 0.6,
    },
  },
  philosophy: {
    name: 'Philosophy',
    description: 'Precise, technical, conceptually accurate',
    style: {
      literalness: 0.75,
      poeticness: 0.3,
      formality: 0.7,
      accessibility: 0.5,
      scholarlyPrecision: 0.9,
    },
  },
  historiography: {
    name: 'Historiography',
    description: 'Clear, authoritative, narrative',
    style: {
      literalness: 0.7,
      poeticness: 0.4,
      formality: 0.65,
      accessibility: 0.6,
      scholarlyPrecision: 0.75,
    },
  },
  tragedy: {
    name: 'Tragedy',
    description: 'Dramatic, elevated, emotionally resonant',
    style: {
      literalness: 0.55,
      poeticness: 0.8,
      formality: 0.75,
      accessibility: 0.45,
      scholarlyPrecision: 0.55,
    },
  },
  comedy: {
    name: 'Comedy',
    description: 'Colloquial, accessible, wit-preserving',
    style: {
      literalness: 0.45,
      poeticness: 0.5,
      formality: 0.35,
      accessibility: 0.85,
      scholarlyPrecision: 0.4,
    },
  },
  lyric: {
    name: 'Lyric Poetry',
    description: 'Musical, intimate, metrically aware',
    style: {
      literalness: 0.4,
      poeticness: 0.95,
      formality: 0.5,
      accessibility: 0.55,
      scholarlyPrecision: 0.45,
    },
  },
  oratory: {
    name: 'Oratory',
    description: 'Persuasive, rhythmic, powerful',
    style: {
      literalness: 0.6,
      poeticness: 0.6,
      formality: 0.85,
      accessibility: 0.65,
      scholarlyPrecision: 0.65,
    },
  },
  epistle: {
    name: 'Epistle',
    description: 'Conversational, personal, clear',
    style: {
      literalness: 0.65,
      poeticness: 0.35,
      formality: 0.55,
      accessibility: 0.75,
      scholarlyPrecision: 0.6,
    },
  },
  gospel: {
    name: 'Gospel/Religious',
    description: 'Reverent, accessible, spiritually resonant',
    style: {
      literalness: 0.6,
      poeticness: 0.55,
      formality: 0.7,
      accessibility: 0.7,
      scholarlyPrecision: 0.65,
    },
  },
};

interface StyleProfile {
  literalness: number;
  poeticness: number;
  formality: number;
  accessibility: number;
  scholarlyPrecision: number;
}

interface StyleNormalizationOverlayProps {
  genre: keyof typeof GENRE_NEUTRAL_STYLES;
  translatorStyle: StyleProfile;
  translatorName?: string;
  showResiduals?: boolean;
  compact?: boolean;
}

export function StyleNormalizationOverlay({
  genre,
  translatorStyle,
  translatorName = 'Current',
  showResiduals = true,
  compact = false,
}: StyleNormalizationOverlayProps) {
  const [showDetails, setShowDetails] = useState(!compact);

  const neutralStyle = GENRE_NEUTRAL_STYLES[genre];

  // Calculate style residuals (deviation from genre-conditioned neutral)
  const residuals = useMemo(() => {
    return {
      literalness: translatorStyle.literalness - neutralStyle.style.literalness,
      poeticness: translatorStyle.poeticness - neutralStyle.style.poeticness,
      formality: translatorStyle.formality - neutralStyle.style.formality,
      accessibility: translatorStyle.accessibility - neutralStyle.style.accessibility,
      scholarlyPrecision: translatorStyle.scholarlyPrecision - neutralStyle.style.scholarlyPrecision,
    };
  }, [translatorStyle, neutralStyle.style]);

  // Calculate total deviation magnitude
  const totalDeviation = useMemo(() => {
    const sum = Object.values(residuals).reduce((acc, val) => acc + Math.abs(val), 0);
    return sum / 5; // Average absolute deviation
  }, [residuals]);

  // Deviation classification
  const deviationClass = useMemo(() => {
    if (totalDeviation < 0.15) return { label: 'Aligned', color: 'text-green-400', bg: 'bg-green-400' };
    if (totalDeviation < 0.3) return { label: 'Moderate', color: 'text-[#C9A962]', bg: 'bg-[#C9A962]' };
    return { label: 'Significant', color: 'text-red-400', bg: 'bg-red-400' };
  }, [totalDeviation]);

  // Radar data comparing both styles
  const comparisonData = useMemo(() => {
    return [
      { subject: 'Literal', neutral: neutralStyle.style.literalness, translator: translatorStyle.literalness },
      { subject: 'Poetic', neutral: neutralStyle.style.poeticness, translator: translatorStyle.poeticness },
      { subject: 'Formal', neutral: neutralStyle.style.formality, translator: translatorStyle.formality },
      { subject: 'Access', neutral: neutralStyle.style.accessibility, translator: translatorStyle.accessibility },
      { subject: 'Scholarly', neutral: neutralStyle.style.scholarlyPrecision, translator: translatorStyle.scholarlyPrecision },
    ];
  }, [neutralStyle.style, translatorStyle]);

  // Residual bar data
  const residualData = useMemo(() => {
    return [
      { name: 'Literalness', value: residuals.literalness * 100, color: residuals.literalness >= 0 ? '#C9A962' : '#87CEEB' },
      { name: 'Poeticness', value: residuals.poeticness * 100, color: residuals.poeticness >= 0 ? '#C9A962' : '#87CEEB' },
      { name: 'Formality', value: residuals.formality * 100, color: residuals.formality >= 0 ? '#C9A962' : '#87CEEB' },
      { name: 'Accessibility', value: residuals.accessibility * 100, color: residuals.accessibility >= 0 ? '#C9A962' : '#87CEEB' },
      { name: 'Scholarly', value: residuals.scholarlyPrecision * 100, color: residuals.scholarlyPrecision >= 0 ? '#C9A962' : '#87CEEB' },
    ];
  }, [residuals]);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-2 bg-[#C9A962]/5 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${deviationClass.bg}`} />
        <span className="text-sm text-[#F5F3EF]/70">
          {neutralStyle.name} deviation:
        </span>
        <span className={`text-sm font-medium ${deviationClass.color}`}>
          {(totalDeviation * 100).toFixed(0)}% ({deviationClass.label})
        </span>
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'Hide' : 'Details'}
        </Button>
        {showDetails && (
          <div className="absolute z-10 mt-2 top-full left-0 right-0">
            <Card padding="md">
              <StyleResidualDisplay residuals={residuals} />
            </Card>
          </div>
        )}
      </div>
    );
  }

  return (
    <Card padding="lg" className="border-l-4 border-l-[#C9A962]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[#C9A962]">Style Normalization Analysis</h3>
          <p className="text-sm text-[#F5F3EF]/50">
            Genre-conditioned deviation from <span className="text-[#C9A962]">{neutralStyle.name}</span> neutral
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${deviationClass.color}`}>
            {(totalDeviation * 100).toFixed(0)}%
          </div>
          <Badge variant={deviationClass.label === 'Aligned' ? 'success' : deviationClass.label === 'Moderate' ? 'warning' : 'error'}>
            {deviationClass.label} Deviation
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Style Comparison Radar */}
        <div>
          <h4 className="text-sm font-medium text-[#F5F3EF]/50 mb-3">Style Comparison</h4>
          <div className="h-48">
            <RadarChart
              data={comparisonData.map(d => ({ subject: d.subject, value: d.translator, fullMark: 1 }))}
              name={translatorName}
            />
          </div>
          <div className="flex justify-center gap-4 mt-2 text-xs text-[#F5F3EF]/50">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
              {translatorName}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#87CEEB] opacity-50" />
              {neutralStyle.name} Neutral
            </span>
          </div>
        </div>

        {/* Residual Display */}
        {showResiduals && (
          <div>
            <h4 className="text-sm font-medium text-[#F5F3EF]/50 mb-3">Style Residuals</h4>
            <StyleResidualDisplay residuals={residuals} />
          </div>
        )}
      </div>

      {/* Interpretation */}
      <div className="mt-4 p-3 bg-[#C9A962]/5 rounded-lg">
        <p className="text-sm text-[#F5F3EF]/70">
          <span className="font-medium text-[#C9A962]">Diagnostic Note:</span>{' '}
          {getDeviationInterpretation(residuals, neutralStyle.name)}
        </p>
      </div>
    </Card>
  );
}

interface StyleResidualDisplayProps {
  residuals: StyleProfile;
}

function StyleResidualDisplay({ residuals }: StyleResidualDisplayProps) {
  const dimensions = [
    { key: 'literalness', label: 'Literalness' },
    { key: 'poeticness', label: 'Poeticness' },
    { key: 'formality', label: 'Formality' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'scholarlyPrecision', label: 'Scholarly' },
  ] as const;

  return (
    <div className="space-y-3">
      {dimensions.map(({ key, label }) => {
        const value = residuals[key];
        const percentage = Math.abs(value) * 100;
        const isPositive = value >= 0;

        return (
          <div key={key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#F5F3EF]/70">{label}</span>
              <span className={isPositive ? 'text-[#C9A962]' : 'text-[#87CEEB]'}>
                {isPositive ? '+' : ''}{(value * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-[#C9A962]/10 rounded-full overflow-hidden flex">
              <div className="w-1/2 flex justify-end">
                {!isPositive && (
                  <div
                    className="h-full bg-[#87CEEB] rounded-l-full"
                    style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                  />
                )}
              </div>
              <div className="w-px bg-[#F5F3EF]/30" />
              <div className="w-1/2">
                {isPositive && (
                  <div
                    className="h-full bg-[#C9A962] rounded-r-full"
                    style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div className="flex justify-center gap-4 mt-2 text-xs text-[#F5F3EF]/40">
        <span>Less than neutral</span>
        <span>|</span>
        <span>More than neutral</span>
      </div>
    </div>
  );
}

// Genre selector component for use in other pages
interface GenreSelectorProps {
  value: keyof typeof GENRE_NEUTRAL_STYLES;
  onChange: (genre: keyof typeof GENRE_NEUTRAL_STYLES) => void;
  className?: string;
}

export function GenreSelector({ value, onChange, className }: GenreSelectorProps) {
  const options = Object.entries(GENRE_NEUTRAL_STYLES).map(([key, data]) => ({
    value: key,
    label: data.name,
  }));

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as keyof typeof GENRE_NEUTRAL_STYLES)}
      options={options}
      className={className}
    />
  );
}

function getDeviationInterpretation(residuals: StyleProfile, genreName: string): string {
  const highResiduals: string[] = [];

  if (Math.abs(residuals.literalness) > 0.2) {
    highResiduals.push(
      residuals.literalness > 0 ? 'more literal' : 'less literal'
    );
  }
  if (Math.abs(residuals.poeticness) > 0.2) {
    highResiduals.push(
      residuals.poeticness > 0 ? 'more poetic' : 'less poetic'
    );
  }
  if (Math.abs(residuals.formality) > 0.2) {
    highResiduals.push(
      residuals.formality > 0 ? 'more formal' : 'less formal'
    );
  }
  if (Math.abs(residuals.accessibility) > 0.2) {
    highResiduals.push(
      residuals.accessibility > 0 ? 'more accessible' : 'less accessible'
    );
  }
  if (Math.abs(residuals.scholarlyPrecision) > 0.2) {
    highResiduals.push(
      residuals.scholarlyPrecision > 0 ? 'more scholarly' : 'less scholarly'
    );
  }

  if (highResiduals.length === 0) {
    return `This translation style is well-aligned with the typical ${genreName} register.`;
  }

  return `This translation is ${highResiduals.join(', ')} than the typical ${genreName} register. These deviations may be intentional stylistic choices.`;
}

// Batch analysis component for comparing multiple translations
interface BatchNormalizationProps {
  genre: keyof typeof GENRE_NEUTRAL_STYLES;
  translations: Array<{
    id: string;
    name: string;
    style: StyleProfile;
  }>;
}

export function BatchNormalizationAnalysis({ genre, translations }: BatchNormalizationProps) {
  const neutralStyle = GENRE_NEUTRAL_STYLES[genre];

  const analysisData = useMemo(() => {
    return translations.map((t) => {
      const residuals = {
        literalness: t.style.literalness - neutralStyle.style.literalness,
        poeticness: t.style.poeticness - neutralStyle.style.poeticness,
        formality: t.style.formality - neutralStyle.style.formality,
        accessibility: t.style.accessibility - neutralStyle.style.accessibility,
        scholarlyPrecision: t.style.scholarlyPrecision - neutralStyle.style.scholarlyPrecision,
      };
      const totalDeviation = Object.values(residuals).reduce((acc, val) => acc + Math.abs(val), 0) / 5;
      return {
        ...t,
        residuals,
        totalDeviation,
      };
    }).sort((a, b) => a.totalDeviation - b.totalDeviation);
  }, [translations, neutralStyle.style]);

  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-[#C9A962] mb-4">
        Batch Style Analysis: {neutralStyle.name}
      </h3>
      <p className="text-sm text-[#F5F3EF]/50 mb-4">
        Translations ranked by alignment with genre-conditioned neutral style
      </p>

      <div className="space-y-3">
        {analysisData.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-[#C9A962]/5 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#F5F3EF]/40 w-6">
                #{index + 1}
              </span>
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-24 h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    item.totalDeviation < 0.15
                      ? 'bg-green-400'
                      : item.totalDeviation < 0.3
                        ? 'bg-[#C9A962]'
                        : 'bg-red-400'
                  }`}
                  style={{ width: `${Math.min(item.totalDeviation * 100 * 3, 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(item.totalDeviation * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
