import {
  boolean,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import ordersTable from "./orders";
import variantProductTables from "../product-management/products/variant_products";

const productOrdersTable = pgTable("product_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  variantProductId: uuid("variant_product_id")
    .notNull()
    .references(() => variantProductTables.id),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id),
  price: numeric("price", { precision: 10, scale: 2 }),
  quantity: numeric("quantity", { precision: 10, scale: 2 }),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export default productOrdersTable;
