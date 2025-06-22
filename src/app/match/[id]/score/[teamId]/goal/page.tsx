import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentTime } from "@/utils/getMatchStatus";
import { GoalScoreSchemaType } from "@/schema/matchEvent";
import GoalScoreForm from "@/components/GoalScoreForm/GoalScoreForm";

export default async function GoalPage({
  params,
}: Readonly<{ params: Promise<{ id: string; teamId: string }> }>) {
  const { id: matchId, teamId } = await params;

  const [match, matchLineup, goalTypes] = await Promise.all([
    prisma.match.findUnique({
      where: { id: matchId },
    }),
    prisma.matchLineup.findMany({
      where: {
        matchId,
      },
    }),
    prisma.goalType.findMany(),
  ]);

  if (!match) {
    notFound();
  }

  const scoredTeamLineup = matchLineup.filter(
    (lineup) => lineup.teamId === teamId
  );
  const concededTeamLineup = matchLineup.filter(
    (lineup) => lineup.teamId !== teamId
  );

  const currentTime = getCurrentTime(match);

  const defaultValues: GoalScoreSchemaType = {
    isOwnGoal: false,
    minute: currentTime,
    player: null!,
    assistPlayer: null!,
    goalType: null!,
  };

  const isHomeTeam = teamId === match.homeTeamId;

  const handleSubmit = async (
    data: GoalScoreSchemaType,
    matchId: string,
    tournamentId: string,
    isHomeTeam: boolean
  ) => {
    "use server";

    try {
      await prisma
        .$transaction([
          prisma.matchEvent.create({
            data: {
              matchId,
              teamId: data.player.teamId,
              tournamentId,
              eventType: data.isOwnGoal ? "OWN_GOAL" : "GOAL",
              minute: data.minute,
              playerId: data.player.playerId,
              assistPlayerId: data.assistPlayer?.id,
              goalTypeCode: data.goalType?.code,
            },
          }),
          prisma.match.update({
            where: {
              id: matchId,
            },
            data: {
              ...(isHomeTeam
                ? { homeTeamScore: { increment: 1 } }
                : { awayTeamScore: { increment: 1 } }),
            },
          }),
        ])
        .then(() => {
          redirect(`/match/${matchId}/score`);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <GoalScoreForm
      defaultValues={defaultValues}
      scoredTeamLineup={scoredTeamLineup}
      concededTeamLineup={concededTeamLineup}
      goalTypes={goalTypes}
      matchId={matchId}
      tournamentId={match.tournamentId}
      isHomeTeam={isHomeTeam}
      onSubmit={handleSubmit}
    />
  );
}
