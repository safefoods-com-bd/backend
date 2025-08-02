import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import usersTable from "./users";

const profileTable = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 100 }),
  dateOfBirth: varchar({ length: 50 }),

  // System Metadata
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Foreign Key
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull()
    .unique(),
});

export default profileTable;
