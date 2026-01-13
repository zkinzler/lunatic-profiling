/**
 * Lunatic Profiling V2 - Archetype Definitions
 *
 * 9 archetypes with codes, names, pub legend titles, and descriptions
 */

export const ARCHETYPE_CODES = ['VN', 'CTD', 'YO', 'SO', 'DL', 'MM', 'TMZ', 'CS', 'BN'] as const;
export type ArchetypeCode = typeof ARCHETYPE_CODES[number];

export interface Archetype {
  code: ArchetypeCode;
  name: string;
  pubLegend: string;
  description: string;
  coreDriver: string;
  signatureMove: string;
  chaosPartner: ArchetypeCode;
  leadingMessage: string;
}

export const ARCHETYPES: Record<ArchetypeCode, Archetype> = {
  VN: {
    code: 'VN',
    name: 'Velvet Nightmare',
    pubLegend: 'Bullshit Slayer',
    description: "You don't suffer fools. You perform surgical strikes on them. Your honesty isn't brutal—it's efficient. The world's bullshit is just clutter to you.",
    coreDriver: "A pathological intolerance for bullshit.",
    signatureMove: "The Precision Guillotine - One sentence that ends someone's entire argument.",
    chaosPartner: 'DL',
    leadingMessage: "You don't suffer fools. You perform surgical strikes on them. Your honesty isn't brutal—it's efficient. The world's bullshit is just clutter to you.",
  },
  CTD: {
    code: 'CTD',
    name: 'Chaos Tea Dealer',
    pubLegend: 'Chaos Architect',
    description: "You see conspiracies in tea leaves and spreadsheets in cloud formations. Your madness has footnotes. It's not chaos; it's organised chaos with a bibliography.",
    coreDriver: "A need to find patterns in the chaos, even if you have to invent them.",
    signatureMove: "The Conspiracy Weave - Connecting three unrelated things into an undeniable pattern.",
    chaosPartner: 'SO',
    leadingMessage: "You see conspiracies in tea leaves and spreadsheets in cloud formations. Your madness has footnotes. It's not chaos; it's organised chaos with a bibliography.",
  },
  YO: {
    code: 'YO',
    name: 'YOLO Ohno',
    pubLegend: 'Vibe Commando',
    description: "Your life motto is 'Fuck it, why not?' followed by 'Oh fuck, why?' You treat consequences as a surprise feature, not a bug.",
    coreDriver: "The unshakeable belief that 'it'll probably be fine' is a valid life strategy.",
    signatureMove: "The Unplanned Victory - Stumbling into success while looking for the toilet.",
    chaosPartner: 'BN',
    leadingMessage: "Your life motto is 'Fuck it, why not?' followed by 'Oh fuck, why?' You treat consequences as a surprise feature, not a bug.",
  },
  SO: {
    code: 'SO',
    name: 'Spreadsheet Overlord',
    pubLegend: 'Efficiency Berserker',
    description: "You'd emotionally process a bereavement with a colour-coded Gantt chart. Your feelings have pivot tables. It's terrifying and beautiful.",
    coreDriver: "The conviction that every human experience can be optimised, even grief.",
    signatureMove: "The Spreadsheet Seduction - Making bureaucracy look sexy and efficient.",
    chaosPartner: 'YO',
    leadingMessage: "You'd emotionally process a bereavement with a colour-coded Gantt chart. Your feelings have pivot tables. It's terrifying and beautiful.",
  },
  DL: {
    code: 'DL',
    name: 'Dalai Lemma',
    pubLegend: 'Apology Ninja',
    description: "You apologise for the weather. You'd mediate a fight between a pigeon and a statue. Your peacekeeping skills are a pathological need for quiet.",
    coreDriver: "A compulsion to absorb and neutralise the emotional shrapnel around you.",
    signatureMove: "The Apology Ambush - Sorry-ing your way into getting exactly what you want.",
    chaosPartner: 'VN',
    leadingMessage: "You apologise for the weather. You'd mediate a fight between a pigeon and a statue. Your peacekeeping skills are a pathological need for quiet.",
  },
  MM: {
    code: 'MM',
    name: 'Manifestor of Mystery',
    pubLegend: 'Mystery Curator',
    description: "You'd make a nuclear meltdown look aesthetically pleasing. You don't solve problems; you curate them into art installations.",
    coreDriver: "The relentless curation of reality into something more aesthetically pleasing.",
    signatureMove: "The Aesthetic Rearrangement - Making chaos look like it was designed that way.",
    chaosPartner: 'TMZ',
    leadingMessage: "You'd make a nuclear meltdown look aesthetically pleasing. You don't solve problems; you curate them into art installations.",
  },
  TMZ: {
    code: 'TMZ',
    name: 'Tea Master of Zen',
    pubLegend: 'Zen Bastard',
    description: "You find zen in bureaucracy. Your chaos is minimalist, your rage is elegantly formatted. You're a monk who works in HR.",
    coreDriver: "The pursuit of zen through ruthless editing of life's noise.",
    signatureMove: "The Zen Critique - Destroying someone's soul with serene, impeccable logic.",
    chaosPartner: 'MM',
    leadingMessage: "You find zen in bureaucracy. Your chaos is minimalist, your rage is elegantly formatted. You're a monk who works in HR.",
  },
  CS: {
    code: 'CS',
    name: 'Chaos Slayer',
    pubLegend: 'Problem Annihilator',
    description: "You don't just solve problems; you annihilate them in a way that looks good on Instagram. Efficiency as performance art.",
    coreDriver: "A surgical precision in destroying nonsense while looking fabulous doing it.",
    signatureMove: "The Surgical Strike - Eliminating problems with terrifying efficiency and a knowing smile.",
    chaosPartner: 'MM',
    leadingMessage: "You don't just solve problems; you annihilate them in a way that looks good on Instagram. Efficiency as performance art.",
  },
  BN: {
    code: 'BN',
    name: 'Baffled Normie',
    pubLegend: 'Sensible Weapon',
    description: "In a world of screaming lunatics, you're the one sighing and putting the kettle on. Your superpower is being tragically, boringly sane.",
    coreDriver: "The heroic, tragic attempt to be normal in a world that isn't.",
    signatureMove: "The Sensible Detonation - Using basic common sense as a weapon of mass confusion.",
    chaosPartner: 'CTD',
    leadingMessage: "In a world of screaming lunatics, you're the one sighing and putting the kettle on. Your superpower is being tragically, boringly sane.",
  },
};

