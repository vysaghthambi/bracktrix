import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TournamentCreatePayload } from "@/types/tournament";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body: TournamentCreatePayload = await request.json();
  const session = await getServerAuthSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: body.name,
      description: body.description,
      location: body.location,
      locationUrl: body.locationUrl,
      playerCount: body.playersCount,
      substituteCount: body.substitutesCount,
      matchDuration: body.duration,
      type: body.tournamentType,
      knockoutFormat: body.knockoutFormat,
      createdById: session?.user.id,
      startDate: body.startDate,
      endDate: body.endDate,
      tournamentTeams: {
        createMany: {
          data: body.teams.map((teamId) => ({
            teamId: teamId,
          })),
        },
      },
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({ id: tournament.id }, { status: 200 });
}
