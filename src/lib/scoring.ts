/**
 * Lunatic Profiling V2 - Scoring Engine
 *
 * Calculates archetype scores, trait scores, and theme scores
 * based on quiz answers with phase multipliers and ranking weights.
 */

import { ARCHETYPE_CODES, ARCHETYPES, type ArchetypeCode } from './archetypes';
import { TRAIT_CODES, type TraitCode, createEmptyTraitScores, type TraitScores } from './traits';
import { QUIZ_QUESTIONS, getQuestionById, type ThemeTag, THEME_TAGS } from './questions';
import type { ChaosPattern } from '@/schemas/result';

// Scoring constants
export const RANK_POINTS = {
  1: 3, // First choice
  2: 2, // Second choice
  3: 1, // Third choice
} as const;

export const PHASE_MULTIPLIERS = {
  1: 1,
  2: 2,
  3: 3,
} as const;

// Hybrid detection threshold
export const HYBRID_THRESHOLD_PERCENT = 12;

// Interfaces
export interface AnswerSelection {
  questionId: string;
  answerIds: string[]; // Ordered by rank (1st, 2nd, 3rd)
}

export interface ArchetypeScores {
  scores: Record<ArchetypeCode, number>;
  percentages: Record<ArchetypeCode, number>;
  ranked: Array<{ code: ArchetypeCode; score: number; percentage: number }>;
  maxPossible: number;
}

export interface TraitScoreResult {
  scores: TraitScores;
  percentages: TraitScores;
  maxPossible: number;
}

export interface ThemeScores {
  scores: Record<ThemeTag, number>;
  dominant: ThemeTag | null;
}

export interface HybridProfile {
  detected: boolean;
  primary: ArchetypeCode;
  secondary: ArchetypeCode | null;
  hybridName: string | null;
  percentageDiff: number | null;
  description: string | null;
}

export interface ScoringResult {
  archetypes: ArchetypeScores;
  traits: TraitScoreResult;
  themes: ThemeScores;
  hybrid: HybridProfile;
  chaosPattern: ChaosPattern;
  chaosPatternDescription: string;
  resistanceClearancePoints: number;
  resistanceClearanceLevel: string;
}

/**
 * Initialize empty archetype scores
 */
function createEmptyArchetypeScores(): Record<ArchetypeCode, number> {
  const scores: Partial<Record<ArchetypeCode, number>> = {};
  for (const code of ARCHETYPE_CODES) {
    scores[code] = 0;
  }
  return scores as Record<ArchetypeCode, number>;
}

/**
 * Initialize empty theme scores
 */
function createEmptyThemeScores(): Record<ThemeTag, number> {
  const scores: Partial<Record<ThemeTag, number>> = {};
  for (const tag of THEME_TAGS) {
    scores[tag] = 0;
  }
  return scores as Record<ThemeTag, number>;
}

/**
 * Calculate the maximum possible score for archetypes
 * This is the theoretical max if someone picked all top answers for one archetype
 */
function calculateMaxPossibleScore(): number {
  let maxPoints = 0;

  for (const question of QUIZ_QUESTIONS) {
    const phaseMultiplier = PHASE_MULTIPLIERS[question.phase];

    // Find the highest weight in any answer for this question
    let maxWeight = 0;
    for (const answer of question.answers) {
      for (const weight of Object.values(answer.archetypeWeights)) {
        if (weight > maxWeight) maxWeight = weight;
      }
    }

    // Max points for this question (1st rank with highest weight)
    maxPoints += RANK_POINTS[1] * phaseMultiplier * maxWeight;
  }

  return maxPoints;
}

/**
 * Calculate the maximum possible trait score
 */
function calculateMaxPossibleTraitScore(): number {
  let maxPoints = 0;

  for (const question of QUIZ_QUESTIONS) {
    const phaseMultiplier = PHASE_MULTIPLIERS[question.phase];

    // Find the highest trait impact in any answer
    let maxImpact = 0;
    for (const answer of question.answers) {
      for (const impact of Object.values(answer.traitImpacts)) {
        if (impact > maxImpact) maxImpact = impact;
      }
    }

    maxPoints += RANK_POINTS[1] * phaseMultiplier * maxImpact;
  }

  return maxPoints;
}

