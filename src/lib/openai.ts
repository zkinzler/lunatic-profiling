/**
 * OpenAI Integration for Lunatic Profiling
 *
 * Handles AI-generated roasts and blueprint sections.
 */

import OpenAI from 'openai';
import { getArchetype, type ArchetypeCode } from './archetypes';
import { TRAITS, type TraitCode } from './traits';
import type { ScoringResult } from './scoring';

// Initialize OpenAI client (lazy initialization)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
}

/**
 * Check if OpenAI is available
 */
export function isOpenAIAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

/**
 * System prompt for the roast generator
 */
const ROAST_SYSTEM_PROMPT = `You are a hilariously brutal British comedy writer for "Lunatic Profiling" - a personality quiz that roasts people after every answer.

Your job: Write ONE short, savage roast (2-3 sentences max) based on the user's answer choice.

Style guidelines:
- British humor: dry, sardonic, self-deprecating observations
- Be clever and cutting, never mean-spirited or offensive
- Reference the specific answer they chose
- Use creative metaphors and unexpected observations
- Swear occasionally but cleverly (bloody, bollocks, Christ, etc.)
- End with something that makes them laugh at themselves

DO NOT:
- Be genuinely hurtful or personal
- Reference race, gender, sexuality, or religion
- Use American slang or references
- Write more than 3 sentences
- Be boring or generic`;

/**
 * Generate an AI roast for a quiz answer
 */
export async function generateAIRoast(
  questionText: string,
  answerText: string,
  category: string,
  answerHistory: string[]
): Promise<string | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const historyContext = answerHistory.length > 0
      ? `\n\nTheir previous answer patterns suggest they're ${answerHistory.length > 3 ? 'committed to chaos' : 'just getting started'}.`
      : '';

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: ROAST_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Question: "${questionText}"

Their answer: "${answerText}"

Answer category: ${category} (this hints at their personality type)${historyContext}

Write a roast for this answer:`,
        },
      ],
      max_tokens: 150,
      temperature: 0.9,
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI roast generation failed:', error);
    return null;
  }
}

/**
 * System prompt for the blueprint generator
 */
const BLUEPRINT_SYSTEM_PROMPT = `You are a brilliantly sarcastic British psychologist writing personality assessments for "Lunatic Profiling."

Your job: Write personalized, brutally honest (but hilarious) personality insights based on quiz results.

Style guidelines:
- British humor: dry wit, sardonic observations, understated savagery
- Be specific to their archetype and traits
- Make them laugh while feeling genuinely seen
- Use creative metaphors and unexpected comparisons
- Reference their specific combination of chaos
- Swear occasionally but cleverly
- Balance roasting with genuine (if backhanded) compliments

Keep each section to 2-3 sentences maximum. Be punchy, not verbose.`;

/**
 * Generate AI-enhanced blueprint sections
 */
export async function generateAIBlueprint(
  scores: ScoringResult,
  primaryCode: ArchetypeCode,
  secondaryCode: ArchetypeCode | null,
  isHybrid: boolean
): Promise<{
  coreDriver: string;
  superpower: string;
  kryptonite: string;
  repressedShadow: string;
  internalConflict: string;
  finalForm: string;
  signatureMove: string;
  chaosPartner: string;
  summary: string;
  shareableStat: string;
} | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const primary = getArchetype(primaryCode);
    const secondary = secondaryCode ? getArchetype(secondaryCode) : null;

    // Find highest and lowest traits
    const traitEntries = Object.entries(scores.traits.percentages) as [TraitCode, number][];
    const sortedTraits = traitEntries.sort((a, b) => b[1] - a[1]);
    const highestTrait = TRAITS[sortedTraits[0][0]];
    const lowestTrait = TRAITS[sortedTraits[sortedTraits.length - 1][0]];

    const prompt = `Generate a personality blueprint for someone with these results:

PRIMARY ARCHETYPE: ${primary.name} (${primary.pubLegend}) - ${primary.description}
${secondary ? `SECONDARY ARCHETYPE: ${secondary.name} (${secondary.pubLegend}) - ${secondary.description}` : ''}
${isHybrid ? `They're a HYBRID type - their top two archetypes are very close in score.` : ''}

HIGHEST TRAIT: ${highestTrait.name} (${sortedTraits[0][1]}%) - ${highestTrait.description}
LOWEST TRAIT: ${lowestTrait.name} (${sortedTraits[sortedTraits.length - 1][1]}%) - ${lowestTrait.description}

CHAOS PATTERN: ${scores.chaosPattern} - ${scores.chaosPatternDescription}

Generate these sections (2-3 sentences each, be specific to their combination):

1. CORE_DRIVER: What fundamentally motivates them (their deepest psychological need)
2. SUPERPOWER: Their greatest strength (make it sound impressive but slightly unhinged)
3. KRYPTONITE: Their fatal weakness (what defeats them)
4. REPRESSED_SHADOW: What they secretly are but won't admit
5. INTERNAL_CONFLICT: The war inside their head
6. FINAL_FORM: What they'll become if they fully embrace their archetype (funny prediction)
7. SIGNATURE_MOVE: Their go-to behavior in chaos (named like a wrestling move)
8. CHAOS_PARTNER: What archetype would complement them and why
9. SUMMARY: A 3-4 sentence overall roast/summary of who they are
10. SHAREABLE_STAT: A funny one-liner stat for social media (format: "X% [Archetype]. Y% plausible deniability." or similar)

Format your response as JSON with these exact keys: coreDriver, superpower, kryptonite, repressedShadow, internalConflict, finalForm, signatureMove, chaosPartner, summary, shareableStat`;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: BLUEPRINT_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.85,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      coreDriver: parsed.coreDriver || null,
      superpower: parsed.superpower || null,
      kryptonite: parsed.kryptonite || null,
      repressedShadow: parsed.repressedShadow || null,
      internalConflict: parsed.internalConflict || null,
      finalForm: parsed.finalForm || null,
      signatureMove: parsed.signatureMove || null,
      chaosPartner: parsed.chaosPartner || null,
      summary: parsed.summary || null,
      shareableStat: parsed.shareableStat || null,
    };
  } catch (error) {
    console.error('OpenAI blueprint generation failed:', error);
    return null;
  }
}
