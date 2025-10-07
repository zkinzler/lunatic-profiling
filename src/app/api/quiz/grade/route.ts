import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeLunacyProfile } from '@/lib/llm';
import { normalizeScores } from '@/lib/normalize';
import { ResultSchema } from '@/schemas/result';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { result: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Quiz session not found' },
        { status: 404 }
      );
    }

    if (session.result) {
      return NextResponse.json({ success: true, resultId: session.result.id });
    }

    if (!session.answers) {
      return NextResponse.json(
        { error: 'No answers found for this session' },
        { status: 400 }
      );
    }

    console.log('Session answers:', JSON.stringify(session.answers, null, 2));
    const rawScores = calculateRawScores(session.answers as Record<string, string[]>);
    const normalizedScores = normalizeScores(rawScores);
    const percentages = calculatePercentages(normalizedScores);
    const topArchetypes = getTopArchetypes(percentages);
    const overlaps = findOverlaps(topArchetypes);

    const asciiChart = generateAsciiChart(topArchetypes);

    const analysisResult = await analyzeLunacyProfile({
      scores: normalizedScores,
      percentages,
      topArchetypes,
      overlaps,
    });

    // Create the result object and validate with zod
    const resultData = {
      scores: normalizedScores,
      percentages,
      topArchetypes,
      overlaps,
      asciiChart,
      summary: analysisResult.summary,
      rawModelJson: analysisResult.raw,
    };

    // Validate the result against the schema
    const validatedResult = ResultSchema.parse(resultData);

    // Check if percentages need renormalization (should sum to ~100)
    const totalPercentage = validatedResult.topArchetypes.reduce((sum, arch) => sum + arch.percentage, 0);

    if (totalPercentage < 95 || totalPercentage > 105) {
      // Renormalize while preserving ratios
      const scaleFactor = 100 / totalPercentage;
      validatedResult.topArchetypes = validatedResult.topArchetypes.map(arch => ({
        ...arch,
        percentage: Math.round(arch.percentage * scaleFactor)
      }));

      // Also update the percentages object
      Object.keys(validatedResult.percentages).forEach(key => {
        if (validatedResult.topArchetypes.find(arch => arch.name === key)) {
          const archetype = validatedResult.topArchetypes.find(arch => arch.name === key);
          if (archetype) {
            validatedResult.percentages[key] = archetype.percentage;
          }
        }
      });
    }

    const result = await prisma.result.create({
      data: {
        sessionId,
        scores: validatedResult.scores,
        percentages: validatedResult.percentages,
        topArchetypes: validatedResult.topArchetypes,
        overlaps: validatedResult.overlaps,
        asciiChart: validatedResult.asciiChart,
        summary: validatedResult.summary,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawModelJson: validatedResult.rawModelJson as any,
      },
    });

    // Update session status to completed
    await prisma.quizSession.update({
      where: { id: sessionId },
      data: { completed: true },
    });

    return NextResponse.json({ success: true, resultId: result.id });
  } catch (error) {
    console.error('Error grading quiz:', error);
    return NextResponse.json(
      { error: 'Failed to grade quiz' },
      { status: 500 }
    );
  }
}

