/**
 * Lunatic Profiling V2 - Trait Definitions
 *
 * 4 traits that are tracked throughout the quiz:
 * - BST: Bullshit Tolerance
 * - CPR: Chaos Precision
 * - AE: Apology Efficiency
 * - BS: British Stoicism
 */

export const TRAIT_CODES = ['BST', 'CPR', 'AE', 'BS'] as const;
export type TraitCode = typeof TRAIT_CODES[number];

export interface TraitScores {
  BST: number;
  CPR: number;
  AE: number;
  BS: number;
}

export interface TraitMetadata {
  code: TraitCode;
  name: string;
  description: string;
  highDescription: string;
  lowDescription: string;
  superpowerHigh: string;
  kryptoniteLow: string;
}

export const TRAITS: Record<TraitCode, TraitMetadata> = {
  BST: {
    code: 'BST',
    name: 'Bullshit Tolerance',
    description: 'Your capacity to detect and dismantle nonsense.',
    highDescription: "You dismantle nonsense with surgical precision. Panic is just inefficient data.",
    lowDescription: "Earnestness. Sincerity baffles you. You'd rather deal with a liar than a true believer.",
    superpowerHigh: "You dismantle nonsense with surgical precision. Panic is just inefficient data.",
    kryptoniteLow: "Earnestness. Sincerity baffles you. You'd rather deal with a liar than a true believer.",
  },
  CPR: {
    code: 'CPR',
    name: 'Chaos Precision',
    description: 'Your ability to navigate and create elegant chaos.',
    highDescription: "You create elegant solutions from pure chaos. You're an arsonist who also sells fire extinguishers.",
    lowDescription: "Pure, unstructured chaos. A toddler's playroom is your personal hell.",
    superpowerHigh: "You create elegant solutions from pure chaos. You're an arsonist who also sells fire extinguishers.",
    kryptoniteLow: "Pure, unstructured chaos. A toddler's playroom is your personal hell.",
  },
  AE: {
    code: 'AE',
    name: 'Apology Efficiency',
    description: 'Your mastery of the diplomatic arts of saying sorry.',
    highDescription: "You can apologise your way out of (or into) anything. It's a diplomatic martial art.",
    lowDescription: "Being genuinely in the wrong. It short-circuits your entire system.",
    superpowerHigh: "You can apologise your way out of (or into) anything. It's a diplomatic martial art.",
    kryptoniteLow: "Being genuinely in the wrong. It short-circuits your entire system.",
  },
  BS: {
    code: 'BS',
    name: 'British Stoicism',
    description: 'Your capacity for calm, tea-fueled composure in crisis.',
    highDescription: "You make a cup of tea while Rome burns. The kettle boiling is the only metric that matters.",
    lowDescription: "Other people's emotions. They're messy, unformatted, and refuse to be scheduled.",
    superpowerHigh: "You make a cup of tea while Rome burns. The kettle boiling is the only metric that matters.",
    kryptoniteLow: "Other people's emotions. They're messy, unformatted, and refuse to be scheduled.",
  },
};

// Helper functions
export function getTrait(code: TraitCode): TraitMetadata {
  return TRAITS[code];
}

export function isValidTraitCode(code: string): code is TraitCode {
  return TRAIT_CODES.includes(code as TraitCode);
}

export function createEmptyTraitScores(): TraitScores {
  return { BST: 0, CPR: 0, AE: 0, BS: 0 };
}

export function getHighestTrait(scores: TraitScores): TraitCode {
  const entries = Object.entries(scores) as [TraitCode, number][];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

export function getLowestTrait(scores: TraitScores): TraitCode {
  const entries = Object.entries(scores) as [TraitCode, number][];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

// Trait score interpretations
export interface TraitInterpretation {
  trait: TraitCode;
  score: number;
  percentage: number;
  level: 'low' | 'medium' | 'high';
  interpretation: string;
}

export function interpretTraitScore(
  code: TraitCode,
  score: number,
  maxPossible: number
): TraitInterpretation {
  const percentage = Math.round((score / maxPossible) * 100);
  const trait = TRAITS[code];

  let level: 'low' | 'medium' | 'high';
  let interpretation: string;

  if (percentage >= 40) {
    level = 'high';
    interpretation = trait.highDescription;
  } else if (percentage >= 15) {
    level = 'medium';
    interpretation = trait.description;
  } else {
    level = 'low';
    interpretation = trait.lowDescription;
  }

  return { trait: code, score, percentage, level, interpretation };
}

// Internal conflict detection based on trait combinations
export interface InternalConflict {
  detected: boolean;
  description: string;
}

export function detectInternalConflict(scores: TraitScores, maxPossible: number): InternalConflict {
  const interpretations = TRAIT_CODES.map(code =>
    interpretTraitScore(code, scores[code], maxPossible)
  );

  const high = interpretations.filter(t => t.level === 'high').map(t => t.trait);
  const low = interpretations.filter(t => t.level === 'low').map(t => t.trait);

  // Check for specific conflicts
  if (high.includes('BST') && low.includes('AE')) {
    return {
      detected: true,
      description: "You destroy bullshit but can't apologise for the collateral damage. The wrecker who can't do the paperwork.",
    };
  }

  if (high.includes('CPR') && high.includes('BS')) {
    return {
      detected: true,
      description: "You create elegant chaos while maintaining perfect tea-making standards. The anarchist with a thermos.",
    };
  }

  if (high.includes('AE') && low.includes('BST')) {
    return {
      detected: true,
      description: "You apologise beautifully while secretly believing everyone's full of shit. The diplomat who's armed.",
    };
  }

  if (high.includes('BST') && high.includes('CPR')) {
    return {
      detected: true,
      description: "You dismantle nonsense with such precision it creates new, better nonsense. The arsonist-architect.",
    };
  }

  if (high.includes('BS') && low.includes('AE')) {
    return {
      detected: true,
      description: "You make tea during crises but won't say sorry when you spill it. The stoic who's also a bit of a prick.",
    };
  }

  return {
    detected: false,
    description: "Your internal landscape is surprisingly harmonious. Suspicious, but harmonious.",
  };
}

// Britishness Quotient calculation
export function calculateBritishnessQuotient(bs: number, ae: number): {
  ratio: number;
  interpretation: string;
} {
  // Avoid divide by zero
  const ratio = ae > 0 ? bs / ae : bs > 0 ? 10 : 1;

  let interpretation: string;
  if (ratio > 2) {
    interpretation = "More British than a damp ghost in a Marks & Spencer. You'd queue for your own funeral.";
  } else if (ratio >= 1) {
    interpretation = "Standard issue British. You apologise when someone steps on YOUR foot.";
  } else if (ratio >= 0.5) {
    interpretation = "Practically continental. You might actually express an emotion. How gauche.";
  } else {
    interpretation = "Basically French. Sorry, but it's true. The data doesn't lie.";
  }

  return { ratio: Math.round(ratio * 100) / 100, interpretation };
}
