-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_playerOfTheMatchId_fkey";

-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "playerOfTheMatchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerOfTheMatchId_fkey" FOREIGN KEY ("playerOfTheMatchId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
