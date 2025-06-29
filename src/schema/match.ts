import { KnockoutLevel } from "@prisma/client";
import * as y from "yup";

export const knockoutLevels: { id: KnockoutLevel; name: string }[] = [
  { id: "PRE_QUARTER_FINAL", name: "Pre-Quarter Final" },
  { id: "QUARTER_FINAL", name: "Quarter Final" },
  { id: "SEMI_FINAL", name: "Semi Final" },
  { id: "FINAL", name: "Final" },
] as const;

const knockoutLevelSchema = y.object({
  id: y
    .string()
    .oneOf(knockoutLevels.map((level) => level.id))
    .required("Knockout level id is required"),
  name: y.string().required("Knockout level name is required"),
});

const teamSchema = y.object({
  id: y.string().required("Team id is required"),
  name: y.string().required("Team name is required"),
});

const groupSchema = y.object({
  id: y.string().required("Group id is required"),
  name: y.string().required("Group name is required"),
});

export const matchSchema = y.object({
  isGroupMatch: y
    .boolean()
    .required("Is group match is required")
    .default(false),
  matchNumber: y.number().required("Match number is required"),
  title: y.string().required("Title is required"),
  group: groupSchema.when("isGroupMatch", {
    is: true,
    then: (schema) => schema.required("Group is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  homeTeam: teamSchema.nullable().required("Home team is required"),
  awayTeam: teamSchema.nullable().required("Away team is required"),
  startTime: y.string().required("Start time is required"),
  duration: y.number().required("Duration is required"),
  knockoutLevel: knockoutLevelSchema.when("isGroupMatch", {
    is: false,
    then: (schema) => schema.required("Knockout level is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

export type MatchSchemaType = y.InferType<typeof matchSchema>;
