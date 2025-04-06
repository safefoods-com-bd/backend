import { z } from "zod";

// export const createRoleSchema = createInsertSchema(rolesTable, {
//   name: (schema) =>
//     schema
//       .min(3, { message: "Name should be at least of 3 characters" })
//       .max(91, { message: "Name should be at most of 91 characters" })
//       .trim()
//       .toLowerCase(),
//   description: (schema) => schema.nullable(),
// });

export const createRoleSchema = z.object({
  name: z.string().min(3).max(91).trim().toLowerCase(),
  description: z.string().nullable(),
  permissions: z.any(),
});
