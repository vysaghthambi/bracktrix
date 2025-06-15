import * as y from "yup";

export const groupSchema = y.object({
  groups: y
    .array()
    .of(
      y.object({
        groupId: y.string(),
        orderNumber: y.number().required("Group order number is required"),
        name: y.string().required("Group name is required"),
        teams: y
          .array()
          .of(
            y.object({
              id: y.string().required("Team id is required"),
              name: y.string().required("Team name is required"),
            })
          )
          .required("Group teams are required")
          .min(1, "Group teams are required"),
      })
    )
    .required("Groups are required"),
});

export type GroupSchemaType = y.InferType<typeof groupSchema>;
