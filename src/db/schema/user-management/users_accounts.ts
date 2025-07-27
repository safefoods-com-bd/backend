import { integer, pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import usersTable from "./users";
import { USER_ACCOUNT_TYPE } from "@/data/constants";

export const providersEnum = pgEnum("providers", [
  USER_ACCOUNT_TYPE.TRADITIONAL,
  USER_ACCOUNT_TYPE.GOOGLE,
  USER_ACCOUNT_TYPE.FACEBOOK,
  USER_ACCOUNT_TYPE.APPLE,
  USER_ACCOUNT_TYPE.GITHUB,
  USER_ACCOUNT_TYPE.MOBILE_OTP,
]);

const usersToAccountsTable = pgTable("users_to_accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid("user_id").references(() => usersTable.id),
  providerName: providersEnum("provider_name")
    .notNull()
    .default(USER_ACCOUNT_TYPE.TRADITIONAL),
});
export default usersToAccountsTable;
