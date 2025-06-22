import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function MatchEvents({
  matchId,
}: Readonly<{ matchId: string }>) {
  const matchEvents = await prisma.matchEvent.findMany({
    where: {
      matchId,
    },
    orderBy: {
      minute: "asc",
    },
    include: {
      player: {
        select: {
          name: true,
          jerseyNumber: true,
        },
      },
    },
  });

  return (
    <div>
      <h6>Match Events</h6>
      <div>
        {matchEvents.map((event) => (
          <div key={event.id}>
            <div>{event.player.name}</div>
            <div>{event.minute}</div>
            <div>{event.eventType}</div>
            <Link
              href={
                event.eventType === "GOAL" || event.eventType === "OWN_GOAL"
                  ? `/match/${matchId}/score/${event.teamId}/goal/${event.id}`
                  : `/match/${matchId}/score/${event.teamId}/card/${event.id}`
              }
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
