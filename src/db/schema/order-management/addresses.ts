import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const addressesTable = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull(),
  flatNo: varchar("flat_no", { length: 100 }).notNull(),
  floorNo: varchar("floor_no", { length: 100 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  phoneNo: varchar("phone_no", { length: 100 }).notNull(),
  deliveryNotes: text("delivery_notes"),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default addressesTable;
