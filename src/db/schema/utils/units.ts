import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const unitsTable = pgTable("units", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  baseUnit: varchar("base_unit", { length: 10 }),
  operator: varchar("operator", { length: 10 }),
  operationValue: varchar("operation_value", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export default unitsTable;
