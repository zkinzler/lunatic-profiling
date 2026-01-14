/**
 * Lunatic Profiling V2 - Blueprint Generation
 *
 * Generates the full Lunacy Blueprint from quiz answers and scores.
 * Uses template-based generation with optional LLM enhancement.
 */

import { ARCHETYPES, type ArchetypeCode, getArchetype } from './archetypes';
import { TRAITS, type TraitCode, calculateBritishnessQuotient } from './traits';
import {
  calculateFullScore,
  type AnswerSelection,
  type ScoringResult,
} from './scoring';
import type { LunacyBlueprint } from '@/schemas/result';

// Interfaces
export interface BlueprintInput {
  answers: AnswerSelection[];
  sessionId: string;
}

export interface BlueprintResult {
  blueprint: LunacyBlueprint;
  rawScores: ScoringResult;
}

/**
 * Generate core driver based on primary archetype
 */
function generateCoreDriver(primaryCode: ArchetypeCode): string {
  const archetype = getArchetype(primaryCode);
  return archetype.coreDriver;
}

/**
 * Generate superpower based on highest trait
 */
function generateSuperpower(traitScores: Record<TraitCode, number>): string {
  // Find highest trait
  let highestTrait: TraitCode = 'BST';
  let highestScore = 0;

  for (const [trait, score] of Object.entries(traitScores)) {
    if (score > highestScore) {
      highestScore = score;
      highestTrait = trait as TraitCode;
    }
  }

  return TRAITS[highestTrait].superpowerHigh;
}

/**
 * Generate kryptonite based on lowest trait
 */
function generateKryptonite(traitScores: Record<TraitCode, number>): string {
  // Find lowest trait
  let lowestTrait: TraitCode = 'BST';
  let lowestScore = Infinity;

  for (const [trait, score] of Object.entries(traitScores)) {
    if (score < lowestScore) {
      lowestScore = score;
      lowestTrait = trait as TraitCode;
    }
  }

  return TRAITS[lowestTrait].kryptoniteLow;
}

/**
 * Generate repressed shadow based on lowest archetype
 */
function generateRepressedShadow(rankedArchetypes: Array<{ code: ArchetypeCode; score: number }>): string {
  const lowest = rankedArchetypes[rankedArchetypes.length - 1];
  if (!lowest) return "Unknown shadows lurk within.";

  const shadowMessages: Record<ArchetypeCode, string> = {
    VN: "Deep down, you avoid confrontation. The truth-telling facade hides someone who'd rather not rock the boat.",
    CTD: "You secretly crave simplicity. All those patterns? Maybe they're just... noise. And that terrifies you.",
    YO: "Beneath the chaos, you crave control. The spontaneity is a performance masking deep anxiety about outcomes.",
    SO: "You fear that feelings can't actually be organised. The spreadsheet is a coping mechanism, not a solution.",
    DL: "You resent always being the peacekeeper. Sometimes you want to be the one causing the problems.",
    MM: "The aesthetic perfection masks a fear of being seen as boring. Without the curation, who even are you?",
    TMZ: "The zen is exhausting to maintain. Sometimes you want to absolutely lose your shit, but you've forgotten how.",
    CS: "You secretly miss the problems you've annihilated. Without chaos to solve, what's your purpose?",
    BN: "You've suppressed your inner lunatic so hard it's become your shadow. One day it'll escape. Gloriously.",
  };

  return shadowMessages[lowest.code];
}

/**
 * Generate internal conflict based on trait combinations
 */
function generateInternalConflict(
  traitScores: Record<TraitCode, number>,
  maxPossible: number
): string {
  const percentages: Record<TraitCode, number> = {} as Record<TraitCode, number>;
  for (const [trait, score] of Object.entries(traitScores)) {
    percentages[trait as TraitCode] = Math.round((score / maxPossible) * 100);
  }

  // Check for specific conflicts
  if (percentages.BST >= 40 && percentages.AE <= 15) {
    return "You destroy bullshit but can't apologise for the collateral damage. The wrecker who can't do the paperwork.";
  }

  if (percentages.CPR >= 40 && percentages.BS >= 40) {
    return "You create elegant chaos while maintaining perfect tea-making standards. The anarchist with a thermos.";
  }

  if (percentages.AE >= 40 && percentages.BST <= 15) {
    return "You apologise beautifully while secretly believing everyone's full of shit. The diplomat who's armed.";
  }

  if (percentages.BST >= 40 && percentages.CPR >= 40) {
    return "You dismantle nonsense with such precision it creates new, better nonsense. The arsonist-architect.";
  }

  if (percentages.BS >= 40 && percentages.AE <= 15) {
    return "You make tea during crises but won't say sorry when you spill it. The stoic who's also a bit of a prick.";
  }

  return "Your internal landscape is surprisingly harmonious. Suspicious, but harmonious.";
}

