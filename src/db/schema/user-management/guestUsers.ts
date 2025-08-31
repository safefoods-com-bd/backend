import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const guestUsersTable = pgTable("guest_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 91 }),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export default guestUsersTable;
