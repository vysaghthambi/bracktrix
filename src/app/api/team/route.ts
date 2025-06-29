import { NextRequest, NextResponse } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const searchTerm = searchParams.get("searchTerm") ?? "";
  const isUserExcluded = searchParams.get("isUserExcluded") === "true";

  const session = await getServerAuthSession();

  const teams = await prisma.team.findMany({
    where: {
      ...(searchTerm && {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      }),
      ...(isUserExcluded && {
        teamMembers: {
          none: {
            userId: session?.user.id,
          },
        },
      }),
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return NextResponse.json(teams, { status: 200 });
}