/**
 * Generate final form based on Q24 answer
 */
function generateFinalForm(answers: AnswerSelection[]): string {
  // Find Q24 answer
  const q24Answer = answers.find(a => a.questionId === 'q24');
  const firstChoice = q24Answer?.answerIds[0];

  const finalForms: Record<string, string> = {
    q24a: "THE ETERNAL OPTIMIST: You'll YOLO your way through eternity with zero regrets. Death is just another adventure.",
    q24b: "THE AESTHETIC MARTYR: You'll curate your own haunting with such elegance that purgatory becomes an art installation.",
    q24c: "THE BUREAUCRATIC IMMORTAL: You'll spreadsheet your way to redemption. Even cosmic justice has paperwork.",
    q24d: "THE CHAOS AMBASSADOR: You'll negotiate with the universe itself, apologising your way to cosmic peace treaties.",
    q24e: "THE PATTERN PROPHET: You'll see the conspiracy in everything, including your own judgment. Meta-paranoia achieved.",
    q24f: "THE TRUTH TORPEDO: You'll destroy even posthumous bullshit with surgical precision. Honesty is eternal.",
    q24g: "THE ZEN PHANTOM: You'll achieve such serenity that you transcend judgment entirely. Enlightenment through apathy.",
    q24h: "THE PROCESS IMMORTAL: You'll outsource your eternal judgment to committees. Death is just another stakeholder meeting.",
  };

  return finalForms[firstChoice || 'q24a'] || "Your final form remains mysteriously undefined.";
}

/**
 * Generate signature move based on primary archetype
 */
function generateSignatureMove(primaryCode: ArchetypeCode): string {
  return getArchetype(primaryCode).signatureMove;
}

/**
 * Generate chaos partner recommendation
 */
function generateChaosPartner(primaryCode: ArchetypeCode): string {
  const partnerCode = getArchetype(primaryCode).chaosPartner;
  const partner = getArchetype(partnerCode);

  const partnerMessages: Record<ArchetypeCode, string> = {
    VN: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). Where you destroy, they apologise. It's a beautiful, dysfunctional balance.`,
    CTD: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll organise your conspiracy theories into pivot tables.`,
    YO: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll find peace in your chaos and you'll find chaos in their peace.`,
    SO: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll YOLO all over your carefully planned spreadsheets.`,
    DL: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll say what you're too diplomatic to express.`,
    MM: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll find zen in your chaos curation.`,
    TMZ: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll make your minimalist rage look fabulous.`,
    CS: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). Together you'll annihilate problems AND make them look good.`,
    BN: `Your ideal chaos partner is the ${partner.name} (${partner.pubLegend}). They'll show you that patterns exist everywhere. You'll teach them that sometimes there are no patterns. Both are terrifying.`,
  };

  return partnerMessages[primaryCode];
}

/**
 * Generate ASCII chart for archetype scores
 */
function generateAsciiChart(
  rankedArchetypes: Array<{ code: ArchetypeCode; score: number; percentage: number }>
): string {
  const maxBarLength = 20;
  const lines: string[] = ['```'];
  lines.push('ARCHETYPE DAMAGE REPORT');
  lines.push('═'.repeat(35));

  for (const arch of rankedArchetypes) {
    const barLength = Math.round((arch.percentage / 100) * maxBarLength);
    const bar = '█'.repeat(barLength) + '░'.repeat(maxBarLength - barLength);
    const label = `${arch.code}`.padEnd(4);
    const pct = `${arch.percentage}%`.padStart(4);
    lines.push(`${label} ${bar} ${pct}`);
  }

  lines.push('═'.repeat(35));
  lines.push('```');

  return lines.join('\n');
}

