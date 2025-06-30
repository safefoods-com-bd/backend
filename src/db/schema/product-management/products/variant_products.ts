import {
  boolean,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import productsTables from "./products";
import colorTables from "../../utils/colors";
import unitsTable from "../../utils/units";

const variantProductTables = pgTable("variant_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
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
  colorId: uuid("color_id").references(() => colorTables.id),
  unitId: uuid("unit_id").references(() => unitsTable.id),
});
export default variantProductTables;
