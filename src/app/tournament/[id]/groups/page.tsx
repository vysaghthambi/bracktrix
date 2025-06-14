import GroupTable from "@/components/GroupTable/GroupTable";
import { prisma } from "@/lib/prisma";

export default async function GroupsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  const groups = await prisma.group.findMany({
    where: { tournamentId },
  });

  return (
    <div>
      <h2>Groups</h2>
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
