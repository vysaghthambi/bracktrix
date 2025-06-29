import dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import ScheduleMatchForm from "@/components/ScheduleMatchForm/ScheduleMatchForm";
import { MatchSchemaType } from "@/schema/match";

export default async function ScheduleMatchPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  const [groups, matchCount, tournament] = await Promise.all([
    prisma.group.findMany({
      where: {
        tournamentId: tournamentId,
      },
      include: {
        groupTeams: {
          select: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
    prisma.match.count({
      where: {
        tournamentId: tournamentId,
        stage: "GROUP",
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

  const defaultValues: MatchSchemaType = {
    isGroupMatch: true,
    matchNumber: matchCount + 1,
    title: `Match ${matchCount + 1}`,
    group: null!,
    homeTeam: null!,
    awayTeam: null!,
    startTime: dayjs(tournament?.startDate).toISOString(),
    duration: tournament?.matchDuration ?? 0,
    knockoutLevel: null!,
  };

  return (
    <div>
      Schedule Match
      <ScheduleMatchForm
        defaultValues={defaultValues}
        groups={groups}
        tournamentId={tournamentId}
      />
    </div>
  );
}
