// ============================================
// The Culling - Ghost Type Definitions
// ============================================

export type GhostCode = 'CD' | 'CA' | 'OB' | 'DD';

export interface GhostType {
  code: GhostCode;
  name: string;
  fullTitle: string;
  description: string;
  traits: string[];
  eliteDescription: string;
  culledDescription: string;
  comedyStyle: string;
}

export const GHOST_TYPES: Record<GhostCode, GhostType> = {
  CD: {
    code: 'CD',
    name: 'Surgical',
    fullTitle: 'The Surgical Ghost',
    description: 'You dissect reality with clinical precision. Every word is a scalpel, every pause a calculated incision.',
    traits: ['Precision', 'Timing', 'Control', 'Devastation'],
    eliteDescription: 'You have mastered the art of the verbal autopsy. Your comedy leaves no survivors, only evidence.',
    culledDescription: 'You tried to be clever but forgot to be funny. The scalpel slipped.',
    comedyStyle: 'Calculated devastation through precise wordplay and timing',
  },
  CA: {
    code: 'CA',
    name: 'Chaos',
    fullTitle: 'The Chaos Ghost',
    description: 'You are entropy incarnate. Comedy erupts from you like a volcano of beautiful madness.',
    traits: ['Unpredictability', 'Energy', 'Fearlessness', 'Anarchy'],
    eliteDescription: 'You have weaponized chaos itself. The universe bends to your absurdity.',
    culledDescription: 'You confused random with funny. Chaos needs a conductor, not a toddler.',
    comedyStyle: 'Explosive, unpredictable bursts of absurdist energy',
  },
  OB: {
    code: 'OB',
    name: 'Observational',
    fullTitle: 'The Observational Ghost',
    description: 'You see what others miss. The mundane becomes magnificent through your twisted lens.',
    traits: ['Perception', 'Relatability', 'Insight', 'Recognition'],
    eliteDescription: 'You hold up a funhouse mirror to reality. Everyone sees themselves and cannot look away.',
    culledDescription: 'You pointed out the obvious and called it insight. Jerry Seinfeld called, he wants his "what\'s the deal" back.',
    comedyStyle: 'Finding profound absurdity in everyday moments',
  },
  DD: {
    code: 'DD',
    name: 'Deadpan',
    fullTitle: 'The Deadpan Ghost',
    description: 'Your face reveals nothing, your words reveal everything. The void stares back and chuckles.',
    traits: ['Stoicism', 'Understatement', 'Density', 'Patience'],
    eliteDescription: 'You have achieved comedic enlightenment through the absence of expression. A single raised eyebrow could end empires.',
    culledDescription: 'Monotone is not a personality. You were so dry you became desiccated.',
    comedyStyle: 'Devastating delivery through emotional flatness and perfect timing',
  },
};

export const GHOST_CODES: GhostCode[] = ['CD', 'CA', 'OB', 'DD'];

export function getGhostByCode(code: GhostCode): GhostType {
  return GHOST_TYPES[code];
}

export function getGhostName(code: GhostCode): string {
  return GHOST_TYPES[code].name;
}
