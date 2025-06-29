"use client";

import { useState } from "react";
import { TeamMember, User } from "@prisma/client";
import { RequestStatus } from "@/app/team/[id]/page";

export type TeamMemberType = TeamMember & {
  user: Pick<User, "id" | "name">;
};

type TeamMembersProps = {
  isAdmin: boolean;
  joinedMembers: TeamMemberType[];
  requestedMembers: TeamMemberType[];
  handleRequest: (userId: string, status: RequestStatus) => Promise<void>;
};

type MemberTab = "joined" | "requested";

export default function TeamMembers({
  isAdmin,
  joinedMembers,
  requestedMembers,
  handleRequest,
}: Readonly<TeamMembersProps>) {
  const [activeTab, setActiveTab] = useState<MemberTab>("joined");

  const handleTabChange = (tab: MemberTab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <button onClick={() => handleTabChange("joined")}>Members</button>
      {isAdmin && (
        <button onClick={() => handleTabChange("requested")}>Requests</button>
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

      {activeTab === "requested" && (
        <div>
          <h2>Requests</h2>
          <ol>
            {requestedMembers.map((member) => (
              <li key={member.userId}>
                {member.user.name} - {member.role}
                <button onClick={() => handleRequest(member.userId, "approve")}>
                  Accept
                </button>
                <button onClick={() => handleRequest(member.userId, "reject")}>
                  Reject
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
