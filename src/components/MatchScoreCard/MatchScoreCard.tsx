import Link from "next/link";

type MatchScoreCardProps = {
  teamId: string;
  teamName: string;
  score: number;
  matchId: string;
};

export default function MatchScoreCard({
  teamId,
  teamName,
  score,
  matchId,
}: Readonly<MatchScoreCardProps>) {
  return (
    <div>
      <div>{teamName}</div>
      <div>{score}</div>

      <Link href={`/match/${matchId}/score/${teamId}/goal`}>Goal</Link>
      <Link href={`/match/${matchId}/score/${teamId}/card`}>Card</Link>
    </div>
  );
}
