import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";

export default async function TournamentPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) {
    return <div>Tournament not found</div>;
  }

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>{tournament.description}</p>
      <p>{tournament.location}</p>
      <p>{tournament.locationUrl}</p>
      <p>Players Count: {tournament.noOfPlayers}</p>
      <p>Substitutes Count: {tournament.noOfSubstitutes}</p>
      <p>Duration: {tournament.matchDuration} min</p>
      <p>Start Date: {dayjs(tournament.startDate).format("DD-MM-YYYY")}</p>
      <p>End Date: {dayjs(tournament.endDate).format("DD-MM-YYYY")}</p>
    </div>
  );
}
