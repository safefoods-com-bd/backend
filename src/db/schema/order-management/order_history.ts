import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import ordersTable from "./orders";
import usersTable from "../user-management/users";
const orderHistoryTable = pgTable("order_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => ordersTable.id),
  status: varchar("status").notNull(),
  changedBy: uuid("changed_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export default orderHistoryTable;
