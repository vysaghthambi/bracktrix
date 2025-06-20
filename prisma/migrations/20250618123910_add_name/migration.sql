/*
  Warnings:

  - Added the required column `name` to the `MatchLineup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchLineup" ADD COLUMN     "name" TEXT NOT NULL;
