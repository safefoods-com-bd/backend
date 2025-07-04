import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import usersTable from "../user-management/users";
import variantProductTables from "../product-management/products/variant_products";

const addedToCartsTable = pgTable("added_to_carts", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  variantProductId: uuid("variant_product_id").references(
    () => variantProductTables.id,
  ),
  quantity: integer("quantity").notNull(),
  addedToCheckOut: boolean("added_to_checkout").default(false),
  isPurchased: boolean("is_purchased").default(false),
  isDiscarded: boolean("is_discarded").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export default addedToCartsTable;
