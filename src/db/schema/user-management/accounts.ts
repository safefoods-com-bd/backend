import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

const accountsTable = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  provider_name: varchar({ length: 91 }).notNull(),
});
export default accountsTable;
