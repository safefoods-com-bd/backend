import warehouseTable from "./warehouses";
import variantProductTables from "../product-management/products/variant_products";
import { pgTable, real, timestamp, uuid } from "drizzle-orm/pg-core";
export const stocksTable = pgTable("stocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  quantity: real("quantity").notNull(),
  warehouseId: uuid("warehouse_id")
    .notNull()
    .references(() => warehouseTable.id, { onDelete: "cascade" }),
  variantProductId: uuid("variant_product_id")
    .notNull()
    .references(() => variantProductTables.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export default stocksTable;
