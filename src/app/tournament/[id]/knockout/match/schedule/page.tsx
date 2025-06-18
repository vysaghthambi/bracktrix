import dayjs from "dayjs";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { MatchSchemaType } from "@/schema/match";
import ScheduleMatchForm from "@/components/ScheduleMatchForm/ScheduleMatchForm";

export default async function KnockoutMatchSchedulePage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id: tournamentId } = await params;

  const [tournamentTeams, matchCount, tournament] = await Promise.all([
    prisma.tournamentTeam.findMany({
      where: {
        tournamentId: tournamentId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.match.count({
      where: {
        tournamentId: tournamentId,
        stage: "KNOCKOUT",
      },
    }),
    prisma.tournament.findUnique({
      where: {
        id: tournamentId,
      },
      select: {
        matchDuration: true,
        startDate: true,
      },
    }),
  ]);

  if (!tournament) {
    notFound();
  }

  const teams = tournamentTeams.map((tournamentTeam) => ({
    id: tournamentTeam.team.id,
    name: tournamentTeam.team.name,
  }));

  const defaultValues: MatchSchemaType = {
    isGroupMatch: false,
    matchNumber: matchCount + 1,
    title: `Match ${matchCount + 1}`,
    homeTeam: null!,
    awayTeam: null!,
    startTime: dayjs(tournament?.startDate).toISOString(),
    duration: tournament?.matchDuration,
    group: null!,
    knockoutLevel: null!,
  };

  return (
    <div>
      <ScheduleMatchForm
        defaultValues={defaultValues}
        tournamentId={tournamentId}
        teams={teams}
      />
    </div>
  );
}
