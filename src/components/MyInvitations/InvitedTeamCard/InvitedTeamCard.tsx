"use client";

type InvitedTeamCardProps = {
  teamId: string;
  teamName: string;
  handleInvitationChange: (teamId: string, action: "accept" | "reject") => void;
};

export default function InvitedTeamCard({
  teamId,
  teamName,
  handleInvitationChange,
}: Readonly<InvitedTeamCardProps>) {
  return (
    <li>
      <h6>{teamName}</h6>
      <button onClick={() => handleInvitationChange(teamId, "accept")}>
        Accept
      </button>
      <button onClick={() => handleInvitationChange(teamId, "reject")}>
        Reject
      </button>
    </li>
  );
}
