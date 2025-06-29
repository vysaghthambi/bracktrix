import {
  knockoutFormatEnums,
  tournamentTypeEnums,
} from "@/constants/tournament";
import { TournamentType } from "@prisma/client";
import * as y from "yup";

export const tournamentSchema = y.object({
  name: y.string().required("Tournament name is required").default(""),
  description: y.string().default(""),
  location: y.string().required("Location is required").default(""),
  locationUrl: y.string().required("Location URL is required").default(""),
  playersCount: y
    .number()
    .required("Players count is required")
    .typeError("Players count must be a number")
    .min(1, "Players count must be at least 1")
    .default(7),
  substitutesCount: y
    .number()
    .required("Substitutes count is required")
    .typeError("Substitutes count must be a number")
    .min(1, "Substitutes count must be at least 1")
    .default(5),
  duration: y
    .number()
    .required("Duration is required")
    .typeError("Duration must be a number")
    .min(1, "Duration must be at least 1")
    .default(5),
  startDate: y
    .string()
    .nullable()
    .required("Start date is required")
    .default(null),
  endDate: y.string().nullable().required("End date is required").default(null),
  tournamentType: y
    .object({ label: y.string(), value: y.string().oneOf(tournamentTypeEnums) })
    .nullable()
    .required("Tournament type is required")
    .default(null),
  knockoutFormat: y
    .object({ label: y.string(), value: y.string().oneOf(knockoutFormatEnums) })
    .when("tournamentType", {
      is: (value: TournamentType) =>
        value === TournamentType.KNOCKOUT ||
        value === TournamentType.GROUP_KNOCKOUT,
      then: (schema) => schema.required("Knockout format is required"),
      otherwise: (schema) => schema.nullable(),
    })
    .default(null),
  teams: y
    .array()
    .of(
      y.object({
        id: y.string().required("Team ID is required"),
        name: y.string().required("Team name is required"),
      })
    )
    .min(1, "Team count must be at least 1")
    .default([]),
});

export type TournamentSchemaType = y.InferType<typeof tournamentSchema>;