function calculateRawScores(answers: Record<string, string[]>): Record<string, number> {
  const scores: Record<string, number> = {};

  const weightMap = {
    1: {
      'a': { 'Cosmic Jester': 3, 'Flow Shaman': 2 },
      'b': { 'Quantum Magician': 2, 'Dream Alchemist': 2 },
      'c': { 'Reality Hacker': 3, 'Shadow Sage': 2 },
      'd': { 'Sacred Rebel': 3, 'Flow Shaman': 1 },
      'e': { 'Shadow Sage': 2, 'Quantum Magician': 2 },
      'f': { 'Cosmic Jester': 2, 'Chaos Pilot': 3 }
    },
    2: {
      'a': { 'Reality Hacker': 3, 'Shadow Sage': 2 },
      'b': { 'Dream Alchemist': 3, 'Quantum Magician': 2 },
      'c': { 'Flow Shaman': 2, 'Sacred Rebel': 2 },
      'd': { 'Sacred Rebel': 3, 'Flow Shaman': 2 },
      'e': { 'Chaos Pilot': 3, 'Cosmic Jester': 2 },
      'f': { 'Shadow Sage': 2, 'Reality Hacker': 2 }
    },
    3: {
      'a': { 'Chaos Pilot': 2, 'Cosmic Jester': 2 },
      'b': { 'Shadow Sage': 3, 'Dream Alchemist': 2 },
      'c': { 'Flow Shaman': 3, 'Sacred Rebel': 2 },
      'd': { 'Dream Alchemist': 2, 'Quantum Magician': 2 },
      'e': { 'Cosmic Jester': 3, 'Chaos Pilot': 2 },
      'f': { 'Sacred Rebel': 3, 'Flow Shaman': 2 }
    },
    4: {
      'a': { 'Sacred Rebel': 3, 'Flow Shaman': 2 },
      'b': { 'Dream Alchemist': 3, 'Quantum Magician': 2 },
      'c': { 'Reality Hacker': 3, 'Shadow Sage': 2 },
      'd': { 'Flow Shaman': 3, 'Sacred Rebel': 2 },
      'e': { 'Quantum Magician': 2, 'Reality Hacker': 2 },
      'f': { 'Shadow Sage': 3, 'Reality Hacker': 2 }
    },
    5: {
      'a': { 'Reality Hacker': 3, 'Shadow Sage': 2 },
      'b': { 'Chaos Pilot': 2, 'Cosmic Jester': 3 },
      'c': { 'Flow Shaman': 2, 'Sacred Rebel': 2 },
      'd': { 'Shadow Sage': 3, 'Dream Alchemist': 2 },
      'e': { 'Dream Alchemist': 2, 'Quantum Magician': 3 },
      'f': { 'Sacred Rebel': 3, 'Flow Shaman': 2 }
    },
    6: {
      'a': { 'Reality Hacker': 3, 'Quantum Magician': 2 },
      'b': { 'Flow Shaman': 3, 'Sacred Rebel': 2 },
      'c': { 'Shadow Sage': 2, 'Dream Alchemist': 2 },
      'd': { 'Chaos Pilot': 3, 'Cosmic Jester': 2 },
      'e': { 'Reality Hacker': 3, 'Quantum Magician': 2 },
      'f': { 'Flow Shaman': 3, 'Sacred Rebel': 2 }
    },
    7: {
      'a': { 'Shadow Sage': 2, 'Dream Alchemist': 3 },
      'b': { 'Cosmic Jester': 3, 'Chaos Pilot': 2 },
      'c': { 'Chaos Pilot': 2, 'Flow Shaman': 2 },
      'd': { 'Reality Hacker': 2, 'Quantum Magician': 3 },
      'e': { 'Sacred Rebel': 2, 'Flow Shaman': 2 },
      'f': { 'Dream Alchemist': 2, 'Shadow Sage': 2 }
    },
    8: {
      'a': { 'Cosmic Jester': 2, 'Chaos Pilot': 3 },
      'b': { 'Quantum Magician': 3, 'Reality Hacker': 2 },
      'c': { 'Sacred Rebel': 3, 'Flow Shaman': 2 },
      'd': { 'Dream Alchemist': 3, 'Shadow Sage': 2 },
      'e': { 'Reality Hacker': 3, 'Quantum Magician': 2 },
      'f': { 'Chaos Pilot': 3, 'Cosmic Jester': 2 }
    }
  };

  Object.entries(answers).forEach(([questionId, selectedAnswers]) => {
    const qId = parseInt(questionId);

    // Ensure selectedAnswers is an array
    let answersArray: string[];
    if (Array.isArray(selectedAnswers)) {
      answersArray = selectedAnswers;
    } else {
      answersArray = [selectedAnswers as string];
    }

    answersArray.forEach((answerId, rank) => {
      const weights = weightMap[qId as keyof typeof weightMap]?.[answerId as keyof typeof weightMap[1]];
      if (weights) {
        const rankMultiplier = rank === 0 ? 1.0 : rank === 1 ? 0.7 : 0.4;
        Object.entries(weights).forEach(([trait, weight]) => {
          scores[trait] = (scores[trait] || 0) + (weight * rankMultiplier);
        });
      }
    });
  });

  return scores;
}

function calculatePercentages(normalizedScores: Record<string, number>) {
  const maxScore = Math.max(...Object.values(normalizedScores));
  const percentages: Record<string, number> = {};

  Object.entries(normalizedScores).forEach(([trait, score]) => {
    percentages[trait] = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  });

  return percentages;
}

function getTopArchetypes(percentages: Record<string, number>) {
  const sorted = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, percentage]) => ({ name, percentage }));

  return sorted;
}

function findOverlaps(topArchetypes: Array<{ name: string; percentage: number }>) {
  const overlaps: Array<{ archetypes: string[]; similarity: number }> = [];

  for (let i = 0; i < topArchetypes.length - 1; i++) {
    for (let j = i + 1; j < topArchetypes.length; j++) {
      const diff = Math.abs(topArchetypes[i].percentage - topArchetypes[j].percentage);
      if (diff <= 5) {
        overlaps.push({
          archetypes: [topArchetypes[i].name, topArchetypes[j].name],
          similarity: 100 - diff
        });
      }
    }
  }

  return overlaps;
}

function generateAsciiChart(topArchetypes: Array<{ name: string; percentage: number }>) {
  let chart = "Your Lunacy Map:\n\n";

  topArchetypes.forEach((archetype) => {
    const barLength = Math.floor(archetype.percentage / 2);
    const bar = "█".repeat(barLength) + "░".repeat(50 - barLength);
    chart += `${archetype.name.padEnd(15)} │${bar}│ ${archetype.percentage}%\n`;
  });

  chart += "\n" + "═".repeat(70);

  return chart;
}