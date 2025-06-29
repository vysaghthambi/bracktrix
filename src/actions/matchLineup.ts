"use server";

import { MatchLineup, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { MatchLineupPlayer } from "@/schema/matchLineup";

async function createMatchLineup({
  matchId,
  teamId,
  players,
  substitutes,
}: {
  matchId: string;
  teamId: string;
  players: MatchLineupPlayer[];
  substitutes: MatchLineupPlayer[];
}) {
  const playersData: Prisma.MatchLineupCreateManyInput[] = players.map(
    (player) => ({
      matchId: matchId,
      playerId: player.id,
      teamId: teamId,
      name: player.name,
      positionCode: player.positionCode,
      jerseyNumber: parseInt(player.jerseyNumber ?? "0"),
      isSubstitute: false,
    })
  );

  const substitutesData: Prisma.MatchLineupCreateManyInput[] = substitutes.map(
    (substitute) => ({
      matchId: matchId,
      playerId: substitute.id,
      teamId: teamId,
      name: substitute.name,
      positionCode: substitute.positionCode,
      jerseyNumber: parseInt(substitute.jerseyNumber ?? "0"),
      isSubstitute: true,
    })
  );

  await prisma.$transaction([
    prisma.matchLineup.createMany({
      data: playersData,
    }),
    prisma.matchLineup.createMany({
      data: substitutesData,
    }),
  ]);
}

async function updateMatchLineup({
  matchId,
  teamId,
  matchSquad,
  players,
  substitutes,
}: {
  matchId: string;
  teamId: string;
  matchSquad: MatchLineup[];
  players: MatchLineupPlayer[];
  substitutes: MatchLineupPlayer[];
}) {
  const matchLineupMap = new Map<string, MatchLineup>(
    matchSquad.map((squad) => [squad.playerId, squad])
  );

  const currentPlayerIds = new Set([
    ...players.map((player) => player.id),
    ...substitutes.map((substitute) => substitute.id),
  ]);

  const playersToCreate: Prisma.MatchLineupCreateManyInput[] = [];
  const playersToUpdate: Prisma.Prisma__MatchLineupClient<MatchLineup>[] = [];
  const playersToDelete: Prisma.Prisma__MatchLineupClient<MatchLineup>[] = [];

  players.forEach((player) => {
    if (matchLineupMap.has(player.id)) {
      const matchLineup = matchLineupMap.get(player.id);

      if (
        matchLineup &&
        (matchLineup.isSubstitute !== false ||
          matchLineup.name !== player.name ||
          matchLineup.positionCode !== player.positionCode ||
          matchLineup.jerseyNumber !== parseInt(player.jerseyNumber ?? "0"))
      ) {
        playersToUpdate.push(
          prisma.matchLineup.update({
            where: {
              matchId_playerId_teamId: {
                matchId,
                playerId: player.id,
                teamId,
              },
            },
            data: {
              name: player.name,
              positionCode: player.positionCode,
              jerseyNumber: parseInt(player.jerseyNumber ?? "0"),
              isSubstitute: false,
            },
          })
        );
      }
    } else {
      playersToCreate.push({
        matchId,
        playerId: player.id,
        teamId,
        name: player.name,
        positionCode: player.positionCode,
        jerseyNumber: parseInt(player.jerseyNumber ?? "0"),
        isSubstitute: false,
      });
    }
  });

  substitutes.forEach((substitute) => {
    if (matchLineupMap.has(substitute.id)) {
      const matchLineup = matchLineupMap.get(substitute.id);

      if (
        matchLineup &&
        (matchLineup.isSubstitute !== true ||
          matchLineup.name !== substitute.name ||
          matchLineup.positionCode !== substitute.positionCode ||
          matchLineup.jerseyNumber !== parseInt(substitute.jerseyNumber ?? "0"))
      ) {
        playersToUpdate.push(
          prisma.matchLineup.update({
            where: {
              matchId_playerId_teamId: {
                matchId,
                playerId: substitute.id,
                teamId,
              },
            },
            data: {
              name: substitute.name,
              positionCode: substitute.positionCode,
              jerseyNumber: parseInt(substitute.jerseyNumber ?? "0"),
              isSubstitute: true,
            },
          })
        );
      }
    } else {
      playersToCreate.push({
        matchId,
        playerId: substitute.id,
        teamId,
        name: substitute.name,
        positionCode: substitute.positionCode,
        jerseyNumber: parseInt(substitute.jerseyNumber ?? "0"),
        isSubstitute: true,
      });
    }
  });

  matchSquad
    .filter((squad) => !currentPlayerIds.has(squad.playerId))
    .forEach((squad) => {
      playersToDelete.push(
        prisma.matchLineup.delete({
          where: {
            matchId_playerId_teamId: {
              matchId,
              playerId: squad.playerId,
              teamId,
            },
          },
        })
      );
    });

  await prisma.$transaction([
    ...(playersToCreate.length
      ? [prisma.matchLineup.createMany({ data: playersToCreate })]
      : []),
    ...playersToUpdate,
    ...playersToDelete,
  ]);
}

export async function createOrUpdateMatchLineup({
  matchId,
  teamId,
  players,
  matchSquad,
  playerCount,
  substituteCount,
}: {
  matchId: string;
  teamId: string;
  players: MatchLineupPlayer[];
  matchSquad: MatchLineup[];
  playerCount: number;
  substituteCount: number;
}) {
  const playingEnd = playerCount;
  const substituteEnd = playerCount + substituteCount;

  if (matchSquad.length) {
    await updateMatchLineup({
      matchId,
      teamId,
      matchSquad,
      players: players.slice(0, playingEnd),
      substitutes: players.slice(playingEnd, substituteEnd),
    });
  } else {
    await createMatchLineup({
      matchId,
      teamId,
      players: players.slice(0, playingEnd),
      substitutes: players.slice(playingEnd, substituteEnd),
    });
  }
}
