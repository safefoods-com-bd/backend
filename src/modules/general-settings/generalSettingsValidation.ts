import { z } from "zod";

export const updateGeneralSettingsSchema = z.object({
  site_title: z.string().max(100).optional(),
  site_logo: z.string().max(255).optional(),
  business_address: z.string().optional(),
  contact_no_1: z.string().max(20).optional(),
  contact_no_2: z.string().max(20).nullable().optional(),
  currency: z.string().max(10).optional(),
  timezone: z.string().max(50).optional(),
  date_format: z.string().max(20).optional(),
  language: z.string().max(10).optional(),
  email_host: z.string().max(100).optional(),
  email_user: z.string().email().max(100).optional(),
  email_from: z.string().email().max(100).optional(),
  email_user_password: z.string().max(100).optional(),
  sms_api_key: z.string().max(100).nullable().optional(),
});
