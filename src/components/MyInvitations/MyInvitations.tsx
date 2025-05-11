import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateInvitationStatus } from "@/actions/team";

import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import InvitedCard from "./InvitedTeamCard/InvitedTeamCard";

export default async function MyInvitations() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  const invitedTeams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
          status: "PENDING",
        },
      },
    },
  });

  const handleInvitationChange = async (
    teamId: string,
    action: "accept" | "reject"
  ) => {
    await updateInvitationStatus(
      teamId,
      session.user.id,
      action === "accept" ? "ACCEPTED" : "REJECTED"
    );

    revalidatePath(`/`);
  };

  return (
    <div>
      <h6>My Invitations</h6>
      <ol>
        {invitedTeams.map((team) => (
          <InvitedCard
            key={team.id}
            teamId={team.id}
            teamName={team.name}
            handleInvitationChange={handleInvitationChange}
          />
        ))}
      </ol>
    </div>
  );
}
