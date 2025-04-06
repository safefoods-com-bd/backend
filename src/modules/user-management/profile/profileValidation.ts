import { z } from "zod";

// Schema for the emergency_contact JSONB field
const emergencyContactSchema = z.object({
  name: z.string().max(100).optional(),
  relationship: z.string().max(50).optional(),
  phone: z.string().max(15).optional(),
});

// Schema for the notification_prefs JSONB field
const notificationPreferencesSchema = z.object({
  email: z.boolean().optional(),
  sms: z.boolean().optional(),
  push: z.boolean().optional(),
});

// Schema for creating a profile
export const createProfileSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string().max(50),
  dateOfBirth: z.string().datetime().optional(),
  phoneNumber: z.string().max(15).optional(),
  emergencyContact: emergencyContactSchema.optional(),
  timezone: z.string().max(50).optional(),
  language: z.string().max(10).optional(),
  jobTitle: z.string().max(100).optional(),
  department: z.string().max(50).optional(),
  bio: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  notificationPreferences: notificationPreferencesSchema.optional(),
  lastLogin: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  userId: z.number().min(1),
});

// Schema for updating a profile
export const updateProfileSchema = z.object({
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  dateOfBirth: z.string().datetime().optional(),
  phoneNumber: z.string().max(15).optional(),
  emergencyContact: emergencyContactSchema.optional(),
  timezone: z.string().max(50).optional(),
  language: z.string().max(10).optional(),
  jobTitle: z.string().max(100).optional(),
  department: z.string().max(50).optional(),
  bio: z.string().optional(),
  twoFactorEnabled: z.boolean().optional(),
  notificationPreferences: notificationPreferencesSchema.optional(),
  lastLogin: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  userId: z.number().min(1).optional(),
});
