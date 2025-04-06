import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  isVerified: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  roleId: z.number().min(1),
});
