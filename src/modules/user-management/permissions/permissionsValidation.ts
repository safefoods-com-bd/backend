import { permissionsTable } from "@/db/schema";
import { createInsertSchema } from "drizzle-zod";

export const createPermissionSchema = createInsertSchema(permissionsTable, {
  name: (schema) =>
    schema
      .min(3, { message: "Name should be at least of 3 characters" })
      .max(91, { message: "Name should be at most of 91 characters" })
      .trim()
      .toLowerCase(),
  description: (schema) => schema.nullable(),
});
