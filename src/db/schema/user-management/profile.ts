import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import usersTable from "./users";

const profileTable = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Basic Info
  firstName: varchar({ length: 50 }).notNull(),
  lastName: varchar({ length: 50 }).notNull(),
  dateOfBirth: varchar({ length: 50 }),

  // Contact & Location
  phoneNumber: varchar("phone_number", { length: 15 }),
  emergencyContact: jsonb("emergency_contact").default({
    name: "",
    relationship: "",
    phone: "",
  }),
  timezone: varchar("timezone", { length: 50 }).default("UTC"),
  language: varchar("language", { length: 10 }).default("en"),

  // Professional Details
  jobTitle: varchar("job_title", { length: 100 }),
  department: varchar("department", { length: 50 }),
  bio: text("bio"),

  // Security & Preferences
  twoFactorEnabled: boolean("2fa_enabled").default(false),
  notificationPreferences: jsonb("notification_prefs").default({
    email: true,
    sms: false,
    push: true,
  }),

  // System Metadata
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Foreign Key
  userId: uuid("user_id")
    .references(() => usersTable.id)
    .notNull()
    .unique(),
});

export default profileTable;
