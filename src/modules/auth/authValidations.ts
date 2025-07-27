import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const verifyOnRegisterSchema = z.object({
  token: z.string(),
  code: z.string(),
  email: z.string().email(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const verifyOnResetPasswordSchema = z.object({
  code: z.string(),
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export const verifyMobileOtpSchema = z.object({
  otp: z.number({ required_error: "otp is required" }),
  phoneNumber: z
    .string({ required_error: "phoneNumber is required" })
    .min(10)
    .max(15),
});
