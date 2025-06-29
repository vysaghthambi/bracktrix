import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function SquadLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
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
  });

  if (!match) {
    notFound();
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href={`/match/${matchId}/squad/${match.homeTeam.id}`}>
              {match.homeTeam.name}
            </Link>
          </li>
          <li>
            <Link href={`/match/${matchId}/squad/${match.awayTeam.id}`}>
              {match.awayTeam.name}
            </Link>
          </li>
        </ul>
      </nav>

      {children}
    </div>
  );
}
