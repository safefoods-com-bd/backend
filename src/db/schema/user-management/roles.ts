import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const rolesTable = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar({ length: 91 }).notNull().unique(),
  description: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export default rolesTable;
