import Link from "next/link";
import { MatchStage } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type MatchesProps = {
  tournamentId: string;
  stage: MatchStage;
};

export default async function Matches({
  tournamentId,
  stage,
}: Readonly<MatchesProps>) {
  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournamentId,
      stage: stage,
    },
    include: {
      homeTeam: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <div>
      <h2>Matches</h2>
      <div>
        {matches.map((match) => (
          <div key={match.id}>
            <div>
              {match.homeTeam.name} vs {match.awayTeam.name}
            </div>
            <Link
              href={
                stage === "GROUP"
                  ? `/tournament/${tournamentId}/groups/match/${match.id}/edit`
                  : `/tournament/${tournamentId}/knockout/match/${match.id}/edit`
              }
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
