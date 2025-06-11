import { KnockoutFormat, TournamentType } from "@prisma/client";

export const tournamentTypeEnums: TournamentType[] = [
  "LEAGUE",
  "KNOCKOUT",
  "GROUP_KNOCKOUT",
];

export const tournamentTypes: { label: string; value: TournamentType }[] = [
  { label: "League", value: TournamentType.LEAGUE },
  { label: "Knockout", value: TournamentType.KNOCKOUT },
  { label: "Group + Knockout", value: TournamentType.GROUP_KNOCKOUT },
];

export const knockoutFormatEnums: KnockoutFormat[] = [
  "ROUND_OF_16",
  "ROUND_OF_8",
  "ROUND_OF_4",
];

export const knockoutFormats: { label: string; value: KnockoutFormat }[] = [
  { label: "Round of 16", value: KnockoutFormat.ROUND_OF_16 },
  { label: "Round of 8", value: KnockoutFormat.ROUND_OF_8 },
  { label: "Round of 4", value: KnockoutFormat.ROUND_OF_4 },
];