/**
 * Calculate archetype scores from answers
 */
export function calculateArchetypeScores(answers: AnswerSelection[]): ArchetypeScores {
  const scores = createEmptyArchetypeScores();
  const maxPossible = calculateMaxPossibleScore();

  for (const selection of answers) {
    const question = getQuestionById(selection.questionId);
    if (!question) continue;

    const phaseMultiplier = PHASE_MULTIPLIERS[question.phase];

    // Process each ranked answer
    selection.answerIds.forEach((answerId, index) => {
      const rank = (index + 1) as 1 | 2 | 3;
      const rankPoints = RANK_POINTS[rank];

      const answer = question.answers.find(a => a.id === answerId);
      if (!answer) return;

      // Apply points to each archetype
      for (const [code, weight] of Object.entries(answer.archetypeWeights)) {
        const points = rankPoints * phaseMultiplier * weight;
        scores[code as ArchetypeCode] += points;
      }
    });
  }

  // Calculate percentages
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const percentages = createEmptyArchetypeScores();

  for (const code of ARCHETYPE_CODES) {
    percentages[code] = totalScore > 0
      ? Math.round((scores[code] / totalScore) * 100)
      : 0;
  }

  // Create ranked list
  const ranked = ARCHETYPE_CODES.map(code => ({
    code,
    score: scores[code],
    percentage: percentages[code],
  })).sort((a, b) => b.score - a.score);

  return { scores, percentages, ranked, maxPossible };
}

/**
 * Calculate trait scores from answers
 */
export function calculateTraitScores(answers: AnswerSelection[]): TraitScoreResult {
  const scores = createEmptyTraitScores();
  const maxPossible = calculateMaxPossibleTraitScore();

  for (const selection of answers) {
    const question = getQuestionById(selection.questionId);
    if (!question) continue;

    const phaseMultiplier = PHASE_MULTIPLIERS[question.phase];

    selection.answerIds.forEach((answerId, index) => {
      const rank = (index + 1) as 1 | 2 | 3;
      const rankPoints = RANK_POINTS[rank];

      const answer = question.answers.find(a => a.id === answerId);
      if (!answer) return;

      for (const [trait, impact] of Object.entries(answer.traitImpacts)) {
        const points = rankPoints * phaseMultiplier * impact;
        scores[trait as TraitCode] += points;
      }
    });
  }

  // Calculate percentages (relative to max possible)
  const percentages = createEmptyTraitScores();
  for (const code of TRAIT_CODES) {
    percentages[code] = maxPossible > 0
      ? Math.round((scores[code] / maxPossible) * 100)
      : 0;
  }

  return { scores, percentages, maxPossible };
}

/**
 * Calculate theme scores for specialization detection
 */
export function calculateThemeScores(answers: AnswerSelection[]): ThemeScores {
  const scores = createEmptyThemeScores();

  for (const selection of answers) {
    const question = getQuestionById(selection.questionId);
    if (!question) continue;

    // Each question contributes its themes
    for (const theme of question.themeTags) {
      // Weight by how many answers were selected (engagement with theme)
      scores[theme] += selection.answerIds.length;
    }
  }

  // Find dominant theme
  let dominant: ThemeTag | null = null;
  let maxScore = 0;
  for (const [theme, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = theme as ThemeTag;
    }
  }

  return { scores, dominant };
}

/**
 * Detect hybrid profile when top 2 archetypes are within threshold
 */
export function detectHybridProfile(archetypeScores: ArchetypeScores): HybridProfile {
  const [first, second] = archetypeScores.ranked;

  if (!first || !second) {
    return {
      detected: false,
      primary: first?.code || 'BN',
      secondary: null,
      hybridName: null,
      percentageDiff: null,
      description: null,
    };
  }

  const diff = first.percentage - second.percentage;
  const isHybrid = diff <= HYBRID_THRESHOLD_PERCENT;

  if (!isHybrid) {
    return {
      detected: false,
      primary: first.code,
      secondary: null,
      hybridName: null,
      percentageDiff: diff,
      description: null,
    };
  }

  // Generate hybrid name and description
  const hybridName = `${first.code}/${second.code}`;
  const description = getHybridDescription(first.code, second.code);

  return {
    detected: true,
    primary: first.code,
    secondary: second.code,
    hybridName,
    percentageDiff: diff,
    description,
  };
}

