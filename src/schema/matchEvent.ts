import * as y from "yup";
import { MatchEventType } from "@prisma/client";

export const cardTypes: { code: MatchEventType; title: string }[] = [
  { code: "YELLOW_CARD", title: "Yellow Card" },
  { code: "RED_CARD", title: "Red Card" },
] as const;

export const goalScoreSchema = y.object({
  isOwnGoal: y.boolean().required("Is own goal is required"),
  minute: y.number().required("Minute is required"),
  player: y
    .object({
      playerId: y.string().required("Player id is required"),
      name: y.string().required("Player name is required"),
      teamId: y.string().required("Team id is required"),
    })
    .nullable()
    .required("Player is required"),
  assistPlayer: y
    .object({
      id: y.string(),
      name: y.string(),
    })
    .nullable(),
  goalType: y
    .object({
      code: y.string(),
      title: y.string(),
    })
    .nullable(),
});

export type GoalScoreSchemaType = y.InferType<typeof goalScoreSchema>;

export const cardSchema = y.object({
  minute: y.number().required("Minute is required"),
  player: y
    .object({
      playerId: y.string().required("Player id is required"),
      name: y.string().required("Player name is required"),
      teamId: y.string().required("Team id is required"),
    })
    .nullable()
    .required("Player is required"),
  cardType: y
    .object({
      code: y.string().required("Card type is required"),
      title: y.string().required("Card type is required"),
    })
    .required("Card type is required"),
});

export type CardSchemaType = y.InferType<typeof cardSchema>;
