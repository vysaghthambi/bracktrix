import dayjs from "dayjs";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { MatchSchemaType } from "@/schema/match";
import ScheduleMatchForm from "@/components/ScheduleMatchForm/ScheduleMatchForm";

export default async function EditMatchPage({
  params,
}: Readonly<{ params: Promise<{ id: string; matchId: string }> }>) {
  const { id: tournamentId, matchId } = await params;

  const [match, groups] = await Promise.all([
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
  ]);

  if (!match) {
    notFound();
  }

  const group = groups.find((group) => group.id === match.groupId);

  const defaultValues: MatchSchemaType = {
    matchNumber: match.matchNumber ?? 0,
    title: match.title ?? "",
    group: group ?? null!,
    homeTeam: match.homeTeam ?? null,
    awayTeam: match.awayTeam ?? null,
    startTime: dayjs(match.startTime).toISOString(),
    duration: match.duration ?? 0,
  };

  return (
    <div>
      <ScheduleMatchForm
        defaultValues={defaultValues}
        groups={groups}
        tournamentId={tournamentId}
        matchId={matchId}
      />
    </div>
  );
}
