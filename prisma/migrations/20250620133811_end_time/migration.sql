/*
  Warnings:

  - You are about to drop the column `extraTimeEndAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `extraTimeStartAt` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "extraTimeEndAt",
DROP COLUMN "extraTimeStartAt",
ADD COLUMN     "extraFirstHalfEndAt" TIMESTAMP(3),
ADD COLUMN     "extraFirstHalfStartAt" TIMESTAMP(3),
ADD COLUMN     "extraSecondHalfEndAt" TIMESTAMP(3),
ADD COLUMN     "extraSecondHalfStartAt" TIMESTAMP(3);