/**
 * Generate summary narrative
 */
function generateSummary(
  scores: ScoringResult,
  britishnessInterpretation: string
): string {
  const primary = scores.archetypes.ranked[0];
  const archetype = getArchetype(primary.code);

  let summary = `You are a ${archetype.name} (${archetype.pubLegend}). ${archetype.description}`;

  if (scores.hybrid.detected && scores.hybrid.secondary) {
    summary += `\n\nBut wait—you're also showing strong ${ARCHETYPES[scores.hybrid.secondary].name} tendencies. `;
    summary += scores.hybrid.description;
  }

  summary += `\n\nYour chaos pattern is "${scores.chaosPattern}": ${scores.chaosPatternDescription}`;
  summary += `\n\nBritishness Assessment: ${britishnessInterpretation}`;
  summary += `\n\nResistance Clearance: ${scores.resistanceClearanceLevel}`;

  return summary;
}

/**
 * Generate shareable one-liner stat
 */
function generateShareableStat(scores: ScoringResult): string {
  const primary = scores.archetypes.ranked[0];
  const archetype = getArchetype(primary.code);

  const stats = [
    `I'm a ${archetype.pubLegend} with ${primary.percentage}% ${archetype.name} energy.`,
    `Diagnosed: ${archetype.pubLegend}. Prognosis: Magnificent chaos.`,
    `${primary.percentage}% ${archetype.name}. ${100 - primary.percentage}% plausible deniability.`,
    `Officially certified as a ${archetype.pubLegend}. HR has been notified.`,
    `My chaos pattern is "${scores.chaosPattern}". Yours probably isn't.`,
  ];

  return stats[Math.floor(Math.random() * stats.length)];
}

/**
 * Generate the full Lunacy Blueprint
 */
export function generateBlueprint(input: BlueprintInput): BlueprintResult {
  const { answers } = input;

  // Calculate all scores
  const scores = calculateFullScore(answers);

  // Get primary and secondary archetypes
  const primaryArchetype = {
    code: scores.archetypes.ranked[0].code,
    name: ARCHETYPES[scores.archetypes.ranked[0].code].name,
    pubLegend: ARCHETYPES[scores.archetypes.ranked[0].code].pubLegend,
    score: scores.archetypes.ranked[0].score,
    percentage: scores.archetypes.ranked[0].percentage,
  };

  const secondaryArchetype = scores.archetypes.ranked[1] ? {
    code: scores.archetypes.ranked[1].code,
    name: ARCHETYPES[scores.archetypes.ranked[1].code].name,
    pubLegend: ARCHETYPES[scores.archetypes.ranked[1].code].pubLegend,
    score: scores.archetypes.ranked[1].score,
    percentage: scores.archetypes.ranked[1].percentage,
  } : undefined;

  // Calculate Britishness Quotient
  const { ratio: britishnessQuotient, interpretation: britishnessInterpretation } =
    calculateBritishnessQuotient(scores.traits.scores.BS, scores.traits.scores.AE);

  // Generate all blueprint sections
  const coreDriver = generateCoreDriver(primaryArchetype.code);
  const superpower = generateSuperpower(scores.traits.scores);
  const kryptonite = generateKryptonite(scores.traits.scores);
  const repressedShadow = generateRepressedShadow(scores.archetypes.ranked);
  const internalConflict = generateInternalConflict(scores.traits.scores, scores.traits.maxPossible);
  const finalForm = generateFinalForm(answers);
  const signatureMove = generateSignatureMove(primaryArchetype.code);
  const chaosPartner = generateChaosPartner(primaryArchetype.code);
  const asciiChart = generateAsciiChart(scores.archetypes.ranked);
  const summary = generateSummary(scores, britishnessInterpretation);
  const shareableStat = generateShareableStat(scores);

  // Build the blueprint
  const blueprint: LunacyBlueprint = {
    primaryArchetype,
    secondaryArchetype,
    hybridProfile: {
      detected: scores.hybrid.detected,
      primary: scores.hybrid.primary,
      secondary: scores.hybrid.secondary || undefined,
      hybridName: scores.hybrid.hybridName || undefined,
      percentageDiff: scores.hybrid.percentageDiff || undefined,
      description: scores.hybrid.description || undefined,
    },
    allArchetypeScores: scores.archetypes.scores,
    allArchetypePercentages: scores.archetypes.percentages,
    traitScores: scores.traits.scores,
    traitPercentages: scores.traits.percentages,
    themeScores: scores.themes.scores,
    specialization: scores.themes.dominant || undefined,
    coreDriver,
    superpower,
    kryptonite,
    repressedShadow,
    internalConflict,
    finalForm,
    signatureMove,
    chaosPartner,
    britishnessQuotient,
    britishnessInterpretation,
    resistanceClearanceLevel: scores.resistanceClearanceLevel as "Probationary Lunatic" | "Operative Grade II" | "Senior Chaos Agent" | "Director of Strategic Weirdness" | "Supreme Chaos Chancellor",
    resistanceClearancePoints: scores.resistanceClearancePoints,
    chaosPattern: scores.chaosPattern,
    chaosPatternDescription: scores.chaosPatternDescription,
    asciiChart,
    summary,
    shareableStat,
  };

  return { blueprint, rawScores: scores };
}

