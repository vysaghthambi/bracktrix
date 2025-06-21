/*
  Warnings:

  - You are about to drop the column `extraTimeStart` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `firstHalfStart` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `secondHalfStart` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "extraTimeStart",
DROP COLUMN "firstHalfStart",
DROP COLUMN "secondHalfStart",
ADD COLUMN     "extraTimeEndAt" TIMESTAMP(3),
ADD COLUMN     "extraTimeStartAt" TIMESTAMP(3),
ADD COLUMN     "firstHalfEndAt" TIMESTAMP(3),
ADD COLUMN     "firstHalfStartAt" TIMESTAMP(3),
ADD COLUMN     "secondHalfEndAt" TIMESTAMP(3),
ADD COLUMN     "secondHalfStartAt" TIMESTAMP(3);
