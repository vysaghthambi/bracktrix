/*
  Warnings:

  - You are about to drop the column `knockoutRound` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `knockoutFormat` on the `Tournament` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "KnockoutLevel" AS ENUM ('PRE_QUARTER_FINAL', 'QUARTER_FINAL', 'SEMI_FINAL', 'FINAL');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "knockoutRound",
ADD COLUMN     "knockoutLevel" "KnockoutLevel";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "knockoutFormat",
ADD COLUMN     "knockoutLevel" "KnockoutLevel";

-- DropEnum
DROP TYPE "KnockoutFormat";
