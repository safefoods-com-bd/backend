import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import variantProductTables from "../product-management/products/variant_products";
import mediaTables from "../utils/media";

const bannersTable = pgTable("banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  mediaId: uuid("media_id").references(() => mediaTables.id),
  title: varchar("title", { length: 255 }).notNull(),
  variantProductId: uuid("variant_product_id").references(
    () => variantProductTables.id,
  ),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default bannersTable;