/**
 * Get hybrid description for archetype pairs
 */
function getHybridDescription(primary: ArchetypeCode, secondary: ArchetypeCode): string {
  const combos: Record<string, string> = {
    'VN_CTD': "A truth-teller who believes their own conspiracy theories. You destroy bullshit, then build beautiful, intricate new bullshit to replace it.",
    'CTD_VN': "A truth-teller who believes their own conspiracy theories. You destroy bullshit, then build beautiful, intricate new bullshit to replace it.",
    'YO_SO': "Chaos with a business plan. You leap before you look, but you've already spreadsheet-ed the probable landing zones.",
    'SO_YO': "Chaos with a business plan. You leap before you look, but you've already spreadsheet-ed the probable landing zones.",
    'DL_MM': "You apologise for existing, but you do it with such haunting elegance that people weep and forgive you instantly.",
    'MM_DL': "You apologise for existing, but you do it with such haunting elegance that people weep and forgive you instantly.",
    'TMZ_BN': "Serene, judgmental calm in every crisis. You make tea during earthquakes and judge the tremors for poor rhythm.",
    'BN_TMZ': "Serene, judgmental calm in every crisis. You make tea during earthquakes and judge the tremors for poor rhythm.",
    'CS_MM': "You don't just solve problems; you annihilate them in a way that looks good on Instagram. Efficiency as performance art.",
    'MM_CS': "You don't just solve problems; you annihilate them in a way that looks good on Instagram. Efficiency as performance art.",
    'VN_CS': "Dual bullshit destroyers. You see the nonsense, annihilate it, and leave no survivors. HR has a file on you.",
    'CS_VN': "Dual bullshit destroyers. You see the nonsense, annihilate it, and leave no survivors. HR has a file on you.",
    'CTD_DL': "You overthink everything while apologising for overthinking. Your anxiety has anxiety about being too anxious.",
    'DL_CTD': "You overthink everything while apologising for overthinking. Your anxiety has anxiety about being too anxious.",
    'YO_MM': "Spontaneous aesthetic chaos. You dive in headfirst but somehow land in an artistically pleasing position.",
    'MM_YO': "Spontaneous aesthetic chaos. You dive in headfirst but somehow land in an artistically pleasing position.",
    'SO_TMZ': "Bureaucratic zen. Your spreadsheets have achieved enlightenment. Your pivot tables meditate.",
    'TMZ_SO': "Bureaucratic zen. Your spreadsheets have achieved enlightenment. Your pivot tables meditate.",
  };

  const key1 = `${primary}_${secondary}`;
  const key2 = `${secondary}_${primary}`;

  return combos[key1] || combos[key2] ||
    "Your psyche is a committee meeting where everyone's shouting and someone's definitely stealing pens. It shouldn't work, but somehow it does.";
}

/**
 * Analyze chaos pattern from answer selections
 */
