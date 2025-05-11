import { NextRequest } from "next/server";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchTerm = request.nextUrl.searchParams.get("searchTerm") ?? "";

  const session = await getServerAuthSession();

  if (!searchTerm) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const teams = await prisma.team.findMany({
    where: {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
      members: {
        none: {
          userId: session?.user.id,
        },
      },
    },
  });

  return new Response(JSON.stringify(teams), { status: 200 });
}
