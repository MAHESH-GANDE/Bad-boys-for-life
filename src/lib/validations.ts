import { z } from "zod";

export const mobileSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number.");

export const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode.");

export const addressSchema = z.object({
  fullName: z.string().min(2).max(80),
  mobile: mobileSchema,
  house: z.string().min(1).max(80),
  street: z.string().min(3).max(120),
  landmark: z.string().max(80).optional(),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  pincode: pincodeSchema,
});

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter the 6-digit code.");

export const couponCodeSchema = z.string().trim().min(3).max(24).toUpperCase();