export function analyzeChaosPattern(answers: AnswerSelection[]): { pattern: ChaosPattern; description: string } {
  // Get first answer letter from each question
  const firstChoiceLetters = answers.map(a => {
    const letter = a.answerIds[0]?.charAt(a.answerIds[0].length - 1).toUpperCase();
    return letter;
  }).filter(Boolean);

  if (firstChoiceLetters.length === 0) {
    return { pattern: 'adaptive', description: "Your chaos is mysteriously undefined." };
  }

  // Count positions (A/B = early, C/D/E = middle, F/G/H = late)
  let early = 0, middle = 0, late = 0;
  for (const letter of firstChoiceLetters) {
    if (['A', 'B'].includes(letter)) early++;
    else if (['C', 'D', 'E'].includes(letter)) middle++;
    else late++;
  }

  const total = firstChoiceLetters.length;
  const earlyPercent = (early / total) * 100;
  const middlePercent = (middle / total) * 100;
  const latePercent = (late / total) * 100;

  // Check for ping-pong (both early AND late are significant)
  if (earlyPercent >= 25 && latePercent >= 25) {
    return {
      pattern: 'ping_pong',
      description: "You oscillate between 'fuck it' and 'FUCK IT' with alarming regularity. Emotional whiplash as a lifestyle.",
    };
  }

  // Check for front-loaded
  if (earlyPercent >= 40) {
    return {
      pattern: 'front_loaded',
      description: "You make decisions like you're speedrunning life. First option? Good enough. Probably. Whatever.",
    };
  }

  // Check for escalating
  if (latePercent >= 40) {
    return {
      pattern: 'escalating',
      description: "You escalate to maximum chaos by default. The last option is always the most unhinged, and you LIVE there.",
    };
  }

  // Check for contained
  if (middlePercent >= 50) {
    return {
      pattern: 'contained',
      description: "Aggressively medium. You've found the chaotic center and you're holding it like a warm cup of anxiety tea.",
    };
  }

  // Default: adaptive
  return {
    pattern: 'adaptive',
    description: "Your chaos has no pattern because you ARE the pattern. Unpredictable. Concerning. Perfect.",
  };
}

/**
 * Calculate Resistance Clearance Level based on total points
 */
export function calculateResistanceClearance(
  archetypeScores: ArchetypeScores,
  traitScores: TraitScoreResult
): { level: string; points: number } {
  // Calculate total "lunacy points" - combination of highest archetype and trait scores
  const topArchetype = archetypeScores.ranked[0];
  const topTraitScore = Math.max(...Object.values(traitScores.scores));

  const points = Math.round(
    (topArchetype?.score || 0) * 0.6 +
    topTraitScore * 0.4
  );

  // Determine clearance level
  let level: string;
  if (points >= 800) {
    level = 'Supreme Chaos Chancellor';
  } else if (points >= 600) {
    level = 'Director of Strategic Weirdness';
  } else if (points >= 400) {
    level = 'Senior Chaos Agent';
  } else if (points >= 200) {
    level = 'Operative Grade II';
  } else {
    level = 'Probationary Lunatic';
  }

  return { level, points };
}

/**
 * Full scoring calculation
 */
export function calculateFullScore(answers: AnswerSelection[]): ScoringResult {
  const archetypes = calculateArchetypeScores(answers);
  const traits = calculateTraitScores(answers);
  const themes = calculateThemeScores(answers);
  const hybrid = detectHybridProfile(archetypes);
  const { pattern: chaosPattern, description: chaosPatternDescription } = analyzeChaosPattern(answers);
  const { level: resistanceClearanceLevel, points: resistanceClearancePoints } = calculateResistanceClearance(archetypes, traits);

  return {
    archetypes,
    traits,
    themes,
    hybrid,
    chaosPattern,
    chaosPatternDescription,
    resistanceClearancePoints,
    resistanceClearanceLevel,
  };
}

/**
 * Calculate partial scores (for phase transitions)
 */
export function calculatePartialScore(
  answers: AnswerSelection[],
  upToQuestion?: number
): ScoringResult {
  // Filter answers up to the specified question number
  let filteredAnswers = answers;

  if (upToQuestion !== undefined) {
    const questionIds = QUIZ_QUESTIONS
      .slice(0, upToQuestion)
      .map(q => q.id);

    filteredAnswers = answers.filter(a => questionIds.includes(a.questionId));
  }

  return calculateFullScore(filteredAnswers);
}

/**
 * Get top 3 archetypes for phase transition display
 */
export function getTop3Archetypes(archetypes: ArchetypeScores): Array<{ code: ArchetypeCode; name: string; percentage: number }> {
  return archetypes.ranked.slice(0, 3).map(a => ({
    code: a.code,
    name: ARCHETYPES[a.code].name,
    percentage: a.percentage,
  }));
}
