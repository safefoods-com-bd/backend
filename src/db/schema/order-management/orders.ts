import {
  boolean,
  numeric,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import usersTable from "../user-management/users";
import couponsTable from "./coupons";
import deliveryZoneTable from "./delivery-zones";
import paymentMethodTable from "./payment_methods";
import addressesTable from "./addresses";

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
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  subTotal: numeric("sub_total", { precision: 10, scale: 2 }).notNull(), // products prices
  discount: real("discount").notNull().default(0), // discounts
  couponId: uuid("coupon_id").references(() => couponsTable.id), // coupon applied
  afterDiscountTotal: numeric("after_discount_total", {
    precision: 10,
    scale: 2,
  }).notNull(),
  deliveryCharge: real("delivery_charge").notNull().default(0), // delivery charges
  deliveryZoneId: uuid("delivery_zone_id")
    .references(() => deliveryZoneTable.id)
    .notNull(), // delivery zone
  total: real("total").notNull(),
  preferredDeliveryDateAndTime: timestamp(
    "preferred_delivery_date_and_time",
  ).notNull(), // preferred delivery date and time
  paymentMethodId: uuid("payment_method_id")
    .references(() => paymentMethodTable.id)
    .notNull(), // payment method
  transactionNo: varchar("transaction_no", { length: 100 }), // transaction number
  transactionPhoneNo: varchar("transaction_phone_no", { length: 15 }), // transaction phone number
  transactionDate: timestamp("transaction_date"), //
  addressId: uuid("address_id")
    .references(() => addressesTable.id)
    .notNull(), // delivery address
  paymentStatus: paymentStatusEnum("payment_status")
    .default("unpaid")
    .notNull(),
  orderStatus: orderStatusEnum("order_status").default("pending").notNull(),

  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export default ordersTable;

/// product prices, discounts, delivery charges,
