-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "inputCostUsd" REAL NOT NULL,
    "outputCostUsd" REAL NOT NULL,
    "totalCostUsd" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "DailyCost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day" DATETIME NOT NULL,
    "model" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "calls" INTEGER NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "inputCostUsd" REAL NOT NULL,
    "outputCostUsd" REAL NOT NULL,
    "totalCostUsd" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");

-- CreateIndex
CREATE INDEX "UsageEvent_model_provider_idx" ON "UsageEvent"("model", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCost_day_key" ON "DailyCost"("day");

-- CreateIndex
CREATE INDEX "DailyCost_day_idx" ON "DailyCost"("day");

-- CreateIndex
CREATE INDEX "DailyCost_model_provider_idx" ON "DailyCost"("model", "provider");
