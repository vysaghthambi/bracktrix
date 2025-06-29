import { MatchEventType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentTime } from "@/utils/getMatchStatus";
import { CardSchemaType, cardTypes } from "@/schema/matchEvent";
import CardForm, { SubmitContext } from "@/components/CardForm/CardForm";

export default async function CardPage({
  params,
}: Readonly<{ params: Promise<{ id: string; teamId: string }> }>) {
  const { id: matchId, teamId } = await params;

  const [match, matchLineups] = await Promise.all([
    prisma.match.findUnique({
      where: { id: matchId },
    }),
    prisma.matchLineup.findMany({
      where: { matchId, teamId },
    }),
  ]);

  if (!match) {
    notFound();
  }

  const currentTime = getCurrentTime(match);

  const defaultValues: CardSchemaType = {
    minute: currentTime,
    player: null!,
    cardType: cardTypes[0],
  };

  const handleSubmit = async (data: CardSchemaType, context: SubmitContext) => {
    "use server";

    if (!context.matchId || !context.teamId || !context.tournamentId) {
      throw new Error("Match ID, team ID, and tournament ID are required");
    }

    try {
      await prisma.matchEvent
        .create({
          data: {
            matchId: context.matchId,
            teamId: context.teamId,
            tournamentId: context.tournamentId,
            eventType: data.cardType.code as MatchEventType,
            minute: data.minute,
            playerId: data.player.playerId,
          },
        })
        .then(() => {
          redirect(`/match/${context.matchId}/score`);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      CardPage
      <CardForm
        defaultValues={defaultValues}
        players={matchLineups}
        matchId={matchId}
        teamId={teamId}
        tournamentId={match.tournamentId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
