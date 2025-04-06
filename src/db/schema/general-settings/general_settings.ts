import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

const generalSettingsTable = pgTable("general_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  // Business Info
  site_title: varchar("site_title", { length: 100 }).notNull(),
  site_logo: varchar("site_logo", { length: 255 }).notNull(),
  business_address: text("business_address").notNull(),
  contact_no_1: varchar("contact_no_1", { length: 20 }).notNull(),
  contact_no_2: varchar("contact_no_2", { length: 20 }),

  // Regional Settings
  currency: varchar("currency", { length: 10 }).notNull().default("Tk"),
  timezone: varchar("timezone", { length: 50 }).notNull().default("UTC"),
  date_format: varchar("date_format", { length: 20 })
    .notNull()
    .default("YYYY-MM-DD"),
  language: varchar("language", { length: 10 }).notNull().default("en"),

  // Email/SMS
  email_host: varchar("email_host", { length: 100 }).notNull(),
  email_user: varchar("email_user", { length: 100 }).notNull(),
  email_from: varchar("email_from", { length: 100 }).notNull(),
  email_user_password: varchar("email_password", { length: 100 }).notNull(),
  sms_api_key: varchar("sms_api_key", { length: 100 }),
});

export default generalSettingsTable;
