import * as y from "yup";

const teamSchema = y.object({
  id: y.string().required("Team id is required"),
  name: y.string().required("Team name is required"),
});

const groupSchema = y.object({
  id: y.string().required("Group id is required"),
  name: y.string().required("Group name is required"),
});

export const matchSchema = y.object({
  matchNumber: y.number().required("Match number is required"),
  title: y.string().required("Title is required"),
  group: groupSchema.nullable().required("Group is required"),
  homeTeam: teamSchema.nullable().required("Home team is required"),
  awayTeam: teamSchema.nullable().required("Away team is required"),
  startTime: y.string().required("Start time is required"),
  duration: y.number().required("Duration is required"),
});

export type MatchSchemaType = y.InferType<typeof matchSchema>;
