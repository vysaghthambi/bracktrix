import { MatchEventType } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CardForm from "@/components/CardForm/CardForm";
import { getCurrentTime } from "@/utils/getMatchStatus";
import { CardSchemaType, cardTypes } from "@/schema/matchEvent";

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

  const handleSubmit = async (
    data: CardSchemaType,
    matchId: string,
    teamId: string,
    tournamentId: string
  ) => {
    "use server";

    try {
      await prisma.matchEvent
        .create({
          data: {
            matchId,
            teamId,
            tournamentId,
            eventType: data.cardType.code as MatchEventType,
            minute: data.minute,
            playerId: data.player.playerId,
          },
        })
        .then(() => {
          redirect(`/match/${matchId}/score`);
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
