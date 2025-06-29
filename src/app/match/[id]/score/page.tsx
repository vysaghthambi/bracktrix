import dayjs from "dayjs";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getMatchStatus } from "@/utils/getMatchStatus";
import MatchEvents from "@/components/MatchEvents/MatchEvents";
import MatchScoreCard from "@/components/MatchScoreCard/MatchScoreCard";

export default async function ScorePage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const matchId = (await params).id;

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: {
        select: {
          id: true,
          name: true,
        },
      },
      awayTeam: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!match) {
    return notFound();
  }

  const {
    isScheduled,
    isFirstHalf,
    isHalfTime,
    isSecondHalf,
    isFullTime,
    isExtraFirstHalf,
    isExtraFirstHalfEnd,
    isExtraSecondHalf,
    isExtraSecondHalfEnd,
    isMatchCompleted,
  } = getMatchStatus(match);

  const startMatch = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "ONGOING", firstHalfStartAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const endFirstHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { firstHalfEndAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const startSecondHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { secondHalfStartAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const endSecondHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { secondHalfEndAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const startExtraFirstHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { extraFirstHalfStartAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const endExtraFirstHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { extraFirstHalfEndAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const startExtraSecondHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { extraSecondHalfStartAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const endExtraSecondHalf = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { extraSecondHalfEndAt: dayjs().toISOString() },
    });

    revalidatePath(`/match/${matchId}/score`);
  };
  const endMatch = async () => {
    "use server";
    await prisma.match.update({
      where: { id: matchId },
      data: { status: "COMPLETED" },
    });

    revalidatePath(`/match/${matchId}/score`);
  };

  return (
    <div>
      <h6>ScorePage</h6>
      {isScheduled && (
        <form action={startMatch}>
          <button type="submit">Start Match</button>
        </form>
      )}
      {isFirstHalf && (
        <form action={endFirstHalf}>
          <button type="submit">End First Half</button>
        </form>
      )}
      {isHalfTime && (
        <form action={startSecondHalf}>
          <button type="submit">Start Second Half</button>
        </form>
      )}
      {isSecondHalf && (
        <form action={endSecondHalf}>
          <button type="submit">End Second Half</button>
        </form>
      )}
      {isFullTime && (
        <form action={startExtraFirstHalf}>
          <button type="submit">Start Extra Time First Half</button>
        </form>
      )}
      {isExtraFirstHalf && (
        <form action={endExtraFirstHalf}>
          <button type="submit">End Extra Time First Half</button>
        </form>
      )}
      {isExtraFirstHalfEnd && (
        <form action={startExtraSecondHalf}>
          <button type="submit">Start Extra Time Second Half</button>
        </form>
      )}
      {isExtraSecondHalf && (
        <form action={endExtraSecondHalf}>
          <button type="submit">End Extra Time Second Half</button>
        </form>
      )}
      {(isFullTime || isExtraSecondHalfEnd) && !isMatchCompleted && (
        <form action={endMatch}>
          <button type="submit">End Match</button>
        </form>
      )}
      {isMatchCompleted && <div>Match Completed</div>}

      <MatchScoreCard
        teamId={match.homeTeam.id}
        teamName={match.homeTeam.name}
        score={match.homeTeamScore ?? 0}
        matchId={matchId}
      />
      <MatchScoreCard
        teamId={match.awayTeam.id}
        teamName={match.awayTeam.name}
        score={match.awayTeamScore ?? 0}
        matchId={matchId}
      />

      <MatchEvents matchId={matchId} />
    </div>
  );
}
