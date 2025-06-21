import * as y from "yup";

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
