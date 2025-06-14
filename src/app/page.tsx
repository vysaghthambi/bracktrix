import { redirect } from "next/navigation";

import MyTeams from "@/components/MyTeams/MyTeams";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.jerseyNumber || !user?.positionCode) {
      redirect("/profile/complete");
    }
  }

  return <div>{session && <MyTeams userId={session.user.id} />}</div>;
}
