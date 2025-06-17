export type MatchCreatePayload = {
  matchNumber: number;
  title: string;
  homeTeamId: string;
  awayTeamId: string;
  startTime: string;
  duration: number;
  groupId?: string;
};
