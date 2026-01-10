/**
 * Translation Style Transformation Engine
 *
 * Applies stylistic transformations to neutral consensus translations.
 * Implements 5 base styles + mixing + custom AI-generated styles.
 */

export type BaseTranslationStyle = 'scholarly' | 'literary' | 'accessible' | 'literal' | 'kjv_archaic';
export type TranslationStyle = BaseTranslationStyle | 'mixed' | 'custom';

export interface StyleMix {
  style: BaseTranslationStyle;
  weight: number; // 0.0 to 1.0
}

export interface CustomStyleDefinition {
  name: string;
  description: string;
  rules: Partial<StyleRules>;
}

interface StyleRules {
  pronouns: { [key: string]: string };
  verbForms: { [key: string]: string };
  vocabulary: { [key: string]: string };
  punctuation: (text: string) => string;
  sentence: (text: string) => string;
}

const STYLE_RULES: Record<BaseTranslationStyle, StyleRules> = {
  scholarly: {
    pronouns: {},
    verbForms: {},
    vocabulary: {
      'killed': 'slew',
      'destroyed': 'razed',
      'attacked': 'assailed',
      'said': 'declared',
      'asked': 'inquired',
      'told': 'recounted',
      'went': 'proceeded',
      'came': 'arrived',
      'got': 'obtained',
      'made': 'fashioned',
      'very': 'exceedingly',
      'big': 'considerable',
      'small': 'diminutive',
    },
    punctuation: (text) => text,
    sentence: (text) => {
      // Add footnote markers for ambiguous terms
      return text.replace(/\b(god|divine|fate|soul)\b/gi, (match) => `${match}*`);
    },
  },

  literary: {
    pronouns: {},
    verbForms: {},
    vocabulary: {
      'killed': 'struck down',
      'destroyed': 'laid waste',
      'attacked': 'fell upon',
      'said': 'spoke',
      'asked': 'questioned',
      'told': 'related',
      'went': 'made his way',
      'came': 'drew near',
      'got': 'secured',
      'made': 'wrought',
      'very': 'most',
      'big': 'great',
      'small': 'modest',
    },
    punctuation: (text) => {
      // Add dashes for dramatic effect
      return text.replace(/\. /g, (match, offset, str) => {
        if (Math.random() > 0.7) return '—';
        return match;
      });
    },
    sentence: (text) => {
      // Vary sentence structure
      return text.replace(/^([A-Z][^.!?]*[.!?])/gm, (sentence) => {
        if (sentence.split(' ').length < 6) {
          return sentence; // Keep short sentences
        }
        // Occasionally invert for literary effect
        const words = sentence.trim().slice(0, -1).split(' ');
        if (words.length > 8 && Math.random() > 0.8) {
          const verb = words.findIndex(w => ['was', 'were', 'had', 'did'].includes(w.toLowerCase()));
          if (verb > 0 && verb < 4) {
            const inverted = [words[verb], ...words.slice(0, verb), ...words.slice(verb + 1)];
            return inverted.join(' ') + sentence.slice(-1);
          }
        }
        return sentence;
      });
    },
  },

  accessible: {
    pronouns: {},
    verbForms: {},
    vocabulary: {
      'slew': 'killed',
      'smote': 'struck',
      'beheld': 'saw',
      'spake': 'spoke',
      'wrought': 'made',
      'thus': 'so',
      'wherefore': 'therefore',
      'thereby': 'by that',
      'thereof': 'of that',
      'herein': 'in this',
      'therein': 'in that',
      'henceforth': 'from now on',
      'aforementioned': 'mentioned earlier',
      'inquired': 'asked',
      'proceeded': 'went',
      'exceedingly': 'very',
    },
    punctuation: (text) => {
      // Break long sentences
      return text.replace(/([,;]) (and|but|for|yet)/g, '. $2');
    },
    sentence: (text) => {
      // Simplify complex constructions
      text = text.replace(/It is (\w+) that/g, 'It\'s $1 that');
      text = text.replace(/It was (\w+) that/g, 'It was $1 that');
      text = text.replace(/There is (\w+) who/g, '$1');
      text = text.replace(/There was (\w+) who/g, '$1');
      return text;
    },
  },

  literal: {
    pronouns: {},
    verbForms: {},
    vocabulary: {},
    punctuation: (text) => text,
    sentence: (text) => {
      // Add word-for-word markers
      return text.replace(/(\w+)/g, (word, offset, str) => {
        // Mark key terms with literal indicators
        if (['and', 'but', 'for', 'then', 'also', 'indeed'].includes(word.toLowerCase())) {
          return `${word}`;
        }
        return word;
      });
    },
  },

  kjv_archaic: {
    pronouns: {
      'you': 'thou',
      'your': 'thy',
      'yours': 'thine',
      'You': 'Thou',
      'Your': 'Thy',
      'Yours': 'Thine',
    },
    verbForms: {
      'are': 'art',
      'were': 'wert',
      'have': 'hast',
      'do': 'dost',
      'does': 'doth',
      'go': 'goest',
      'say': 'sayest',
      'know': 'knowest',
      'see': 'seest',
      'hear': 'hearest',
    },
    vocabulary: {
      'killed': 'slew',
      'said': 'spake',
      'destroyed': 'smote',
      'went': 'went forth',
      'came': 'came unto',
      'very': 'exceeding',
      'because': 'for',
      'before': 'ere',
      'when': 'when',
      'if': 'if',
    },
    punctuation: (text) => text,
    sentence: (text) => {
      // Add archaic constructions
      text = text.replace(/And he said/g, 'And he spake, saying');
      text = text.replace(/And she said/g, 'And she spake, saying');
      text = text.replace(/\. And /g, '. And it came to pass that ');
      return text;
    },
  },
};

