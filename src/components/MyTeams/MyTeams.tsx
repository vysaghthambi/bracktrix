import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MyTeams() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: session?.user.id,
          status: "ACCEPTED",
        },
      },
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
