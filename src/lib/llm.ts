import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { trackUsage, calculateOpenAICost } from '@/lib/usage-tracking';

interface AnalysisInput {
  scores: Record<string, number>;
  percentages: Record<string, number>;
  topArchetypes: Array<{ name: string; percentage: number }>;
  overlaps: Array<{ archetypes: string[]; similarity: number }>;
}

interface AnalysisResult {
  summary: string;
  raw: Record<string, unknown>;
}

export async function analyzeLunacyProfile(
  input: AnalysisInput
): Promise<AnalysisResult> {
  return analyzeWithOpenAI(input);
}

async function analyzeWithOpenAI(input: AnalysisInput): Promise<AnalysisResult> {
  // If no API key, use mock fallback (useful for testing)
  if (!process.env.OPENAI_API_KEY) {
    console.warn('No OPENAI_API_KEY configured, using mock analysis');
    return {
      summary: generateMockSummary(input.topArchetypes),
      raw: {
        summary: generateMockSummary(input.topArchetypes),
        insights: input.topArchetypes,
        recommendations: generateMockRecommendations(input.topArchetypes),
      },
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const systemPrompt = getSystemPrompt();
  const userPrompt = createAnalysisPrompt(input);

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    // Track usage
    const usage = completion.usage;
    if (usage) {
      const costs = calculateOpenAICost('gpt-4o-mini', usage.prompt_tokens, usage.completion_tokens);
      await trackUsage({
        model: 'gpt-4o-mini',
        provider: 'openai',
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        inputCostUsd: costs.inputCostUsd,
        outputCostUsd: costs.outputCostUsd,
        totalCostUsd: costs.totalCostUsd,
      });
    }

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      console.error('OpenAI response that failed to parse:', response.substring(0, 500));
      throw new Error(`Failed to parse JSON response from OpenAI: ${parseError}`);
    }

    console.log('Parsed OpenAI response:', JSON.stringify(parsedResponse, null, 2));

    // Handle different response formats
    let summary: string;
    if (typeof parsedResponse.summary === 'string') {
      summary = parsedResponse.summary;
    } else if (typeof parsedResponse.summary === 'object' && parsedResponse.summary) {
      // Convert object summary to string
      summary = `Your dominant archetype is ${parsedResponse.summary.core_archetype || 'Unknown'}. ` +
        `Key traits include: ${(parsedResponse.summary.traits || []).join(', ')}. ` +
        `You excel at ${(parsedResponse.summary.strengths_and_gifts || []).slice(0, 2).join(' and ')}.`;
    } else {
      console.error('OpenAI response missing or invalid summary field:', parsedResponse);
      throw new Error('Invalid response format: missing or invalid summary field');
    }

    return {
      summary,
      raw: parsedResponse,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Fallback to mock analysis in case of API failure
    const mockAnalysis = {
      summary: generateMockSummary(input.topArchetypes),
      insights: input.topArchetypes,
      recommendations: generateMockRecommendations(input.topArchetypes),
    };

    return {
      summary: mockAnalysis.summary,
      raw: mockAnalysis,
    };
  }
}

function getSystemPrompt(): string {
  try {
    // Try to read from SYSTEM_PROMPT.md file first
    const systemPromptPath = path.join(process.cwd(), 'SYSTEM_PROMPT.md');
    if (fs.existsSync(systemPromptPath)) {
      return fs.readFileSync(systemPromptPath, 'utf-8');
    }
  } catch (error) {
    console.warn('Could not read SYSTEM_PROMPT.md file:', error);
  }

  // Fallback to environment variable
  return process.env.QUIZ_SYSTEM_PROMPT || `
You are a psychological analysis AI that provides personality insights based on quiz responses for the Lunatic Profiling system.

You MUST respond with valid JSON only. Analyze the provided archetype data and return a JSON object with the following exact structure:

{
  "summary": "A comprehensive 2-3 paragraph psychological profile that weaves together the user's top Lunatic archetypes into a cohesive narrative about their unique form of creative madness and unconventional wisdom",
  "insights": ["List of 3-5 key behavioral insights about how they express their lunacy"],
  "recommendations": ["List of 3-5 practical recommendations for embracing and channeling their creative chaos"],
  "primary_archetype": "Name of the dominant Lunatic archetype",
  "secondary_traits": ["List of 2-3 supporting Lunatic characteristics"]
}

IMPORTANT: Do NOT include any other fields or structures. The summary field must be a string, not an object. Do not create nested objects or additional fields beyond those specified above.

Focus on celebrating unconventional thinking, creative madness, and the beautiful chaos of the human mind. Use playful yet insightful language that honors their unique brand of lunacy. The tone should be mystical, fun, and empowering - like a cosmic fortune teller meets a brilliant psychologist.

Remember: You MUST return valid JSON only with exactly the structure above. No other text before or after the JSON object.
`;
}

function createAnalysisPrompt(input: AnalysisInput): string {
  return `
Please analyze this psychological profile and provide comprehensive insights:

TOP ARCHETYPES:
${input.topArchetypes.map(a => `- ${a.name}: ${a.percentage}%`).join('\n')}

TRAIT SCORES:
${Object.entries(input.percentages)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 10)
  .map(([trait, score]) => `- ${trait}: ${score}%`)
  .join('\n')}

OVERLAPS (traits within 5% similarity):
${input.overlaps.length > 0
  ? input.overlaps.map(o => `- ${o.archetypes.join(' vs ')}: ${o.similarity}% similarity`).join('\n')
  : '- No significant overlaps detected'
}

Please provide a thorough analysis following the JSON structure specified in the system prompt.
  `.trim();
}

// function createAnalysisPrompt(input: AnalysisInput): string {
//   return `
//     Analyze this psychological profile and provide insights:

//     Top Archetypes: ${JSON.stringify(input.topArchetypes)}
//     Overlaps: ${JSON.stringify(input.overlaps)}

//     Provide a comprehensive analysis of this person's psychological makeup,
//     including strengths, potential challenges, and behavioral patterns.
//   `;
// }

function generateMockSummary(
  topArchetypes: Array<{ name: string; percentage: number }>
): string {
  const primary = topArchetypes[0];
  const secondary = topArchetypes[1];

  const summaries: Record<string, string> = {
    'Quantum Magician':
      'You are a master of possibility and transformation, weaving reality through consciousness and intention. Your mind operates on multiple dimensions simultaneously, seeing potential where others see limitation.',
    'Cosmic Jester':
      'You embody divine comedy and sacred playfulness, using humor and paradox as pathways to truth. Your jester energy breaks down barriers and reveals the absurdity that makes life meaningful.',
    'Reality Hacker':
      'You are a master of systems and patterns, capable of seeing through illusions to the underlying code of existence. Your analytical prowess serves your revolutionary spirit.',
    'Dream Alchemist':
      'You transform the raw material of imagination into tangible reality, bridging the unconscious and conscious realms. Your visionary nature channels collective dreams into manifestation.',
    'Chaos Pilot':
      'You thrive in the eye of the storm, navigating uncertainty with grace and turning disorder into opportunity. Your adventurous spirit embraces the unknown as fertile ground for growth.',
    'Shadow Sage':
      'You are a guardian of hidden wisdom and uncomfortable truths, helping others integrate their darkness to become whole. Your depth perception reveals what others prefer to ignore.',
    'Sacred Rebel':
      'You challenge systems and structures in service of higher truth and authentic freedom. Your rebellious nature is fueled by love and a vision of what could be.',
    'Flow Shaman':
      'You are a conduit for natural rhythms and healing energies, helping others find their authentic flow state. Your presence brings balance and restoration to chaotic environments.',
  };

  let summary = summaries[primary.name] || 'You have a unique psychological profile that defies simple categorization.';

  if (secondary && secondary.percentage > 60) {
    const secondaryText = summaries[secondary.name];
    if (secondaryText) {
      summary += ` Combined with your ${secondary.name} tendencies, you demonstrate a well-rounded approach to life that balances multiple perspectives.`;
    }
  }

  summary += ` Your strongest trait (${primary.name}) represents ${primary.percentage}% of your profile, indicating a clear pattern in how you process information and interact with the world.`;

  return summary;
}

function generateMockRecommendations(
  topArchetypes: Array<{ name: string; percentage: number }>
): string[] {
  const recommendations: Record<string, string[]> = {
    'Quantum Magician': [
      'Practice energy work and manifestation techniques to channel your natural abilities',
      'Study quantum physics and consciousness research to understand your perspective',
      'Create magical rituals that help you focus your transformative powers',
    ],
    'Cosmic Jester': [
      'Express your humor through creative outlets like comedy, art, or writing',
      'Use playfulness to break tension and bring levity to serious situations',
      'Balance your jester energy with moments of deep contemplation',
    ],
    'Reality Hacker': [
      'Apply your analytical skills to systems that need revolutionary change',
      'Study both technology and metaphysics to expand your hacking toolkit',
      'Share your insights to help others see through illusions',
    ],
    'Dream Alchemist': [
      'Keep a dream journal to capture and work with unconscious material',
      'Practice visualization and creative manifestation techniques',
      'Create art or write to give form to your visions',
    ],
    'Chaos Pilot': [
      'Seek adventures and challenges that push your comfort zone',
      'Practice mindfulness to stay centered during chaotic times',
      'Help others navigate uncertainty with your calm presence',
    ],
    'Shadow Sage': [
      'Explore your own shadow through therapy, journaling, or meditation',
      'Study psychology and spiritual traditions to deepen your wisdom',
      'Create safe spaces for others to explore their hidden aspects',
    ],
    'Sacred Rebel': [
      'Channel your rebellious energy toward meaningful social change',
      'Study the history of successful revolutionaries and movements',
      'Build communities of like-minded change-makers',
    ],
    'Flow Shaman': [
      'Spend time in nature to restore and strengthen your connection',
      'Practice healing modalities like energy work, herbalism, or bodywork',
      'Create rhythmic practices like drumming, dancing, or chanting',
    ],
  };

  const primary = topArchetypes[0];
  return recommendations[primary.name] || [
    'Embrace your unique combination of traits',
    'Seek environments that appreciate your distinctive perspective',
    'Continue developing self-awareness through reflection and feedback',
  ];
}