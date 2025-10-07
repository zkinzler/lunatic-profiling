#!/usr/bin/env node

interface Config {
  baseUrl: string;
  totalUsers: number;
  concurrentUsers: number;
}

const config: Config = {
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  totalUsers: parseInt(process.env.STRESS_TOTAL || '20'),
  concurrentUsers: parseInt(process.env.STRESS_CONCURRENT || '5'),
};

interface TestResult {
  success: boolean;
  duration: number;
  error?: string;
  hasValidJson?: boolean;
}

async function runSingleUser(): Promise<TestResult> {
  const startTime = Date.now();

  try {
    // 1. Start session
    const email = `test-${Math.random().toString(36).substr(2, 9)}@example.com`;
    const startResponse = await fetch(`${config.baseUrl}/api/user/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!startResponse.ok) {
      throw new Error(`Start failed: ${startResponse.status}`);
    }

    const { sessionId } = await startResponse.json();

    // 2. Answer 8 questions with randomized ranked answers
    for (let questionId = 1; questionId <= 8; questionId++) {
      const numAnswers = Math.floor(Math.random() * 3) + 1; // 1-3 answers
      const answers = [];
      for (let i = 0; i < numAnswers; i++) {
        const answerLetter = String.fromCharCode(97 + Math.floor(Math.random() * 6)); // a-f
        answers.push(answerLetter);
      }

      const saveResponse = await fetch(`${config.baseUrl}/api/quiz/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: questionId.toString(),
          answers,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error(`Save Q${questionId} failed: ${saveResponse.status}`);
      }
    }

    // 3. Grade quiz
    const gradeResponse = await fetch(`${config.baseUrl}/api/quiz/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    if (!gradeResponse.ok) {
      throw new Error(`Grade failed: ${gradeResponse.status}`);
    }

    const gradeResult = await gradeResponse.json();

    // Validate result JSON structure
    const hasValidJson = !!(
      gradeResult.resultId &&
      gradeResult.topArchetypes &&
      Array.isArray(gradeResult.topArchetypes) &&
      gradeResult.topArchetypes.length >= 1 &&
      gradeResult.percentages &&
      Object.keys(gradeResult.percentages).length === 8 &&
      gradeResult.asciiChart &&
      gradeResult.asciiChart.trim().length > 0
    );

    const duration = Date.now() - startTime;
    return {
      success: true,
      duration,
      hasValidJson,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function runConcurrentBatch(batchSize: number): Promise<TestResult[]> {
  const promises = Array(batchSize).fill(null).map(() => runSingleUser());
  return Promise.all(promises);
}

async function main() {
  console.log('🚀 Starting Lunatic Profiling Stress Test');
  console.log(`📊 Config: ${config.totalUsers} users, ${config.concurrentUsers} concurrent`);
  console.log(`🌐 Target: ${config.baseUrl}`);
  console.log('\n' + '='.repeat(60) + '\n');

  const startTime = Date.now();
  const results: TestResult[] = [];

  // Run in batches
  for (let i = 0; i < config.totalUsers; i += config.concurrentUsers) {
    const batchSize = Math.min(config.concurrentUsers, config.totalUsers - i);
    const batchNum = Math.floor(i / config.concurrentUsers) + 1;
    const totalBatches = Math.ceil(config.totalUsers / config.concurrentUsers);

    console.log(`📦 Batch ${batchNum}/${totalBatches}: Running ${batchSize} users...`);

    const batchResults = await runConcurrentBatch(batchSize);
    results.push(...batchResults);

    const batchSuccess = batchResults.filter(r => r.success).length;
    console.log(`✅ Batch ${batchNum} complete: ${batchSuccess}/${batchSize} success`);
  }

  const totalTime = Date.now() - startTime;
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  const validJson = results.filter(r => r.hasValidJson).length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  const successRate = (successful / results.length) * 100;
  const validJsonRate = (validJson / results.length) * 100;

  console.log('\n' + '='.repeat(60));
  console.log('📈 STRESS TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`Total Users:     ${results.length}`);
  console.log(`Successful:      ${successful} (${successRate.toFixed(1)}%)`);
  console.log(`Failed:          ${failed}`);
  console.log(`Valid JSON:      ${validJson} (${validJsonRate.toFixed(1)}%)`);
  console.log(`Total Time:      ${(totalTime / 1000).toFixed(1)}s`);
  console.log(`Avg Duration:    ${avgDuration.toFixed(0)}ms per user`);
  console.log(`Throughput:      ${(results.length / (totalTime / 1000)).toFixed(2)} users/sec`);

  process.exit(failed > results.length * 0.1 ? 1 : 0);
}

if (require.main === module) {
  main().catch(console.error);
}
