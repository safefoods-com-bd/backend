import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import mediaTables from "../../utils/media";
import variantProductTables from "./variant_products";

export const variantProductsMediaTables = pgTable("variant_products_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),

  // Foreign keys for the relationship
  variantProductId: uuid("variant_product_id")
    .notNull()
    .references(() => variantProductTables.id),
  mediaId: uuid("media_id")
    .notNull()
    .references(() => mediaTables.id),
});

export default variantProductsMediaTables;
