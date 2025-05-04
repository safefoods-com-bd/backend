import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

const brandTables = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default brandTables;