/**
 * Convert blueprint to database-ready format for Result model
 */
export function blueprintToResultData(blueprint: LunacyBlueprint, sessionId: string) {
  return {
    sessionId,
    // Primary archetype
    primaryArchetypeCode: blueprint.primaryArchetype.code,
    primaryArchetypeName: blueprint.primaryArchetype.name,
    primaryArchetypePubLegend: blueprint.primaryArchetype.pubLegend,
    primaryArchetypeScore: blueprint.primaryArchetype.score,
    primaryArchetypePercentage: blueprint.primaryArchetype.percentage,
    // Secondary archetype
    secondaryArchetypeCode: blueprint.secondaryArchetype?.code || null,
    secondaryArchetypeName: blueprint.secondaryArchetype?.name || null,
    secondaryArchetypePubLegend: blueprint.secondaryArchetype?.pubLegend || null,
    secondaryArchetypeScore: blueprint.secondaryArchetype?.score || null,
    secondaryArchetypePercentage: blueprint.secondaryArchetype?.percentage || null,
    // Hybrid profile
    isHybrid: blueprint.hybridProfile.detected,
    hybridName: blueprint.hybridProfile.hybridName || null,
    hybridDescription: blueprint.hybridProfile.description || null,
    hybridPercentageDiff: blueprint.hybridProfile.percentageDiff || null,
    // All archetype scores
    allArchetypeScores: blueprint.allArchetypeScores,
    allArchetypePercentages: blueprint.allArchetypePercentages,
    // Trait scores
    traitBST: blueprint.traitScores.BST,
    traitCPR: blueprint.traitScores.CPR,
    traitAE: blueprint.traitScores.AE,
    traitBS: blueprint.traitScores.BS,
    // Trait percentages
    traitBSTPercentage: blueprint.traitPercentages.BST,
    traitCPRPercentage: blueprint.traitPercentages.CPR,
    traitAEPercentage: blueprint.traitPercentages.AE,
    traitBSPercentage: blueprint.traitPercentages.BS,
    // Theme scores
    themeScores: blueprint.themeScores,
    specialization: blueprint.specialization || null,
    // Blueprint sections
    coreDriver: blueprint.coreDriver,
    superpower: blueprint.superpower,
    kryptonite: blueprint.kryptonite,
    repressedShadow: blueprint.repressedShadow,
    internalConflict: blueprint.internalConflict,
    finalForm: blueprint.finalForm,
    signatureMove: blueprint.signatureMove,
    chaosPartner: blueprint.chaosPartner,
    // Computed stats
    britishnessQuotient: blueprint.britishnessQuotient,
    britishnessInterpretation: blueprint.britishnessInterpretation,
    resistanceClearanceLevel: blueprint.resistanceClearanceLevel,
    resistanceClearancePoints: blueprint.resistanceClearancePoints,
    chaosPattern: blueprint.chaosPattern,
    chaosPatternDescription: blueprint.chaosPatternDescription,
    // Visual and summary
    asciiChart: blueprint.asciiChart,
    summary: blueprint.summary,
    shareableStat: blueprint.shareableStat,
  };
}
