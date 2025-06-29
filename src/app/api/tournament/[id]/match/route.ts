import { NextRequest, NextResponse } from "next/server";

import { MatchCreatePayload } from "@/types/match";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const tournamentId = (await params).id;
  const body: MatchCreatePayload = await request.json();

  const match = await prisma.match.create({
    data: {
      tournamentId,
      groupId: body.groupId,
      matchNumber: body.matchNumber,
      title: body.title,
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      startTime: body.startTime,
      duration: body.duration,
      stage: body.groupId ? "GROUP" : "KNOCKOUT",
      status: "SCHEDULED",
      knockoutLevel: body.knockoutLevel,
    },
  });

  return NextResponse.json({ id: match.id });
}
