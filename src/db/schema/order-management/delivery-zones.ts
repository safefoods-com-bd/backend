import {
  boolean,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const deliveryZoneTable = pgTable("delivery_zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  areaName: varchar("area_name").notNull(),
  description: text("description"),
  deliveryCharge: real("delivery_charge").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  isDeleted: boolean("is_deleted").default(false),
});

export default deliveryZoneTable;
