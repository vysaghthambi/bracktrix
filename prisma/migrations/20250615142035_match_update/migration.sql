/*
  Warnings:

  - Made the column `homeTeamPenaltyScore` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `awayTeamPenaltyScore` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "homeTeamScore" SET DEFAULT 0,
ALTER COLUMN "awayTeamScore" SET DEFAULT 0,
ALTER COLUMN "homeTeamPenaltyScore" SET NOT NULL,
ALTER COLUMN "homeTeamPenaltyScore" SET DEFAULT 0,
ALTER COLUMN "awayTeamPenaltyScore" SET NOT NULL,
ALTER COLUMN "awayTeamPenaltyScore" SET DEFAULT 0;
