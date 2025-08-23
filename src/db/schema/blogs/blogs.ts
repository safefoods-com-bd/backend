import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import blogCategoriesTable from "./blog_categories";
import { mediaTable } from "..";

const blogsTable = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  blogCategoryId: uuid("blog_category_id").references(
    () => blogCategoriesTable.id,
  ),
  mediaId: uuid("media_id").references(() => mediaTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export default blogsTable;
