import { prisma } from '@/lib/db';

interface UsageData {
  model: string;
  provider: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
}

// OpenAI pricing per 1K tokens (as of 2024)
const OPENAI_PRICING = {
  'gpt-4': {
    input: 0.03,  // $0.03 per 1K input tokens
    output: 0.06, // $0.06 per 1K output tokens
  },
  'gpt-4-turbo': {
    input: 0.01,
    output: 0.03,
  },
  'gpt-4o-mini': {
    input: 0.00015, // $0.15 per 1M input tokens
    output: 0.0006, // $0.60 per 1M output tokens
  },
  'gpt-3.5-turbo': {
    input: 0.001,
    output: 0.002,
  },
};

export async function trackUsage(data: UsageData): Promise<void> {
  try {
    await prisma.usageEvent.create({
      data: {
        model: data.model,
        provider: data.provider,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens,
        totalTokens: data.totalTokens,
        inputCostUsd: data.inputCostUsd,
        outputCostUsd: data.outputCostUsd,
        totalCostUsd: data.totalCostUsd,
      },
    });
  } catch (error) {
    console.error('Failed to track usage:', error);
    // Don't throw error to avoid breaking the main flow
  }
}

export function calculateOpenAICost(model: string, promptTokens: number, completionTokens: number) {
  const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING] || OPENAI_PRICING['gpt-4'];

  const inputCostUsd = (promptTokens / 1000) * pricing.input;
  const outputCostUsd = (completionTokens / 1000) * pricing.output;
  const totalCostUsd = inputCostUsd + outputCostUsd;

  return {
    inputCostUsd,
    outputCostUsd,
    totalCostUsd,
  };
}