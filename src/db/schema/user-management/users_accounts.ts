import { integer, pgTable } from "drizzle-orm/pg-core";
import usersTable from "./users";
import accountsTable from "./accounts";

const usersToAccountsTable = pgTable("users_to_accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => usersTable.id),
  accountId: integer("account_id").references(() => accountsTable.id),
});
export default usersToAccountsTable;
