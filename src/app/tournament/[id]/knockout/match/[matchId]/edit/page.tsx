import dayjs from "dayjs";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { knockoutLevels, MatchSchemaType } from "@/schema/match";
import ScheduleMatchForm from "@/components/ScheduleMatchForm/ScheduleMatchForm";

export default async function EditMatchPage({
  params,
}: Readonly<{ params: Promise<{ id: string; matchId: string }> }>) {
  const { id: tournamentId, matchId } = await params;

  const [match, tournamentTeams] = await Promise.all([
    prisma.match.findUnique({
      where: {
        id: matchId,
      },
      include: {
        homeTeam: {
          select: {
            id: true,
            name: true,
          },
        },
        awayTeam: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
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
  ]);

  if (!match) {
    notFound();
  }

  const teams = tournamentTeams.map((tournamentTeam) => ({
    id: tournamentTeam.team.id,
    name: tournamentTeam.team.name,
  }));

  const defaultValues: MatchSchemaType = {
    isGroupMatch: false,
    matchNumber: match.matchNumber ?? 0,
    title: match.title ?? "",
    group: null!,
    homeTeam: match.homeTeam ?? null,
    awayTeam: match.awayTeam ?? null,
    startTime: dayjs(match.startTime).toISOString(),
    duration: match.duration ?? 0,
    knockoutLevel:
      knockoutLevels.find((level) => level.id === match.knockoutLevel) ?? null!,
  };

  return (
    <div>
      <ScheduleMatchForm
        defaultValues={defaultValues}
        teams={teams}
        tournamentId={tournamentId}
        matchId={matchId}
      />
    </div>
  );
}
