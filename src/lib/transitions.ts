/**
 * Lunatic Profiling V2 - Phase Transition Logic
 *
 * Handles the dramatic reveals between quiz phases:
 * - Phase 1→2: After Q8 - Early trait detection, top 3 archetypes
 * - Phase 2→3: After Q16 - Updated standings, damage profile
 */

import { ARCHETYPES, type ArchetypeCode } from './archetypes';
import { TRAITS, TRAIT_CODES, type TraitCode, interpretTraitScore } from './traits';
import {
  calculatePartialScore,
  type AnswerSelection,
  type ScoringResult,
} from './scoring';

// Phase transition points
export const PHASE_TRANSITION_QUESTIONS = {
  1: 8,  // After Q8, transition to Phase 2
  2: 16, // After Q16, transition to Phase 3
} as const;

// Interfaces
export interface TraitHighlight {
  trait: TraitCode;
  name: string;
  score: number;
  percentage: number;
  level: 'low' | 'medium' | 'high';
  interpretation: string;
}

export interface ArchetypeStanding {
  code: ArchetypeCode;
  name: string;
  pubLegend: string;
  percentage: number;
  position: number;
  movement?: 'up' | 'down' | 'stable'; // For Phase 2 transition
}

export interface PhaseTransitionResult {
  fromPhase: 1 | 2;
  toPhase: 2 | 3;
  topArchetypes: ArchetypeStanding[];
  emergingTraits: TraitHighlight[];
  transitionMessage: string;
  damageProfile?: string; // Only for Phase 2→3
  chaosWarning?: string;
  secretMessage?: string; // Easter egg for certain patterns
}

/**
 * Generate Phase 1 transition (after Q8)
 */
export function generatePhase1Transition(
  answers: AnswerSelection[]
): PhaseTransitionResult {
  const scores = calculatePartialScore(answers, 8);

  // Get top 3 archetypes
  const topArchetypes = scores.archetypes.ranked.slice(0, 3).map((a, i) => ({
    code: a.code,
    name: ARCHETYPES[a.code].name,
    pubLegend: ARCHETYPES[a.code].pubLegend,
    percentage: a.percentage,
    position: i + 1,
  }));

  // Get emerging traits (any with notable scores)
  const maxTraitPossible = scores.traits.maxPossible;
  const emergingTraits: TraitHighlight[] = TRAIT_CODES
    .map(code => {
      const interp = interpretTraitScore(code, scores.traits.scores[code], maxTraitPossible);
      return {
        trait: code,
        name: TRAITS[code].name,
        score: scores.traits.scores[code],
        percentage: interp.percentage,
        level: interp.level,
        interpretation: interp.interpretation,
      };
    })
    .filter(t => t.level !== 'medium') // Only show high or low traits
    .sort((a, b) => b.percentage - a.percentage);

  // Generate transition message based on leading archetype
  const leader = topArchetypes[0];
  const transitionMessage = getPhase1Message(leader.code, emergingTraits);

  // Check for chaos warning
  const chaosWarning = scores.chaosPattern === 'ping_pong'
    ? "Your answer pattern suggests emotional whiplash as a lifestyle choice. Phase 2 will test this theory."
    : undefined;

  // Check for secret message (easter eggs)
  const secretMessage = checkForSecretMessage(answers, 1);

  return {
    fromPhase: 1,
    toPhase: 2,
    topArchetypes,
    emergingTraits,
    transitionMessage,
    chaosWarning,
    secretMessage,
  };
}

/**
 * Generate Phase 2 transition (after Q16)
 */
