-- AlterTable
ALTER TABLE "MatchEvent" ADD COLUMN     "assistPlayerId" TEXT,
ADD COLUMN     "isOwnGoal" BOOLEAN;

-- AddForeignKey
ALTER TABLE "MatchEvent" ADD CONSTRAINT "MatchEvent_assistPlayerId_fkey" FOREIGN KEY ("assistPlayerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
