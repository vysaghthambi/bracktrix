import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function MyTournaments({
  userId,
}: Readonly<{ userId: string }>) {
  const tournaments = await prisma.tournament.findMany({
    where: { createdById: userId },
  });

  return (
    <div>
      <h6>My Tournaments</h6>
      <ol>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>
            <Link href={`/tournament/${tournament.id}`}>{tournament.name}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
