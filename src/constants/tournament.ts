import { KnockoutLevel, TournamentType } from "@prisma/client";

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

export const knockoutFormatEnums: KnockoutLevel[] = [
  KnockoutLevel.PRE_QUARTER_FINAL,
  KnockoutLevel.QUARTER_FINAL,
  KnockoutLevel.SEMI_FINAL,
  KnockoutLevel.FINAL,
];

export const knockoutFormats: { label: string; value: KnockoutLevel }[] = [
  { label: "Pre-Quarter Final", value: KnockoutLevel.PRE_QUARTER_FINAL },
  { label: "Quarter Final", value: KnockoutLevel.QUARTER_FINAL },
  { label: "Semi Final", value: KnockoutLevel.SEMI_FINAL },
  { label: "Final", value: KnockoutLevel.FINAL },
];
