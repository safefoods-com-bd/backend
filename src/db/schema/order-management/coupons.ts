import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"]);

const couponsTable = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  discount: numeric("discount", { precision: 5, scale: 2 }).notNull(),
  discountType: discountTypeEnum("discount_type")
    .notNull()
    .default("percentage"),
  validDate: varchar("valid_date", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export default couponsTable;
