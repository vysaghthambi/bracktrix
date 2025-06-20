import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function MatchPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const matchId = (await params).id;

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      homeTeam: {
        select: {
          name: true,
        },
      },
      awayTeam: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <div>
      <div>{match.title}</div>
      <div>
        {match.homeTeam.name} vs {match.awayTeam.name}
      </div>
      <div>
        {match.homeTeamScore} - {match.awayTeamScore}
      </div>
      <div>{dayjs(match.startTime).format("DD/MM/YYYY HH:mm")}</div>

      <Link href={`/match/${matchId}/squad`}>Update Squad</Link>
    </div>
  );
}
