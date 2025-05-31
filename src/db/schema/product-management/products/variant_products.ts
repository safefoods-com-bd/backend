import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import productsTables from "./products";
import colorTables from "../../utils/colors";
import sizeTables from "../../utils/sizes";
import unitsTable from "../../utils/units";

const variantProductTables = pgTable("variant_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  price: numeric("price", { precision: 8, scale: 3 }),
  originalPrice: numeric("original_price", { precision: 8, scale: 3 }),
  stock: numeric("stock", { precision: 6, scale: 2 }),
  description: text("description"),
  shortDescription: text("short_description"),
  bestDeal: boolean("best_deal").default(false).notNull(),
  discountedSale: boolean("discounted_sale").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  //relations
  productId: uuid("product_id")
    .notNull()
    .references(() => productsTables.id),
  colorId: uuid("color_id")
    .notNull()
    .references(() => colorTables.id),
  sizeId: uuid("size_id").references(() => sizeTables.id),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => unitsTable.id),
});
export default variantProductTables;
