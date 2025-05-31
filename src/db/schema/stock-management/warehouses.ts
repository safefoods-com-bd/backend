import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const warehouseTable = pgTable("warehouses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  contactNumber: text("contact_number").notNull(),
  email: text("email").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Relations can be added here if needed
});
export default warehouseTable;
