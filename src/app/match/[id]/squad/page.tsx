import { redirect, notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function SquadPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const matchId = (await params).id;

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    select: {
      homeTeamId: true,
    },
  });

  if (!match) {
    notFound();
  }

  redirect(`/match/${matchId}/squad/${match.homeTeamId}`);
}
