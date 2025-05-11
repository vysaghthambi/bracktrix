"use server";

import { prisma } from "@/lib/prisma";

type CreateTeamPayload = {
  name: string;
  description: string;
  createdBy: string;
};

export const createTeam = async ({
  name,
  description,
  createdBy,
}: CreateTeamPayload) => {
  const team = await prisma.team.create({
    data: {
      name,
      description,
      createdById: createdBy,
      members: {
        create: {
          userId: createdBy,
          role: "ADMIN",
          status: "ACCEPTED",
        },
      },
    },
  });

  return team;
};

export const cancelInvitation = async (teamId: string, userId: string) => {
  await prisma.teamMember.delete({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
  });
};

export const updateInvitationStatus = async (
  teamId: string,
  userId: string,
  status: "ACCEPTED" | "REJECTED"
) => {
  await prisma.teamMember.update({
    where: {
      userId_teamId: {
        userId,
        teamId,
      },
    },
    data: {
      status,
    },
  });
};
