import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function MyTeams({
  userId,
}: Readonly<{ userId: string }>) {
  const teams = await prisma.team.findMany({
    where: {
      teamMembers: {
        some: {
          userId: userId,
          status: "ACCEPTED",
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div>
      <h6>My Teams</h6>
      <ol>
        {teams.map((team) => (
          <li key={team.id}>
            <Link href={`/team/${team.id}`}>{team.name}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
