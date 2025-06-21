import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const refreshTokensTable = pgTable("refresh_tokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  token: text().notNull(),
  userId: uuid("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  deviceInfo: varchar({ length: 255 }).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
export default refreshTokensTable;

// to do : add indexes on token, userId, expiresAt
