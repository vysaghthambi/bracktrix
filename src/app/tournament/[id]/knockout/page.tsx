import { prisma } from "@/lib/prisma";

export default async function KnockoutPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;
  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournamentId,
      type: "KNOCKOUT",
    },
    include: {
      homeTeam: {
        select: {
          name: true,
          image: true,
        },
      },
      awayTeam: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      orderNumber: "asc",
    },
  });

  return (
    <div>
      <h2>Knockout Stage</h2>
      <div>
        {matches.map((match) => (
          <div key={match.id}>
            <div>
              <div>{match.homeTeam.name}</div>
              <div>vs</div>
              <div>{match.awayTeam.name}</div>
            </div>
            <div>
              <div>{match.homeTeamScore}</div>
              <div>{match.awayTeamScore}</div>
            </div>
            {match.wentToPenalty && (
              <div className="mt-2 text-sm text-gray-500">
                Penalties: {match.homeTeamPenaltyScore} -{" "}
                {match.awayTeamPenaltyScore}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
