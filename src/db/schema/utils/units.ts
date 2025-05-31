import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const unitsTable = pgTable("units", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  baseUnit: varchar("base_unit", { length: 10 }).notNull(),
  operator: varchar("operator", { length: 10 }).notNull(),
  operationValue: varchar("operation_value", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export default unitsTable;
