import { NextRequest, NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const teamId = (await params).id;
  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: session.user.id,
      teamId,
    },
  });

  if (teamMember) {
    return NextResponse.json({ message: "Already requested" }, { status: 400 });
  }

  await prisma.teamMember.create({
    data: {
      userId: session.user.id,
      teamId,
      status: "REQUESTED",
    },
  });

  return NextResponse.json(
    { message: "Request sent successfully" },
    { status: 200 }
  );
}
