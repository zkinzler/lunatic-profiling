/*
  Warnings:

  - You are about to drop the column `overlaps` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `percentages` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `scores` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the column `topArchetypes` on the `Result` table. All the data in the column will be lost.
  - Added the required column `allArchetypePercentages` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `allArchetypeScores` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryArchetypeCode` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryArchetypeName` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryArchetypePercentage` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryArchetypePubLegend` to the `Result` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryArchetypeScore` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "answers" JSONB,
    "currentPhase" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "QuizSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuizSession" ("answers", "completed", "createdAt", "email", "id", "publicId", "updatedAt", "userId") SELECT "answers", "completed", "createdAt", "email", "id", "publicId", "updatedAt", "userId" FROM "QuizSession";
DROP TABLE "QuizSession";
ALTER TABLE "new_QuizSession" RENAME TO "QuizSession";
CREATE UNIQUE INDEX "QuizSession_publicId_key" ON "QuizSession"("publicId");
CREATE INDEX "QuizSession_publicId_idx" ON "QuizSession"("publicId");
CREATE INDEX "QuizSession_email_idx" ON "QuizSession"("email");
CREATE TABLE "new_Result" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "primaryArchetypeCode" TEXT NOT NULL,
    "primaryArchetypeName" TEXT NOT NULL,
    "primaryArchetypePubLegend" TEXT NOT NULL,
    "primaryArchetypeScore" REAL NOT NULL,
    "primaryArchetypePercentage" REAL NOT NULL,
    "secondaryArchetypeCode" TEXT,
    "secondaryArchetypeName" TEXT,
    "secondaryArchetypePubLegend" TEXT,
    "secondaryArchetypeScore" REAL,
    "secondaryArchetypePercentage" REAL,
    "isHybrid" BOOLEAN NOT NULL DEFAULT false,
    "hybridName" TEXT,
    "hybridDescription" TEXT,
    "hybridPercentageDiff" REAL,
    "allArchetypeScores" JSONB NOT NULL,
    "allArchetypePercentages" JSONB NOT NULL,
    "traitBST" REAL NOT NULL DEFAULT 0,
    "traitCPR" REAL NOT NULL DEFAULT 0,
    "traitAE" REAL NOT NULL DEFAULT 0,
    "traitBS" REAL NOT NULL DEFAULT 0,
    "traitBSTPercentage" REAL NOT NULL DEFAULT 0,
    "traitCPRPercentage" REAL NOT NULL DEFAULT 0,
    "traitAEPercentage" REAL NOT NULL DEFAULT 0,
    "traitBSPercentage" REAL NOT NULL DEFAULT 0,
    "themeScores" JSONB,
    "specialization" TEXT,
    "coreDriver" TEXT,
    "superpower" TEXT,
    "kryptonite" TEXT,
    "repressedShadow" TEXT,
    "internalConflict" TEXT,
    "finalForm" TEXT,
    "signatureMove" TEXT,
    "chaosPartner" TEXT,
    "britishnessQuotient" REAL,
    "britishnessInterpretation" TEXT,
    "resistanceClearanceLevel" TEXT,
    "resistanceClearancePoints" INTEGER NOT NULL DEFAULT 0,
    "chaosPattern" TEXT,
    "chaosPatternDescription" TEXT,
    "asciiChart" TEXT,
    "summary" TEXT,
    "shareableStat" TEXT,
    "rawModelJson" JSONB,
    "emailed" BOOLEAN NOT NULL DEFAULT false,
    "emailedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Result_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Result" ("asciiChart", "createdAt", "emailed", "emailedAt", "id", "rawModelJson", "sessionId", "summary", "updatedAt") SELECT "asciiChart", "createdAt", "emailed", "emailedAt", "id", "rawModelJson", "sessionId", "summary", "updatedAt" FROM "Result";
DROP TABLE "Result";
ALTER TABLE "new_Result" RENAME TO "Result";
CREATE UNIQUE INDEX "Result_sessionId_key" ON "Result"("sessionId");
CREATE INDEX "Result_sessionId_idx" ON "Result"("sessionId");
CREATE INDEX "Result_primaryArchetypeCode_idx" ON "Result"("primaryArchetypeCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