// Helper functions
export function getArchetype(code: ArchetypeCode): Archetype {
  return ARCHETYPES[code];
}

export function getArchetypeByName(name: string): Archetype | undefined {
  return Object.values(ARCHETYPES).find(a => a.name === name);
}

export function getPubLegendName(code: ArchetypeCode): string {
  return ARCHETYPES[code].pubLegend;
}

export function isValidArchetypeCode(code: string): code is ArchetypeCode {
  return ARCHETYPE_CODES.includes(code as ArchetypeCode);
}

// Hybrid profile combinations with special names
export const HYBRID_COMBOS: Record<string, string> = {
  'VN_CTD': "A truth-teller who believes their own conspiracy theories. You destroy bullshit, then build beautiful, intricate new bullshit to replace it.",
  'YO_SO': "Chaos with a business plan. You leap before you look, but you've already spreadsheet-ed the probable landing zones and their aesthetic value.",
  'DL_MM': "You apologise for existing, but you do it with such haunting elegance that people weep and forgive you instantly.",
  'TMZ_BN': "You bring serene, judgmental calm to every crisis. You're the person who makes a cup of tea during an earthquake and judges the tremors for poor rhythm.",
  'CS_MM': "You don't just solve problems; you annihilate them in a way that looks good on Instagram. Efficiency as performance art.",
  'VN_CS': "Dual bullshit destroyers. You see the nonsense, annihilate it, and leave no survivors. HR has a file on you.",
  'CTD_DL': "You overthink everything while apologising for overthinking. Your anxiety has anxiety about being too anxious.",
  'YO_MM': "Spontaneous aesthetic chaos. You dive in headfirst but somehow land in an artistically pleasing position.",
  'SO_TMZ': "Bureaucratic zen. Your spreadsheets have achieved enlightenment. Your pivot tables meditate.",
};

export function getHybridDescription(primary: ArchetypeCode, secondary: ArchetypeCode): string {
  const key1 = `${primary}_${secondary}`;
  const key2 = `${secondary}_${primary}`;

  if (HYBRID_COMBOS[key1]) return HYBRID_COMBOS[key1];
  if (HYBRID_COMBOS[key2]) return HYBRID_COMBOS[key2];

  // Default for unlisted combos
  return "Your psyche is a committee meeting where everyone's shouting and someone's definitely stealing pens. It shouldn't work, but somehow it does.";
}
