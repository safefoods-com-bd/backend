import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import rolesTable from "./roles";

const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar({ length: 91 }).unique(),
  password: varchar({ length: 91 }),
  phoneNumber: varchar("phone_number", { length: 15 }).unique(),
  isVerified: boolean("is_verified").notNull().default(false),
  isDeleted: boolean("is_deleted").notNull().default(false),
  registeredAt: timestamp("registered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  // foreign key
  roleId: uuid("role_id")
    .references(() => rolesTable.id)
    .notNull(),
});
export default usersTable;
