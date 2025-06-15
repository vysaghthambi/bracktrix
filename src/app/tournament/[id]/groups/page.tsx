import Link from "next/link";

import { prisma } from "@/lib/prisma";
import GroupTable from "@/components/GroupTable/GroupTable";

export default async function GroupsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  const [tournament, groups] = await Promise.all([
    prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        type: true,
      },
    }),
    prisma.group.findMany({
      where: { tournamentId },
      orderBy: {
        orderNumber: "asc",
      },
    }),
  ]);

  return (
    <div>
      <h2>Groups</h2>
      {tournament?.type === "GROUP_KNOCKOUT" && (
        <Link href={`/tournament/${tournamentId}/groups/edit`}>
          {groups.length ? "Edit Groups" : "Add Groups"}
        </Link>
      )}
      <div>
        {groups.map((group) => (
          <div key={group.id}>
            <h3>{group.name}</h3>
            <GroupTable groupId={group.id} tournamentId={tournamentId} />
          </div>
        ))}
      </div>
    </div>
  );
}
