import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { MatchCreatePayload } from "@/types/match";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const { matchId } = await params;
  const body: MatchCreatePayload = await request.json();

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      matchNumber: body.matchNumber,
      title: body.title,
      groupId: body.groupId,
      homeTeamId: body.homeTeamId,
      awayTeamId: body.awayTeamId,
      startTime: body.startTime,
      duration: body.duration,
    },
  });

  return NextResponse.json({ id: match.id });
}
