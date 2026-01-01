'use client';

import { useState } from 'react';
import { TranslatorPersona, TRANSLATOR_PERSONAS, blendStyles, STYLE_PRESETS } from '@/lib/personas';
import { RadarChart } from '@/components/charts';
import { Button, Badge, Card } from '@/components/ui';

interface BlendedPersona {
  persona: TranslatorPersona;
  weight: number;
}

interface StyleBlenderProps {
  onStyleChange?: (style: TranslatorPersona['style']) => void;
  onPersonaSelect?: (personaId: string) => void;
}

export default function StyleBlender({ onStyleChange, onPersonaSelect }: StyleBlenderProps) {
  const [selectedPersonas, setSelectedPersonas] = useState<BlendedPersona[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const blendedStyle = selectedPersonas.length > 0
    ? blendStyles(selectedPersonas)
    : null;

  const radarData = blendedStyle
    ? [
        { subject: 'Literal', value: blendedStyle.literalness },
        { subject: 'Poetic', value: blendedStyle.poeticness },
        { subject: 'Formal', value: blendedStyle.formality },
        { subject: 'Accessible', value: blendedStyle.accessibility },
        { subject: 'Scholarly', value: blendedStyle.scholarlyPrecision },
      ]
    : [];

  const addPersona = (persona: TranslatorPersona) => {
    if (selectedPersonas.find((p) => p.persona.id === persona.id)) return;
    const newList = [...selectedPersonas, { persona, weight: 50 }];
    setSelectedPersonas(newList);
    setShowSelector(false);

    const newStyle = blendStyles(newList);
    onStyleChange?.(newStyle);
  };

  const removePersona = (personaId: string) => {
    const newList = selectedPersonas.filter((p) => p.persona.id !== personaId);
    setSelectedPersonas(newList);

    if (newList.length > 0) {
      const newStyle = blendStyles(newList);
      onStyleChange?.(newStyle);
    }
  };

  const updateWeight = (personaId: string, weight: number) => {
    const newList = selectedPersonas.map((p) =>
      p.persona.id === personaId ? { ...p, weight } : p
    );
    setSelectedPersonas(newList);

    const newStyle = blendStyles(newList);
    onStyleChange?.(newStyle);
  };

  const selectPreset = (preset: typeof STYLE_PRESETS[0]) => {
    onStyleChange?.(preset.style);
    setSelectedPersonas([]);
  };

  const filteredPersonas = TRANSLATOR_PERSONAS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialty.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Quick presets */}
      <div>
        <h4 className="text-sm font-semibold text-[#C9A962] mb-3">Quick Presets</h4>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className="px-3 py-1.5 text-sm bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-lg hover:bg-[#C9A962]/20 transition"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected personas with weight sliders */}
      {selectedPersonas.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[#C9A962] mb-3">Style Blend</h4>
          <div className="space-y-4">
            {selectedPersonas.map(({ persona, weight }) => (
              <div key={persona.id} className="p-3 bg-[#C9A962]/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{persona.name}</span>
                    <Badge size="sm">{weight}%</Badge>
                  </div>
                  <button
                    onClick={() => removePersona(persona.id)}
                    className="text-[#F5F3EF]/40 hover:text-red-400 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={weight}
                  onChange={(e) => updateWeight(persona.id, parseInt(e.target.value))}
                  className="w-full accent-[#C9A962]"
                />
              </div>
            ))}
          </div>

          {/* Blended style radar */}
          {blendedStyle && (
            <div className="h-48 mt-4">
              <RadarChart data={radarData} name="Blended Style" />
            </div>
          )}
        </div>
      )}

      {/* Add persona button */}
      <Button
        variant="secondary"
        onClick={() => setShowSelector(!showSelector)}
        className="w-full"
      >
        + Add Translator Style
      </Button>

      {/* Persona selector */}
      {showSelector && (
        <Card padding="lg">
          <input
            type="text"
            placeholder="Search translators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 mb-4 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg focus:border-[#C9A962] outline-none"
          />
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredPersonas.slice(0, 20).map((persona) => {
              const isSelected = selectedPersonas.find((p) => p.persona.id === persona.id);
              return (
                <button
                  key={persona.id}
                  onClick={() => !isSelected && addPersona(persona)}
                  disabled={!!isSelected}
                  className={`
                    w-full text-left p-3 rounded-lg transition
                    ${
                      isSelected
                        ? 'bg-[#C9A962]/10 opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#C9A962]/10'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-[#C9A962]">{persona.name}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{persona.era}</div>
                    </div>
                    <div className="flex gap-1">
                      {persona.specialty.slice(0, 2).map((spec) => (
                        <Badge key={spec} size="sm">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Style arithmetic example */}
      <div className="text-xs text-[#F5F3EF]/40 text-center pt-2 border-t border-[#C9A962]/10">
        Try: "70% Fagles + 30% Lattimore" for dramatic yet faithful
      </div>
    </div>
  );
}
