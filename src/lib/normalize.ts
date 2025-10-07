export function normalizeScores(
  rawScores: Record<string, number>
): Record<string, number> {
  const scores = { ...rawScores };
  const values = Object.values(scores);

  if (values.length === 0) {
    return scores;
  }

  const minScore = Math.min(...values);
  const maxScore = Math.max(...values);
  const range = maxScore - minScore;

  if (range === 0) {
    Object.keys(scores).forEach(key => {
      scores[key] = 50;
    });
    return scores;
  }

  Object.keys(scores).forEach(key => {
    scores[key] = Math.round(((scores[key] - minScore) / range) * 100);
  });

  const normalizedValues = Object.values(scores);
  const sum = normalizedValues.reduce((acc, val) => acc + val, 0);
  const average = sum / normalizedValues.length;

  Object.keys(scores).forEach(key => {
    scores[key] = Math.max(0, Math.min(100, scores[key] + (50 - average)));
  });

  return scores;
}

export function calculateWeightedScore(
  answers: string[],
  weights: Record<string, number>
): number {
  return answers.reduce((total, answerId, index) => {
    const weight = weights[answerId] || 0;
    const rankMultiplier = index === 0 ? 1.0 : index === 1 ? 0.7 : 0.4;
    return total + (weight * rankMultiplier);
  }, 0);
}

export function findPercentile(
  score: number,
  allScores: number[]
): number {
  const sortedScores = [...allScores].sort((a, b) => a - b);
  const rank = sortedScores.findIndex(s => s >= score);
  return Math.round((rank / sortedScores.length) * 100);
}