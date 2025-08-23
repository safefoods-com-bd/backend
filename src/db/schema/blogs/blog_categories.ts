import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const blogCategoriesTable = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default blogCategoriesTable;
