import { prisma } from "@/lib/prisma";
import { GroupSchemaType } from "@/schema/group";
import GroupsForm from "@/components/GroupsForm/GroupsForm";

export default async function GroupsEditPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  const [tournamentTeams, groups] = await Promise.all([
    prisma.tournamentTeam.findMany({
      where: {
        tournamentId,
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.group.findMany({
      where: { tournamentId },
      orderBy: {
        orderNumber: "asc",
      },
      include: {
        groupTeams: {
          include: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const defaultValues: GroupSchemaType = {
    groups: groups.map((group) => ({
      groupId: group.id,
      name: group.name,
      orderNumber: group.orderNumber,
      teams: group.groupTeams.map((groupTeam) => ({
        id: groupTeam.team.id,
        name: groupTeam.team.name,
      })),
    })),
  };

  const teams = tournamentTeams.map((team) => ({
    id: team.team.id,
    name: team.team.name,
  }));

  return (
    <div>
      GroupsEditPage
      <GroupsForm
        defaultValues={defaultValues}
        tournamentTeams={teams}
        tournamentId={tournamentId}
      />
    </div>
  );
}
