import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import GoalScoreForm, {
  SubmitContext,
} from "@/components/GoalScoreForm/GoalScoreForm";
import { GoalScoreSchemaType } from "@/schema/matchEvent";

export default async function GoalEventPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; teamId: string; eventId: string }>;
}>) {
  const { id: matchId, teamId, eventId } = await params;

  const [matchEvent, matchLineups, goalTypes] = await Promise.all([
    prisma.matchEvent.findUnique({
      where: {
        id: eventId,
      },
      include: {
        goalType: true,
      },
    }),
    prisma.matchLineup.findMany({
      where: {
        matchId,
      },
      include: {
        player: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.goalType.findMany(),
  ]);

  if (!matchEvent) {
    notFound();
  }

  const scoredTeamLineup = matchLineups.filter(
    (lineup) => lineup.teamId === teamId
  );
  const concededTeamLineup = matchLineups.filter(
    (lineup) => lineup.teamId !== teamId
  );

  const defaultValues: GoalScoreSchemaType = {
    minute: matchEvent.minute,
    player:
      matchLineups.find((lineup) => lineup.playerId === matchEvent.playerId) ??
      null!,
    goalType: matchEvent.goalType,
    isOwnGoal: matchEvent.eventType === "OWN_GOAL",
    assistPlayer: matchEvent.assistPlayerId
      ? matchLineups.find(
          (lineup) => lineup.playerId === matchEvent.assistPlayerId
        ) ?? null!
      : null!,
  };

  const handleSubmit = async (
    data: GoalScoreSchemaType,
    context: SubmitContext
  ) => {
    "use server";

    if (!context.eventId) {
      throw new Error("Event ID is required");
    }

    await prisma.matchEvent
      .update({
        where: { id: context.eventId },
        data: {
          minute: data.minute,
          playerId: data.player.playerId,
          assistPlayerId: data.assistPlayer?.id,
          goalTypeCode: data.goalType?.code,
          eventType: data.isOwnGoal ? "OWN_GOAL" : "GOAL",
        },
      })
      .then(() => {
        redirect(`/match/${context.matchId}/score`);
      });
  };

  return (
    <div>
      <GoalScoreForm
        defaultValues={defaultValues}
        scoredTeamLineup={scoredTeamLineup}
        concededTeamLineup={concededTeamLineup}
        goalTypes={goalTypes}
        matchId={matchId}
        eventId={eventId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
