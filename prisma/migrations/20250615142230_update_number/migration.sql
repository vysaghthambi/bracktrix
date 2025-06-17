/*
  Warnings:

  - You are about to drop the column `orderNumber` on the `Match` table. All the data in the column will be lost.
  - Added the required column `matchNumber` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "orderNumber",
ADD COLUMN     "matchNumber" INTEGER NOT NULL;
