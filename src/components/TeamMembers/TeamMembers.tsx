"use client";

import { useState } from "react";
import { revalidatePath } from "next/cache";
import { TeamMember, User } from "@prisma/client";

import { cancelInvitation } from "@/actions/team";

type TeamMemberType = TeamMember & {
  user: Pick<User, "id" | "name">;
};

type TeamMembersProps = {
  isAdmin: boolean;
  teamId: string;
  joinedMembers: TeamMemberType[];
  pendingMembers: TeamMemberType[];
  rejectedMembers: TeamMemberType[];
};

type MemberTab = "joined" | "invited";

export default function TeamMembers({
  isAdmin,
  teamId,
  joinedMembers,
  pendingMembers,
  rejectedMembers,
}: Readonly<TeamMembersProps>) {
  const [activeTab, setActiveTab] = useState<MemberTab>("joined");

  const handleTabChange = (tab: MemberTab) => {
    setActiveTab(tab);
  };

  const handleInvitationReject = async (userId: string) => {
    await cancelInvitation(teamId, userId);

    revalidatePath(`/team/${teamId}`);
  };

  return (
    <div>
      <button onClick={() => handleTabChange("joined")}>Members</button>
      {isAdmin && (
        <button onClick={() => handleTabChange("invited")}>Invited</button>
      )}

      {activeTab === "joined" && (
        <div>
          <h2>Members</h2>
          <ol>
            {joinedMembers.map((member) => (
              <li key={member.userId}>
                {member.user.name} - {member.role}
              </li>
            ))}
          </ol>
        </div>
      )}

      {activeTab === "invited" && (
        <div>
          <h2>Invited Members</h2>
          <ol>
            {pendingMembers.map((member) => (
              <li key={member.userId}>
                {member.user.name} - {member.role} - Pending
                <button onClick={() => handleInvitationReject(member.userId)}>
                  Cancel
                </button>
              </li>
            ))}
            {rejectedMembers.map((member) => (
              <li key={member.userId}>
                {member.user.name} - {member.role} - Rejected
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