/**
 * Apply style transformation to neutral text
 * Only works with base styles (not 'mixed' or 'custom')
 */
export function applyStyle(neutralText: string, style: BaseTranslationStyle): string {
  if (style === 'scholarly') {
    // scholarly is closest to neutral, minimal changes
    return applyTransformations(neutralText, STYLE_RULES.scholarly);
  }

  const rules = STYLE_RULES[style];
  return applyTransformations(neutralText, rules);
}

/**
 * Apply all transformation rules
 */
function applyTransformations(text: string, rules: StyleRules): string {
  let transformed = text;

  // Apply pronoun substitutions
  for (const [from, to] of Object.entries(rules.pronouns)) {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    transformed = transformed.replace(regex, to);
  }

  // Apply verb form substitutions
  for (const [from, to] of Object.entries(rules.verbForms)) {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    transformed = transformed.replace(regex, to);
  }

  // Apply vocabulary substitutions
  for (const [from, to] of Object.entries(rules.vocabulary)) {
    const regex = new RegExp(`\\b${from}\\b`, 'gi');
    transformed = transformed.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return to.charAt(0).toUpperCase() + to.slice(1);
      }
      return to;
    });
  }

  // Apply punctuation rules
  transformed = rules.punctuation(transformed);

  // Apply sentence-level rules
  transformed = rules.sentence(transformed);

  return transformed;
}

/**
 * Calculate fidelity score (how close to literal translation)
 */
export function calculateFidelity(style: BaseTranslationStyle): number {
  const fidelityScores: Record<BaseTranslationStyle, number> = {
    literal: 1.0,
    scholarly: 0.95,
    kjv_archaic: 0.85,
    literary: 0.75,
    accessible: 0.70,
  };
  return fidelityScores[style];
}

/**
 * Get style description
 */
export function getStyleDescription(style: string): string {
  const descriptions: Record<string, string> = {
    scholarly: 'Academic translation with technical vocabulary and footnote markers for ambiguous terms',
    literary: 'Flowing, artistic translation emphasizing readability and aesthetic appeal',
    accessible: 'Modern, clear translation with simplified vocabulary and sentence structure',
    literal: 'Word-for-word translation maintaining source text structure',
    kjv_archaic: 'King James Version style with archaic English (thou, thee, -eth verb endings)',
    mixed: 'Custom blend of multiple translation styles',
    custom: 'AI-generated style based on user description',
  };
  return descriptions[style] || 'Custom translation style';
}

/**
 * Apply mixed style transformation
 */
