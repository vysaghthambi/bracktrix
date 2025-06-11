import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TournamentCreatePayload } from "@/types/tournament";
import { NextRequest } from "next/server";

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
      noOfPlayers: body.playersCount,
      noOfSubstitutes: body.substitutesCount,
      matchDuration: body.duration,
      type: body.tournamentType,
      knockoutFormat: body.knockoutFormat,
      createdById: session?.user.id,
      startDate: body.startDate,
      endDate: body.endDate,
      teams: {
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

  return new Response(JSON.stringify({ id: tournament.id }), { status: 200 });
}
