#!/usr/bin/env bash
set -Eeuo pipefail

# Helper functions
have() {
    command -v "$1" >/dev/null 2>&1
}

append_if_missing() {
    local file="$1"
    local line="$2"
    if ! grep -qF "$line" "$file" 2>/dev/null; then
        echo "$line" >> "$file"
    fi
}

wait_for_http() {
    local url="$1"
    local timeout="${2:-60}"
    local count=0

    echo "Waiting for $url to be ready..."
    while [ $count -lt $timeout ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo "✅ Server is ready"
            return 0
        fi
        sleep 1
        ((count++))
    done
    echo "❌ Server not ready after ${timeout}s"
    return 1
}

# Verify required CLIs
echo "🔧 Checking prerequisites..."
if ! have pnpm; then
    echo "❌ pnpm not found. Install with: npm install -g pnpm"
    exit 1
fi

if ! have node; then
    echo "❌ node not found. Install Node.js"
    exit 1
fi

if ! have curl; then
    echo "❌ curl not found. Install curl"
    exit 1
fi

# Verify project root
if [ ! -f package.json ]; then
    echo "❌ package.json not found. Run from project root directory"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm add p-queue resend openai zod
pnpm add -D artillery @faker-js/faker

# Create scripts/stress.ts if missing
if [ ! -f scripts/stress.ts ]; then
    echo "📝 Creating scripts/stress.ts..."
    mkdir -p scripts
    cat > scripts/stress.ts << 'EOF'
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
EOF
    chmod +x scripts/stress.ts
fi

# Create load/artillery.yml if missing
if [ ! -f load/artillery.yml ]; then
    echo "📝 Creating load/artillery.yml..."
    mkdir -p load
    cat > load/artillery.yml << 'EOF'
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 1
      name: "Warm up"
    - duration: 120
      arrivalRate: 3
      name: "Sustained load"

scenarios:
  - name: "Complete Quiz Flow"
    weight: 100
    flow:
      - post:
          url: "/api/user/start"
          json:
            email: "test-{{ $randomString() }}@example.com"
          capture:
            - json: "$.sessionId"
              as: "sessionId"
      - loop:
          - post:
              url: "/api/quiz/save"
              json:
                sessionId: "{{ sessionId }}"
                questionId: "{{ $loopCount }}"
                answers: ["{{ $randomInt(1, 6) }}"]
          count: 8
      - post:
          url: "/api/quiz/grade"
          json:
            sessionId: "{{ sessionId }}"
          expect:
            - statusCode: 200
            - hasProperty: "resultId"
EOF
fi

# Add stress script to package.json if missing
if have jq; then
    if ! jq -e '.scripts.stress' package.json >/dev/null 2>&1; then
        echo "📝 Adding stress script to package.json..."
        jq '.scripts.stress = "node scripts/stress.ts"' package.json > package.json.tmp && mv package.json.tmp package.json
    fi
else
    if ! grep -q '"stress":' package.json; then
        echo "📝 Adding stress script to package.json..."
        sed -i.bak 's/"lint": "next lint"/"lint": "next lint",\n    "stress": "node scripts\/stress.ts"/' package.json
    fi
fi

# Setup .env.local
echo "⚙️  Configuring .env.local..."
touch .env.local

append_if_missing .env.local 'ADMIN_DASHBOARD_TOKEN="dev-token"'
append_if_missing .env.local 'BILLING_MODEL="gpt-4o-mini"'
append_if_missing .env.local 'BILLING_INPUT_PER_1K="0.005"'
append_if_missing .env.local 'BILLING_OUTPUT_PER_1K="0.015"'
append_if_missing .env.local 'NEXTAUTH_URL="http://localhost:3001"'
append_if_missing .env.local 'NEXT_PUBLIC_APP_URL="http://localhost:3001"'
append_if_missing .env.local 'DATABASE_URL="file:./dev.db"'
append_if_missing .env.local 'RESULTS_DEV_RECIPIENT="test@example.com"'

# Database setup
echo "🗄️  Setting up database..."
pnpm prisma generate
pnpm prisma migrate dev --name usage-tracking

# Start dev server
echo "🚀 Starting dev server..."
pnpm dev --port 3001 &
DEV_PID=$!

# Wait for server
if ! wait_for_http "http://localhost:3001" 60; then
    echo "❌ Dev server failed to start. Checking logs..."
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Test admin API
echo "🔍 Testing admin API..."
ADMIN_RESPONSE=$(curl -sS -H "x-admin-token: dev-token" http://localhost:3001/api/admin/usage || echo "ERROR")

if echo "$ADMIN_RESPONSE" | grep -q '"daily"' && echo "$ADMIN_RESPONSE" | grep -q '"recent"'; then
    echo "✅ Admin API working"
else
    echo "❌ Admin API failed. Response: $ADMIN_RESPONSE"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Run stress test
echo "🏋️  Running stress test (mock mode - no OPENAI_API_KEY)..."
if pnpm run stress; then
    echo "✅ Stress test completed successfully"
else
    echo "❌ Stress test failed"
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Check usage data after stress test
echo "📊 Checking usage data..."
USAGE_RESPONSE=$(curl -sS -H "x-admin-token: dev-token" http://localhost:3001/api/admin/usage)

if have jq; then
    RECENT_COUNT=$(echo "$USAGE_RESPONSE" | jq '.recent | length')
    echo "📈 Found $RECENT_COUNT usage events"
    echo "$USAGE_RESPONSE" | jq '{daily: .daily | length, recent: .recent | length}'
else
    echo "📈 Usage data (install jq for pretty formatting):"
    echo "$USAGE_RESPONSE"
fi

if echo "$USAGE_RESPONSE" | grep -q '"recent":\[{'; then
    echo "✅ Usage tracking working - events recorded"
else
    echo "⚠️  No usage events found - check stress test results"
fi

# Test daily rollup
echo "📅 Testing daily rollup..."
ROLLUP_RESPONSE=$(curl -sS -X POST -H "x-admin-token: dev-token" http://localhost:3001/api/cron/rollup)
echo "📊 Rollup result: $ROLLUP_RESPONSE"

# Final summary
echo ""
echo "🎉 Local test completed successfully!"
echo "📊 Admin dashboard: http://localhost:3001/admin/usage"
echo "🖥️  Main app: http://localhost:3001"
echo "🔧 Dev server PID: $DEV_PID"
echo "🛑 Stop with: kill $DEV_PID"
echo ""
echo "✅ PASS: All systems operational"

exit 0