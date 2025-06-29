import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { cardTypes, CardSchemaType } from "@/schema/matchEvent";
import CardForm, { SubmitContext } from "@/components/CardForm/CardForm";

export default async function CardEventEditPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; teamId: string; eventId: string }>;
}>) {
  const { id: matchId, teamId, eventId } = await params;

  const [matchEvent, matchLineups] = await Promise.all([
    prisma.matchEvent.findUnique({
      where: { id: eventId },
    }),
    prisma.matchLineup.findMany({
      where: {
        teamId,
        matchId,
      },
    }),
  ]);

  if (!matchEvent) {
    notFound();
  }

  const defaultValues: CardSchemaType = {
    minute: matchEvent.minute,
    player:
      matchLineups.find((lineup) => lineup.playerId === matchEvent.playerId) ??
      null!,
    cardType:
      matchEvent.eventType === "YELLOW_CARD"
        ? cardTypes.find((card) => card.code === "YELLOW_CARD") ?? null!
        : cardTypes.find((card) => card.code === "RED_CARD") ?? null!,
  };

  const handleSubmit = async (data: CardSchemaType, context: SubmitContext) => {
    "use server";

    if (!context.eventId) {
      throw new Error("Event ID is required");
    }

    try {
      await prisma.matchEvent.update({
        where: { id: context.eventId },
        data: {
          minute: data.minute,
          eventType:
            data.cardType.code === "YELLOW_CARD" ? "YELLOW_CARD" : "RED_CARD",
          playerId: data.player.playerId,
        },
      });

      redirect(`/match/${context.matchId}/score`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      <CardForm
        defaultValues={defaultValues}
        players={matchLineups}
        matchId={matchId}
        teamId={teamId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
