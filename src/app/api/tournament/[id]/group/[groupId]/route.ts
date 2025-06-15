import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { GroupCreatePayload } from "@/types/group";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;
  const body: GroupCreatePayload = await request.json();

  await prisma.groupTeam.deleteMany({
    where: { groupId },
  });

  const group = await prisma.group.update({
    where: { id: groupId },
    data: {
      name: body.name,
      orderNumber: body.orderNumber,
      groupTeams: {
        createMany: {
          data: body.teams.map((team) => ({
            teamId: team,
          })),
        },
      },
    },
  });

  return NextResponse.json(group, { status: 200 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;

  await prisma.groupTeam.deleteMany({
    where: { groupId },
  });
  await prisma.group.delete({
    where: { id: groupId },
  });

  return NextResponse.json(
    { message: "Group deleted successfully" },
    { status: 200 }
  );
}
