/*
  Warnings:

  - You are about to drop the column `type` on the `Match` table. All the data in the column will be lost.
  - Added the required column `stage` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchStage" AS ENUM ('GROUP', 'KNOCKOUT');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "type",
ADD COLUMN     "stage" "MatchStage" NOT NULL;

-- DropEnum
DROP TYPE "MatchType";