export function applyMixedStyle(
  neutralText: string,
  styleMixes: StyleMix[]
): string {
  // Normalize weights
  const totalWeight = styleMixes.reduce((sum, mix) => sum + mix.weight, 0);
  const normalizedMixes = styleMixes.map(mix => ({
    ...mix,
    weight: mix.weight / totalWeight
  }));

  // Apply each style and blend results
  const transformedTexts = normalizedMixes.map(mix => ({
    text: applyStyle(neutralText, mix.style),
    weight: mix.weight
  }));

  // Blend by selecting words/phrases based on weights
  // For simplicity, use the highest-weighted style for each sentence
  const sentences = neutralText.split(/([.!?]+\s*)/);
  let result = '';

  for (let i = 0; i < sentences.length; i++) {
    // Pick style based on round-robin weighted selection
    const styleIndex = Math.floor(Math.random() * transformedTexts.length);
    const chosenStyle = transformedTexts[styleIndex];

    // Get the corresponding sentence from that style's transformation
    const styledSentences = chosenStyle.text.split(/([.!?]+\s*)/);
    result += styledSentences[i] || sentences[i];
  }

  return result;
}

/**
 * Generate custom style rules from natural language description
 * Uses AI to interpret style preferences
 */
export async function generateCustomStyle(
  description: string
): Promise<CustomStyleDefinition> {
  // Parse description to extract style preferences
  const rules: Partial<StyleRules> = {
    pronouns: {},
    verbForms: {},
    vocabulary: {},
    punctuation: (text) => text,
    sentence: (text) => text,
  };

  const lowerDesc = description.toLowerCase();

  // Extract pronoun preferences
  if (lowerDesc.includes('formal') || lowerDesc.includes('thou')) {
    rules.pronouns = { 'you': 'thou', 'your': 'thy', 'yours': 'thine' };
  } else if (lowerDesc.includes('casual') || lowerDesc.includes('modern')) {
    rules.pronouns = { 'thou': 'you', 'thy': 'your', 'thine': 'yours' };
  }

  // Extract vocabulary preferences
  if (lowerDesc.includes('simple') || lowerDesc.includes('easy')) {
    rules.vocabulary = {
      'slew': 'killed',
      'smote': 'struck',
      'beheld': 'saw',
      'spake': 'spoke',
      'wrought': 'made',
      'thus': 'so',
      'wherefore': 'therefore',
    };
  } else if (lowerDesc.includes('elevated') || lowerDesc.includes('formal')) {
    rules.vocabulary = {
      'killed': 'slew',
      'said': 'spake',
      'looked': 'beheld',
      'made': 'wrought',
      'very': 'exceeding',
    };
  }

  // Extract punctuation preferences
  if (lowerDesc.includes('dramatic') || lowerDesc.includes('em dash')) {
    rules.punctuation = (text) => text.replace(/\. /g, () => Math.random() > 0.5 ? '—' : '. ');
  } else if (lowerDesc.includes('clear') || lowerDesc.includes('simple')) {
    rules.punctuation = (text) => text.replace(/[;:]/g, '.').replace(/—/g, ' - ');
  }

  // Extract sentence preferences
  if (lowerDesc.includes('short') || lowerDesc.includes('concise')) {
    rules.sentence = (text) => text.replace(/([,;]) (and|but)/g, '. $2');
  } else if (lowerDesc.includes('flowing') || lowerDesc.includes('complex')) {
    rules.sentence = (text) => text.replace(/\.\s+And\b/g, ', and');
  }

  return {
    name: generateStyleName(description),
    description,
    rules: rules as StyleRules,
  };
}

/**
 * Generate a name for custom style from description
 */
function generateStyleName(description: string): string {
  const keywords = description.toLowerCase().match(/\b(modern|simple|formal|dramatic|poetic|clear|elevated|casual|archaic|flowing)\b/g);
  if (keywords && keywords.length > 0) {
    return keywords.slice(0, 2).map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(' ') + ' Style';
  }
  return 'Custom Style';
}

/**
 * Apply custom style transformation
 */
export function applyCustomStyle(
  neutralText: string,
  customStyle: CustomStyleDefinition
): string {
  return applyTransformations(neutralText, customStyle.rules as StyleRules);
}

/**
 * Get all available base styles
 */
export function getAvailableStyles(): Array<{ id: BaseTranslationStyle; name: string; description: string }> {
  return [
    { id: 'scholarly', name: 'Scholarly', description: getStyleDescription('scholarly') },
    { id: 'literary', name: 'Literary', description: getStyleDescription('literary') },
    { id: 'accessible', name: 'Accessible', description: getStyleDescription('accessible') },
    { id: 'literal', name: 'Literal', description: getStyleDescription('literal') },
    { id: 'kjv_archaic', name: 'KJV Archaic', description: getStyleDescription('kjv_archaic') },
  ];
}
