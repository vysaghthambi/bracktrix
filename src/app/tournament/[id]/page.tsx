import { redirect } from "next/navigation";

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

  if (tournament.type === "GROUP_KNOCKOUT") {
    redirect(`/tournament/${tournament.id}/groups`);
  } else if (tournament.type === "KNOCKOUT") {
    redirect(`/tournament/${tournament.id}/knockout`);
  } else if (tournament.type === "LEAGUE") {
    redirect(`/tournament/${tournament.id}/league`);
  }

  return null;
}
