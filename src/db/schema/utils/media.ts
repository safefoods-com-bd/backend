import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

const MediaTables = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: varchar("url", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default MediaTables;
