import {
  AnyPgColumn,
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import categoryLevelsTable from "./category_levels";
import { mediaTable } from "../..";

const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description").default(""),
  categoryLevelId: uuid("category_level_id").references(
    () => categoryLevelsTable.id,
  ),
  parentId: uuid("parent_id").references((): AnyPgColumn => categoriesTable.id),
  mediaId: uuid("media_id").references(() => mediaTable.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default categoriesTable;
