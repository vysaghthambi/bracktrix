import Link from "next/link";

import Matches from "@/components/Matches/Matches";

export default async function KnockoutPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const tournamentId = (await params).id;

  return (
    <div>
      <h2>Knockout Stage</h2>
      <Link href={`/tournament/${tournamentId}/knockout/match/schedule`}>
        Schedule Match
      </Link>
      <Matches tournamentId={tournamentId} stage="KNOCKOUT" />
    </div>
  );
}