export function generatePhase2Transition(
  answers: AnswerSelection[],
  phase1Standings?: ArchetypeStanding[]
): PhaseTransitionResult {
  const scores = calculatePartialScore(answers, 16);

  // Get top 3 archetypes with movement indicators
  const topArchetypes = scores.archetypes.ranked.slice(0, 3).map((a, i) => {
    const currentPosition = i + 1;

    // Determine movement if we have phase 1 data
    let movement: 'up' | 'down' | 'stable' | undefined;
    if (phase1Standings) {
      const prevStanding = phase1Standings.find(s => s.code === a.code);
      if (prevStanding) {
        if (currentPosition < prevStanding.position) movement = 'up';
        else if (currentPosition > prevStanding.position) movement = 'down';
        else movement = 'stable';
      } else {
        movement = 'up'; // New to top 3
      }
    }

    return {
      code: a.code,
      name: ARCHETYPES[a.code].name,
      pubLegend: ARCHETYPES[a.code].pubLegend,
      percentage: a.percentage,
      position: currentPosition,
      movement,
    };
  });

  // Get trait highlights
  const maxTraitPossible = scores.traits.maxPossible;
  const emergingTraits: TraitHighlight[] = TRAIT_CODES
    .map(code => {
      const interp = interpretTraitScore(code, scores.traits.scores[code], maxTraitPossible);
      return {
        trait: code,
        name: TRAITS[code].name,
        score: scores.traits.scores[code],
        percentage: interp.percentage,
        level: interp.level,
        interpretation: interp.interpretation,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Generate transition message
  const leader = topArchetypes[0];
  const transitionMessage = getPhase2Message(leader.code, scores);

  // Generate damage profile
  const damageProfile = generateDamageProfile(scores, emergingTraits);

  // Check for chaos warning
  const chaosWarning = getPhase2ChaosWarning(scores);

  // Check for secret message
  const secretMessage = checkForSecretMessage(answers, 2);

  return {
    fromPhase: 2,
    toPhase: 3,
    topArchetypes,
    emergingTraits,
    transitionMessage,
    damageProfile,
    chaosWarning,
    secretMessage,
  };
}

/**
 * Get phase 1 transition message based on leading archetype
 */
function getPhase1Message(code: ArchetypeCode, traits: TraitHighlight[]): string {
  const messages: Record<ArchetypeCode, string> = {
    VN: "Bullshit detected. And apparently, you've made destroying it your entire personality. Phase 2 will test if that's sustainable or just exhausting.",
    CTD: "You see patterns. Everywhere. In everything. Phase 2 will determine if you're a prophet or just really, really anxious.",
    YO: "Chaos embraced. Consequences delayed. Phase 2 will reveal if this is a lifestyle or a coping mechanism. (It's both.)",
    SO: "Everything's been optimised. Even your emotions have a filing system. Phase 2 introduces... variables.",
    DL: "You've apologised to the quiz itself, haven't you? Phase 2 will see if that diplomacy holds under pressure.",
    MM: "The aesthetic curation is noted. Phase 2 will test if you can make a complete breakdown look like a design choice.",
    TMZ: "Zen achieved through bureaucracy. Phase 2 will introduce chaos that cannot be formatted.",
    CS: "Problems have been annihilated. Phase 2 will provide more targets. Try to look less delighted about it.",
    BN: "You're... coping? Normally? Phase 2 will try harder to break you. For science.",
  };

  let message = messages[code] || "Your lunacy is taking shape. Phase 2 will define it.";

  // Add trait-specific note if there's a standout trait
  const highTrait = traits.find(t => t.level === 'high');
  if (highTrait) {
    const traitNotes: Record<TraitCode, string> = {
      BST: "\n\nEarly detection: Your Bullshit Tolerance is reading off the charts.",
      CPR: "\n\nEarly detection: Your Chaos Precision is unnervingly high.",
      AE: "\n\nEarly detection: Your Apology Efficiency is... weaponised.",
      BS: "\n\nEarly detection: Your British Stoicism is frightening.",
    };
    message += traitNotes[highTrait.trait] || '';
  }

  return message;
}

/**
 * Get phase 2 transition message
 */
function getPhase2Message(code: ArchetypeCode, scores: ScoringResult): string {
  const messages: Record<ArchetypeCode, string> = {
    VN: "The bullshit tolerance has been stress-tested. Phase 3 brings the final reckoning. Sharpen your precision guillotine.",
    CTD: "Patterns intensifying. Phase 3 will reveal if you're weaving genius or unraveling completely.",
    YO: "YOLO energy sustained. Phase 3 brings consequences you've been successfully ignoring.",
    SO: "The spreadsheet approaches its final form. Phase 3 will determine if enlightenment is just really good formatting.",
    DL: "Apologies deployed with military precision. Phase 3 will test the limits of your diplomatic arsenal.",
    MM: "Reality has been curated within an inch of its life. Phase 3 is the gallery opening.",
    TMZ: "Zen maintained under pressure. Phase 3 will attempt to disrupt your carefully formatted calm.",
    CS: "Surgical strikes continue. Phase 3 brings the final boss problems. Look alive.",
    BN: "Still boringly functional. Phase 3 will throw everything at you. We believe in you, you magnificent normie.",
  };

  let message = messages[code] || "Your profile is crystallizing. Phase 3 will seal your fate.";

  // Add hybrid warning if close race
  if (scores.hybrid.detected) {
    message += `\n\nWARNING: You're running a ${scores.hybrid.hybridName} hybrid. This explains a lot.`;
  }

  return message;
}

/**
 * Generate damage profile summary
 */
function generateDamageProfile(
  scores: ScoringResult,
  traits: TraitHighlight[]
): string {
  const profiles: string[] = [];

  // Check for extreme traits
  const highTraits = traits.filter(t => t.level === 'high');
  const lowTraits = traits.filter(t => t.level === 'low');

  if (highTraits.length >= 2) {
    profiles.push("MULTI-VECTOR CHAOS: Multiple traits spiking. You're not specializing—you're diversifying your dysfunction.");
  }

  if (lowTraits.length >= 2) {
    profiles.push("STRATEGIC VULNERABILITY: Multiple trait deficits detected. Your kryptonite has kryptonite.");
  }

  // Check for specific dangerous combos
  const hasBSTHigh = traits.find(t => t.trait === 'BST' && t.level === 'high');
  const hasAELow = traits.find(t => t.trait === 'AE' && t.level === 'low');
  if (hasBSTHigh && hasAELow) {
    profiles.push("DIPLOMATIC FAILURE MODE: High bullshit detection with low apology skills. You see through everyone's nonsense but can't smooth it over.");
  }

  const hasBSHigh = traits.find(t => t.trait === 'BS' && t.level === 'high');
  const hasCPRHigh = traits.find(t => t.trait === 'CPR' && t.level === 'high');
  if (hasBSHigh && hasCPRHigh) {
    profiles.push("CALM CHAOS ARCHITECT: You create elegant destruction while maintaining perfect composure. Terrifying.");
  }

  // Add chaos pattern to damage profile
  if (scores.chaosPattern === 'escalating') {
    profiles.push("ESCALATION PROTOCOL: Your answers trend toward maximum chaos. Phase 3 will be... eventful.");
  } else if (scores.chaosPattern === 'front_loaded') {
    profiles.push("SPEED CHAOS: Quick decisions, immediate consequences. You don't deliberate—you detonate.");
  }

  return profiles.length > 0
    ? profiles.join('\n\n')
    : "Standard lunacy profile. No unusual damage patterns detected. Which is, in itself, unusual.";
}

/**
 * Get phase 2 chaos warning
 */
function getPhase2ChaosWarning(scores: ScoringResult): string | undefined {
  if (scores.chaosPattern === 'ping_pong') {
    return "OSCILLATION ALERT: You're bouncing between extremes like a caffeinated pinball. Phase 3 may cause dizziness.";
  }

  if (scores.resistanceClearanceLevel === 'Supreme Chaos Chancellor') {
    return "CLEARANCE EXCEEDED: You're operating at levels that concern even us. Phase 3 is just a formality at this point.";
  }

  // Check if hybrid with tight race
  if (scores.hybrid.detected && scores.hybrid.percentageDiff !== null && scores.hybrid.percentageDiff < 5) {
    return "IDENTITY CRISIS: Your top two archetypes are in a statistical dead heat. Phase 3 will break the tie. Or you.";
  }

  return undefined;
}

/**
 * Check for easter egg conditions
 */
function checkForSecretMessage(answers: AnswerSelection[], phase: 1 | 2): string | undefined {
  // Check for all A's
  const allAs = answers.every(a => a.answerIds[0]?.endsWith('a'));
  if (allAs) {
    return phase === 1
      ? "You've chosen A for everything. Either you're speedrunning or you're not reading. We respect both."
      : "Still all A's. The commitment to not scrolling is honestly impressive.";
  }

  // Check for all last options
  const allLast = answers.every(a => {
    const letter = a.answerIds[0]?.charAt(a.answerIds[0].length - 1);
    return ['g', 'h'].includes(letter?.toLowerCase() || '');
  });
  if (allLast) {
    return phase === 1
      ? "You've read every option and chosen maximum chaos each time. We see you, agent of entropy."
      : "Consistently choosing the unhinged option. You're not taking a quiz—you're making a statement.";
  }

  // Check for alternating pattern
  const letters = answers.map(a => a.answerIds[0]?.charAt(a.answerIds[0].length - 1).toLowerCase());
  let isAlternating = true;
  for (let i = 1; i < letters.length; i++) {
    if (letters[i] === letters[i - 1]) {
      isAlternating = false;
      break;
    }
  }
  if (isAlternating && answers.length >= 4) {
    return "Your answers follow a never-repeat pattern. You're either a chaos mathematician or deeply contrarian.";
  }

  return undefined;
}

/**
 * Check if we're at a phase transition point
 */
export function isPhaseTransition(questionNumber: number): boolean {
  return questionNumber === 8 || questionNumber === 16;
}

/**
 * Get the next phase number
 */
export function getNextPhase(currentPhase: 1 | 2 | 3): 2 | 3 | null {
  if (currentPhase === 1) return 2;
  if (currentPhase === 2) return 3;
  return null;
}

/**
 * Get phase name
 */
export function getPhaseName(phase: 1 | 2 | 3): string {
  const names = {
    1: 'The Roast',
    2: 'The Revelation',
    3: 'The Alchemy',
  };
  return names[phase];
}

/**
 * Get phase description
 */
export function getPhaseDescription(phase: 1 | 2 | 3): string {
  const descriptions = {
    1: 'Baseline chaos assessment. Every answer reveals something awful.',
    2: 'Pattern recognition. Your dysfunction has a shape now.',
    3: 'Final synthesis. Who you really are when the stakes are imaginary but feel real.',
  };
  return descriptions[phase];
}
