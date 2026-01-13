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

  // V2 archetype summaries using new codes/names
  const summaries: Record<string, string> = {
    'VN': 'You are a Velvet Nightmare (Bullshit Slayer) - a surgical truth-teller who dismantles nonsense with precision and style. Your intolerance for bullshit is both a superpower and a lifestyle.',
    'CTD': 'You are a Chaos Tea Dealer (Chaos Architect) - a pattern-obsessed planner who finds order in chaos. You see the matrix while others see static.',
    'YO': 'You are a YOLO Ohno (Vibe Commando) - consequences are a problem for future you. Your adventurous spirit embraces chaos as fertile ground for growth.',
    'SO': 'You are a Spreadsheet Overlord (Efficiency Berserker) - emotions have pivot tables, feelings require data validation. Your analytical prowess turns chaos into color-coded clarity.',
    'DL': 'You are a Dalai Lemma (Apology Ninja) - sorry for existing, sorry for apologizing, sorry for that apology. Your diplomatic mastery smooths every rough edge.',
    'MM': 'You are a Manifestor of Mystery (Mystery Curator) - an aesthetic chaos artist who turns confusion into art. Your vibe is immaculate even when nothing makes sense.',
    'TMZ': 'You are a Tea Master of Zen (Zen Bastard) - calm rage, formatted perfectly. You maintain composure with tea-fueled stoicism even as the world burns around you.',
    'CS': 'You are a Chaos Slayer (Problem Annihilator) - a surgical problem destroyer who eliminates issues with terrifying efficiency. Where there was chaos, you leave only solutions.',
    'BN': 'You are a Baffled Normie (Sensible Weapon) - tragically sane in a world that expects madness. Your reasonable perspective is your greatest superpower.',
    // Fallbacks for full names
    'Velvet Nightmare': 'You are a Velvet Nightmare (Bullshit Slayer) - a surgical truth-teller who dismantles nonsense with precision.',
    'Chaos Tea Dealer': 'You are a Chaos Tea Dealer (Chaos Architect) - a pattern-obsessed planner who finds order in chaos.',
    'YOLO Ohno': 'You are a YOLO Ohno (Vibe Commando) - consequences are a problem for future you.',
    'Spreadsheet Overlord': 'You are a Spreadsheet Overlord (Efficiency Berserker) - emotions have pivot tables.',
    'Dalai Lemma': 'You are a Dalai Lemma (Apology Ninja) - sorry for existing, sorry for apologizing.',
    'Manifestor of Mystery': 'You are a Manifestor of Mystery (Mystery Curator) - an aesthetic chaos artist.',
    'Tea Master of Zen': 'You are a Tea Master of Zen (Zen Bastard) - calm rage, formatted perfectly.',
    'Chaos Slayer': 'You are a Chaos Slayer (Problem Annihilator) - a surgical problem destroyer.',
    'Baffled Normie': 'You are a Baffled Normie (Sensible Weapon) - tragically sane.',
  };

  let summary = summaries[primary.name] || 'You have a unique chaos profile that defies simple categorization. The universe is still processing your application.';

  if (secondary && secondary.percentage > 15) {
    const secondaryText = summaries[secondary.name];
    if (secondaryText) {
      summary += ` Your secondary ${secondary.name} tendencies add another layer of beautiful dysfunction to your chaos portfolio.`;
    }
  }

  summary += ` Your strongest archetype represents ${primary.percentage}% of your profile - a clear pattern in how you process chaos and interact with the world.`;

  return summary;
}

function generateMockRecommendations(
  topArchetypes: Array<{ name: string; percentage: number }>
): string[] {
  // V2 archetype recommendations
  const recommendations: Record<string, string[]> = {
    'VN': [
      'Channel your bullshit detection into constructive feedback',
      'Remember: not everyone is ready for the truth. Some need a gentler guillotine.',
      'Your kryptonite is being wrong. Practice saying "I might be mistaken" without imploding.',
    ],
    'CTD': [
      'Embrace the chaos you cannot control - it makes your organized chaos more impressive',
      'Share your pattern-recognition with others (slowly, they process differently)',
      'Your spreadsheets for spreadsheets might need a spreadsheet. That is fine.',
    ],
    'YO': [
      'Future You will deal with consequences. That is their problem.',
      'Your impulsiveness is a feature, not a bug - channel it wisely',
      'Sometimes the best plan is no plan. You already knew this.',
    ],
    'SO': [
      'Not everything needs a pivot table. Some things need feelings. (Just kidding, make the table.)',
      'Teach others your systems - they need structure even if they do not know it',
      'Your efficiency is terrifying. Use this power for good.',
    ],
    'DL': [
      'You can stop apologizing for apologizing now. (Sorry if that was presumptuous.)',
      'Your diplomatic skills are valuable - charge more for emotional labor',
      'Practice setting boundaries without sorry as every other word.',
    ],
    'MM': [
      'Your aesthetic chaos is art. Document it, even when it makes no sense.',
      'Not everything needs meaning - sometimes vibes are enough',
      'Your mystery is a gift. Do not explain yourself to people who do not deserve the lore.',
    ],
    'TMZ': [
      'Your calm rage is an art form. Keep sipping tea while the world burns.',
      'Share your stoicism techniques - others need your composure',
      'It is okay to occasionally let the mask slip. Controlled releases prevent explosions.',
    ],
    'CS': [
      'Not every problem needs slaying. Some need gentle prodding.',
      'Your efficiency is admirable but terrifying. Give people a warning.',
      'Document your victories - future problems will fear your reputation.',
    ],
    'BN': [
      'Your sanity is your superpower in a world of chaos',
      'Keep asking "but why?" - the world needs your reasonable perspective',
      'It is okay to be confused by the chaos. That means you are paying attention.',
    ],
  };

  const primary = topArchetypes[0];
  return recommendations[primary.name] || [
    'Embrace your unique combination of chaos traits',
    'Seek environments that appreciate your distinctive perspective',
    'Continue developing self-awareness through reflection (or spreadsheets, whatever works)',
  ];
}