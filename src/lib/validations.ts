import { z } from "zod";

/** Accept +91, spaces, dashes — normalize to 10-digit Indian mobile. */
export function normalizeMobileInput(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return digits;
}

export function normalizeOtpInput(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 6);
}

export const mobileSchema = z
  .string()
  .trim()
  .transform(normalizeMobileInput)
  .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."));

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

export const otpSchema = z
  .string()
  .trim()
  .transform(normalizeOtpInput)
  .pipe(z.string().regex(/^\d{6}$/, "Enter the 6-digit code."));

export const couponCodeSchema = z.string().trim().min(3).max(24).toUpperCase();
