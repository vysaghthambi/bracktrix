import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function TournamentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const tournamentId = (await params).id;
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <div>
      <div>
        <h1>{tournament.name}</h1>
        <p>{tournament.description}</p>
        <p>{tournament.location}</p>
        <p>{tournament.locationUrl}</p>
        <div>
          <div>
            <p>Players Count</p>
            <p>{tournament.playerCount}</p>
          </div>
          <div>
            <p>Substitutes Count</p>
            <p>{tournament.substituteCount}</p>
          </div>
          <div>
            <p>Duration</p>
            <p>{tournament.matchDuration} min</p>
          </div>
          <div>
            <p>Start Date</p>
            <p>{tournament.startDate.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <nav>
        <ul>
          {(tournament.type === "GROUP_KNOCKOUT" ||
            tournament.type === "LEAGUE") && (
              <li>
                <Link href={`/tournament/${tournament.id}/groups`}>
                  {tournament.type === "GROUP_KNOCKOUT" ? "Groups" : "League"}
                </Link>
              </li>
            )}
          {(tournament.type === "GROUP_KNOCKOUT" ||
            tournament.type === "KNOCKOUT") && (
              <li>
                <Link href={`/tournament/${tournament.id}/knockout`}>
                  Knockout
                </Link>
              </li>
            )}
        </ul>
      </nav>

      {children}
    </div>
  );
}
