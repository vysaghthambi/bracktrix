import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import SquadForm from "@/components/SquadForm/SquadForm";
import { createOrUpdateMatchLineup } from "@/actions/matchLineup";
import { MatchLineupPlayer, MatchLineupSchema } from "@/schema/matchLineup";

export default async function TeamSquadPage({
  params,
}: Readonly<{
  params: Promise<{ id: string; teamId: string }>;
}>) {
  const { id: matchId, teamId } = await params;

  const [match, teamMembers, matchSquad, positions] = await Promise.all([
    prisma.match.findUnique({
      where: {
        id: matchId,
      },
      select: {
        tournament: {
          select: {
            playerCount: true,
            substituteCount: true,
          },
        },
      },
    }),
    prisma.teamMember.findMany({
      where: {
        teamId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            jerseyNumber: true,
            positionCode: true,
          },
        },
      },
    }),
    prisma.matchLineup.findMany({
      where: {
        matchId,
      },
    }),
    prisma.position.findMany({
      select: {
        code: true,
      },
    }),
  ]);

  if (!match) {
    notFound();
  }

  const squadData: MatchLineupSchema = {
    players: [],
  };

  if (matchSquad.length) {
    const players: MatchLineupPlayer[] = [];
    const substitutes: MatchLineupPlayer[] = [];
    matchSquad.forEach((lineup) => {
      const playerData = {
        id: lineup.playerId,
        name: lineup.name,
        jerseyNumber: lineup.jerseyNumber?.toString() || "",
        positionCode: lineup.positionCode || "",
      };

      if (lineup.isSubstitute) {
        substitutes.push(playerData);
      } else {
        players.push(playerData);
      }
    });

    squadData.players.push(...players);
    squadData.players.push(...substitutes);

    const matchSquadPlayersIds = matchSquad.map((lineup) => lineup.playerId);
    const extraPlayers = teamMembers.filter(
      (member) => !matchSquadPlayersIds.includes(member.user.id)
    );

    extraPlayers.forEach((player) => {
      squadData.players.push({
        id: player.user.id,
        name: player.user.name,
        jerseyNumber: player.user.jerseyNumber?.toString() || "",
        positionCode: player.user.positionCode || "",
      });
    });
  } else {
    teamMembers.forEach((player) => {
      squadData.players.push({
        id: player.user.id,
        name: player.user.name,
        jerseyNumber: player.user.jerseyNumber?.toString() || "",
        positionCode: player.user.positionCode || "",
      });
    });
  }

  const playerPositions = positions.map((position) => position.code);

  const handleSubmit = async (data: MatchLineupSchema) => {
    "use server";

    try {
      await createOrUpdateMatchLineup({
        matchId,
        teamId,
        players: data.players,
        matchSquad,
        playerCount: match.tournament.playerCount ?? 0,
        substituteCount: match.tournament.substituteCount ?? 0,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div>
      <h2>Squad</h2>
      <SquadForm
        defaultValues={squadData}
        playerCount={match.tournament.playerCount ?? 0}
        substituteCount={match.tournament.substituteCount ?? 0}
        playerPositions={playerPositions}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
