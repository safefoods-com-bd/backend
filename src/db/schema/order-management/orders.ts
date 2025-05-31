import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "unpaid",
  "refunded",
  "failed",
]);
const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);
const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  subTotal: numeric("sub_total", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  afterDiscountTotal: numeric("after_discount_total", {
    precision: 10,
    scale: 2,
  }).notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("unpaid")
    .notNull(),
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export default ordersTable;
