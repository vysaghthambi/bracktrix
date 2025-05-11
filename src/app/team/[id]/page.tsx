import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import TeamMembers from "@/components/TeamMembers/TeamMembers";

export default async function TeamPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const teamId = (await params).id;
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      createdBy: {
        select: {
          name: true,
          image: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { role: "asc" },
      },
    },
  });

  if (!team) {
    return <div>Team not found</div>;
  }

  const isAdmin =
    team.members.find((member) => member.userId === session.user.id)?.role ===
    "ADMIN";

  const joinedMembers = team.members.filter(
    (member) => member.status === "ACCEPTED"
  );
  const pendingMembers = team.members.filter(
    (member) => member.status === "PENDING"
  );
  const rejectedMembers = team.members.filter(
    (member) => member.status === "REJECTED"
  );

  return (
    <div>
      <h1>{team.name}</h1>
      <p>{team.description}</p>
      <p>Created by: {team.createdBy.name}</p>
      <TeamMembers
        isAdmin={isAdmin}
        teamId={teamId}
        joinedMembers={joinedMembers}
        pendingMembers={pendingMembers}
        rejectedMembers={rejectedMembers}
      />
    </div>
  );
}
