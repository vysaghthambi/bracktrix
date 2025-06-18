import { KnockoutLevel } from "@prisma/client";

export type MatchCreatePayload = {
  matchNumber: number;
  title: string;
  homeTeamId: string;
  awayTeamId: string;
  startTime: string;
  duration: number;
  groupId?: string;
  knockoutLevel?: KnockoutLevel;
};
