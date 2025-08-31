import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import usersTable from "../user-management/users";
import guestUsersTable from "../user-management/guestUsers";

const addressesTable = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => usersTable.id, {
      onDelete: "cascade",
    }),
    guestUserId: uuid("guest_user_id").references(() => guestUsersTable.id, {
      onDelete: "cascade",
    }),
    flatNo: varchar("flat_no", { length: 100 }),
    floorNo: varchar("floor_no", { length: 100 }),
    addressLine: text("address_line").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    phoneNo: varchar("phone_no", { length: 100 }).notNull(),
    deliveryNotes: text("delivery_notes"),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 })
      .notNull()
      .default("Bangladesh"),
    postalCode: varchar("postal_code", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(false).notNull(),
  },
  (table) => ({
    uniqueActiveAddress: uniqueIndex("unique_active_address_per_user")
      .on(table.userId, table.isActive)
      .where(sql`is_active = true`),
    idxUserId: index("idx_user_id").on(table.userId),
  }),
);

export default addressesTable;
