import { z } from "zod";

// Schema for creating a profile
export const createProfileSchema = z.object({
  fullName: z.string().max(100),
  dateOfBirth: z.string().max(50).optional(),
  lastLogin: z.string().datetime().optional(),
  userId: z.string().uuid(),
});

// Schema for updating a profile
export const updateProfileSchema = z.object({
  fullName: z.string().max(100).optional(),
  dateOfBirth: z.string().max(50).optional(),
  lastLogin: z.string().datetime().optional(),
  userId: z.string().uuid().optional(),
});
