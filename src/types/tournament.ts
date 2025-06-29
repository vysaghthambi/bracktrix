import { TournamentSchemaType } from "@/schema/tournament";
import { KnockoutLevel, TournamentType } from "@prisma/client";

export type TournamentCreatePayload = Omit<
  TournamentSchemaType,
  "teams" | "tournamentType" | "knockoutFormat"
> & {
  teams: string[];
  tournamentType: TournamentType;
  knockoutFormat?: KnockoutLevel;
};
