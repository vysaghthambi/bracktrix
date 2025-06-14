import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateRequestStatus } from "@/actions/team";

import TeamMembers from "@/components/TeamMembers/TeamMembers";

export type RequestStatus = "approve" | "reject";

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
      teamMembers: {
        where: {
          OR: [
            { status: "ACCEPTED" },
            { status: "REQUESTED" },
          ]
        },
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
    team.teamMembers.find((member) => member.userId === session.user.id)?.role ===
    "ADMIN";

  const joinedMembers = team.teamMembers.filter(
    (member) => member.status === "ACCEPTED"
  );

  const requestedMembers = team.teamMembers.filter(
    (member) => member.status === "REQUESTED"
  );

  const handleRequest = async (userId: string, status: RequestStatus) => {
    "use server";

    await updateRequestStatus(
      teamId,
      userId,
      status === "approve" ? "ACCEPTED" : "REJECTED"
    );

    revalidatePath(`/team/${teamId}`);
  };

  return (
    <div>
      <h1>{team.name}</h1>
      <p>{team.description}</p>
      <p>Created by: {team.createdBy.name}</p>
      <TeamMembers
        isAdmin={isAdmin}
        joinedMembers={joinedMembers}
        requestedMembers={requestedMembers}
        handleRequest={handleRequest}
      />
    </div>
  );
}
