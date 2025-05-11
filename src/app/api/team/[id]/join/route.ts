import { NextRequest } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const teamId = (await params).id;
  const session = await getServerAuthSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: session.user.id,
      teamId,
    },
  });

  if (teamMember) {
    return new Response("Already requested", { status: 400 });
  }

  await prisma.teamMember.create({
    data: {
      userId: session.user.id,
      teamId,
      status: "REQUESTED",
    },
  });

  return new Response("Request sent successfully", { status: 200 });
}
