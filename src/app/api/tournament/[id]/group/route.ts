import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { GroupCreatePayload } from "@/types/group";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tournamentId = (await params).id;

  const body: GroupCreatePayload = await request.json();

  const group = await prisma.group.create({
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
      tournament: {
        connect: {
          id: tournamentId,
        },
      },
    },
  });

  return NextResponse.json(group, { status: 201 });
}
