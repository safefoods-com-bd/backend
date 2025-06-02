import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import categoriesTable from "../categories/categories";
import brandTables from "../../utils/brands";

const productsTables = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 255 }).notNull().unique(),
  season: varchar("season", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  //relations
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoriesTable.id),
  brandId: uuid("brand_id").references(() => brandTables.id),
});

export default productsTables;
