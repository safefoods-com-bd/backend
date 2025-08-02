import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string({ required_error: "Password is required" }).min(8),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .min(8),
});

export const verifyOnRegisterSchema = z.object({
  token: z.string({ required_error: "Token is required" }),
  code: z.string({ required_error: "Code is required" }),
  email: z.string({ required_error: "Email is required" }).email(),
});

export const loginUserSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string({ required_error: "Password is required" }).min(8),
});

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
});

export const verifyOnResetPasswordSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z.string({ required_error: "Password is required" }).min(8),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .min(8),
});

export const verifyForgotPasswordOtpVerificationSchema = z.object({
  otp: z.number({ required_error: "OTP is required" }),
  email: z.string({ required_error: "Email is required" }).email(),
});

export const verifyMobileOtpSchema = z.object({
  otp: z.number({ required_error: "otp is required" }),
  phoneNumber: z
    .string({ required_error: "phoneNumber is required" })
    .min(10)
    .max(15),
});
