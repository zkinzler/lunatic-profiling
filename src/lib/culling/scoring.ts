// ============================================
// The Culling - Scoring Logic
// ============================================

import type { GhostCode } from './ghosts';
import type { AnswerChoice } from './questions';
import { CULLING_QUESTIONS, getGhostFromAnswer } from './questions';
import { GHOST_TYPES } from './ghosts';

export interface GhostScores {
  CD: number;
  CA: number;
  OB: number;
  DD: number;
}

export interface CullingScoreResult {
  scores: GhostScores;
  percentages: GhostScores;
  dominantGhost: GhostCode;
  secondaryGhost: GhostCode;
  isElite: boolean;
  eliteThreshold: number;
  resultTitle: string;
  resultDescription: string;
  comedyFingerprint: string;
  shareText: string;
}

/**
 * Elite Calculation:
 * - 4+ answers (≥40%) for any ghost type = 4% Elite
 * - Otherwise = 96% Culled
 */
const ELITE_THRESHOLD = 4; // 4 out of 10 answers

/**
 * Calculate ghost scores from answers
 */
export function calculateGhostScores(answers: Record<string, AnswerChoice>): GhostScores {
  const scores: GhostScores = { CD: 0, CA: 0, OB: 0, DD: 0 };

  for (const [questionId, answer] of Object.entries(answers)) {
    const ghost = getGhostFromAnswer(questionId, answer);
    if (ghost) {
      scores[ghost]++;
    }
  }

  return scores;
}

/**
 * Convert raw scores to percentages
 */
export function calculatePercentages(scores: GhostScores): GhostScores {
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    return { CD: 0, CA: 0, OB: 0, DD: 0 };
  }

  return {
    CD: Math.round((scores.CD / total) * 100),
    CA: Math.round((scores.CA / total) * 100),
    OB: Math.round((scores.OB / total) * 100),
    DD: Math.round((scores.DD / total) * 100),
  };
}

/**
 * Get ranked ghost codes by score
 */
export function getRankedGhosts(scores: GhostScores): GhostCode[] {
  return (Object.keys(scores) as GhostCode[]).sort((a, b) => scores[b] - scores[a]);
}

/**
 * Check if user qualifies as elite (4+ answers for any ghost type)
 */
export function checkEliteStatus(scores: GhostScores): boolean {
  return Object.values(scores).some(score => score >= ELITE_THRESHOLD);
}

/**
 * Generate result title based on ghost type and elite status
 */
function generateResultTitle(dominantGhost: GhostCode, isElite: boolean): string {
  const ghost = GHOST_TYPES[dominantGhost];

  if (isElite) {
    return `${ghost.fullTitle} - The 4%`;
  }
  return `Culled: Insufficient ${ghost.name}`;
}

/**
 * Generate result description
 */
function generateResultDescription(dominantGhost: GhostCode, isElite: boolean): string {
  const ghost = GHOST_TYPES[dominantGhost];

  if (isElite) {
    return ghost.eliteDescription;
  }
  return ghost.culledDescription;
}

/**
 * Generate comedy fingerprint (unique identifier based on scores)
 */
function generateComedyFingerprint(scores: GhostScores): string {
  const ranked = getRankedGhosts(scores);
  const primary = ranked[0];
  const secondary = ranked[1];

  // Create a fingerprint like "CD-7/CA-2/OB-1/DD-0"
  const signature = ranked.map(ghost => `${ghost}-${scores[ghost]}`).join('/');

  // Add flavor text
  const combos: Record<string, string> = {
    'CD-CA': 'Calculated Chaos',
    'CD-OB': 'Surgical Observer',
    'CD-DD': 'Cold Precision',
    'CA-CD': 'Chaotic Surgeon',
    'CA-OB': 'Chaotic Witness',
    'CA-DD': 'Deadpan Maniac',
    'OB-CD': 'Observant Executioner',
    'OB-CA': 'Wild-Eyed Witness',
    'OB-DD': 'Silent Observer',
    'DD-CD': 'Precision Void',
    'DD-CA': 'Stoic Madness',
    'DD-OB': 'Expressionless Mirror',
  };

  const comboKey = `${primary}-${secondary}`;
  const comboName = combos[comboKey] || 'Unique Specimen';

  return `${comboName} [${signature}]`;
}

/**
 * Generate shareable text
 */
function generateShareText(dominantGhost: GhostCode, isElite: boolean, scores: GhostScores): string {
  const ghost = GHOST_TYPES[dominantGhost];
  const status = isElite ? 'Survived The Culling' : 'Was Culled';

  return `I ${status}! My comedic ghost type is ${ghost.fullTitle}. ${isElite ? `I'm in the 4% with ${scores[dominantGhost]}/10 ${ghost.name} answers.` : 'Turns out I can\'t take the heat.'} Take The Culling quiz to find out if you survive.`;
}

/**
 * Full scoring function - takes answers and returns complete result
 */
export function calculateCullingResult(answers: Record<string, AnswerChoice>): CullingScoreResult {
  // Validate we have all 10 answers
  const answerCount = Object.keys(answers).length;
  if (answerCount < CULLING_QUESTIONS.length) {
    console.warn(`Only ${answerCount} answers provided, expected ${CULLING_QUESTIONS.length}`);
  }

  const scores = calculateGhostScores(answers);
  const percentages = calculatePercentages(scores);
  const ranked = getRankedGhosts(scores);
  const dominantGhost = ranked[0];
  const secondaryGhost = ranked[1];
  const isElite = checkEliteStatus(scores);

  return {
    scores,
    percentages,
    dominantGhost,
    secondaryGhost,
    isElite,
    eliteThreshold: ELITE_THRESHOLD,
    resultTitle: generateResultTitle(dominantGhost, isElite),
    resultDescription: generateResultDescription(dominantGhost, isElite),
    comedyFingerprint: generateComedyFingerprint(scores),
    shareText: generateShareText(dominantGhost, isElite, scores),
  };
}
