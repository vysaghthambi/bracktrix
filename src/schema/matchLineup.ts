import * as y from "yup";

export const matchLineupSchema = y.object({
  players: y
    .array()
    .of(
      y.object({
        id: y.string().required("ID is required"),
        name: y.string().required("Name is required"),
        jerseyNumber: y.string().required("Jersey number is required"),
        positionCode: y.string().required("Position code is required"),
      })
    )
    .required("Players are required"),
});

export type MatchLineupSchema = y.InferType<typeof matchLineupSchema>;
export type MatchLineupPlayer = MatchLineupSchema["players"][number];
