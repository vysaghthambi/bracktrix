import { TournamentSchemaType } from "@/schema/tournament";
import { KnockoutFormat, TournamentType } from "@prisma/client";

export type TournamentCreatePayload = Omit<
  TournamentSchemaType,
  "teams" | "tournamentType" | "knockoutFormat"
> & {
  teams: string[];
  tournamentType: TournamentType;
  knockoutFormat?: KnockoutFormat;
};
