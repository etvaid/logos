'use client';

import { TranslatorPersona } from '@/lib/personas';
import { RadarChart } from '@/components/charts';
import { Badge, Card } from '@/components/ui';

interface PersonaCardProps {
  persona: TranslatorPersona;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
  showRadar?: boolean;
}

export default function PersonaCard({
  persona,
  selected = false,
  compact = false,
  onClick,
  showRadar = false,
}: PersonaCardProps) {
  const radarData = [
    { subject: 'Literal', value: persona.style.literalness },
    { subject: 'Poetic', value: persona.style.poeticness },
    { subject: 'Formal', value: persona.style.formality },
    { subject: 'Accessible', value: persona.style.accessibility },
    { subject: 'Scholarly', value: persona.style.scholarlyPrecision },
  ];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          w-full text-left p-3 rounded-lg border transition-all
          ${
            selected
              ? 'bg-[#C9A962]/20 border-[#C9A962]'
              : 'border-[#C9A962]/20 hover:border-[#C9A962]/40 hover:bg-[#C9A962]/5'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-[#C9A962]">{persona.name}</div>
            <div className="text-xs text-[#F5F3EF]/50">{persona.era}</div>
          </div>
          {persona.dates && (
            <Badge size="sm">{persona.dates}</Badge>
          )}
        </div>
      </button>
    );
  }

  return (
    <Card
      variant={selected ? 'default' : 'interactive'}
      padding="lg"
      onClick={onClick}
      className={selected ? 'border-[#C9A962]' : ''}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-[#C9A962]">{persona.name}</h3>
          <p className="text-sm text-[#F5F3EF]/50">{persona.era}</p>
          {persona.dates && (
            <p className="text-xs text-[#F5F3EF]/40">{persona.dates}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full bg-[#C9A962]/20 flex items-center justify-center text-2xl">
          {persona.name.charAt(0)}
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1 mb-4">
        {persona.specialty.map((spec) => (
          <Badge key={spec} size="sm" variant="success">
            {spec}
          </Badge>
        ))}
      </div>

      {/* Description */}
      <p className="text-[#F5F3EF]/70 text-sm mb-4">{persona.description}</p>

      {/* Signature */}
      <div className="text-xs text-[#C9A962]/80 italic mb-4">
        "{persona.signature}"
      </div>

      {/* Style radar */}
      {showRadar && (
        <div className="h-48 -mx-4 -mb-4 mt-4 border-t border-[#C9A962]/20 pt-4">
          <RadarChart data={radarData} />
        </div>
      )}

      {/* Sample translation */}
      {persona.sampleTranslation && (
        <div className="mt-4 pt-4 border-t border-[#C9A962]/20">
          <div className="text-xs text-[#F5F3EF]/50 mb-2">{persona.sampleTranslation.work}</div>
          <div className="font-serif text-[#87CEEB] text-sm mb-1">
            {persona.sampleTranslation.source}
          </div>
          <div className="font-serif text-[#F5F3EF]/80 text-sm">
            "{persona.sampleTranslation.translation}"
          </div>
        </div>
      )}

      {/* Works */}
      <div className="mt-4 flex flex-wrap gap-1">
        {persona.works.slice(0, 4).map((work) => (
          <span key={work} className="text-xs text-[#F5F3EF]/40">
            {work}
            {persona.works.indexOf(work) < Math.min(persona.works.length - 1, 3) ? ',' : ''}
          </span>
        ))}
        {persona.works.length > 4 && (
          <span className="text-xs text-[#F5F3EF]/40">+{persona.works.length - 4} more</span>
        )}
      </div>
    </Card>
  );
}
