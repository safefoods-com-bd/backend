import {
  AnyPgColumn,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import categoryLevelsTable from "./category_levels";

const categoriesTable = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  categoryLevelId: integer("category_level_id")
    .notNull()
    .references(() => categoryLevelsTable.id),
  parentId: integer("parent_id").references(
    (): AnyPgColumn => categoriesTable.id,
  ),
  isActive: integer("is_active").default(1).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default categoriesTable;
