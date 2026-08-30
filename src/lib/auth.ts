import { createHash, randomInt, randomBytes } from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { mobileSchema, otpSchema } from "./validations";
import { AdminRole } from "@prisma/client";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-only-change-me-use-32-chars-min!!",
);

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function generateOtp() {
  if (process.env.NODE_ENV !== "production") return "123456";
  return String(randomInt(100000, 999999));
}

export async function requestOtp(mobileRaw: string) {
  const mobile = mobileSchema.parse(mobileRaw);
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60_000);
  await prisma.otpChallenge.create({
    data: {
      mobile,
      codeHash: sha256(otp),
      expiresAt,
    },
  });
  // SMS provider seam. In development the OTP is deterministic.
  return {
    ok: true,
    mobile,
    expiresIn: 300,
    ...(process.env.NODE_ENV !== "production" ? { devOtp: otp } : {}),
  };
}

export async function verifyOtp(mobileRaw: string, codeRaw: string) {
  const mobile = mobileSchema.parse(mobileRaw);
  const code = otpSchema.parse(codeRaw);
  const challenge = await prisma.otpChallenge.findFirst({
    where: { mobile, consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!challenge) throw new Error("Code expired. Request a new one.");
  if (challenge.attempts >= 5) throw new Error("Too many attempts. Request a new code.");
  if (challenge.codeHash !== sha256(code)) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    throw new Error("That code does not match.");
  }
  await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true } });

  const referralCode = `BB${mobile.slice(-6)}`;
  const user = await prisma.user.upsert({
    where: { mobile },
    update: {},
    create: { mobile, referralCode },
  });
  await prisma.wishlist.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
  await prisma.loyaltyAccount.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, enabled: false },
  });

  const token = await new SignJWT({ sub: user.id, role: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  const jar = await cookies();
  jar.set("bb_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return user;
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get("bb_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub) return null;
    return prisma.user.findUnique({ where: { id: payload.sub } });
  } catch {
    return null;
  }
}

export async function logoutCustomer() {
  const jar = await cookies();
  jar.delete("bb_session");
}

export async function loginAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin || !admin.active) throw new Error("Invalid credentials.");
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new Error("Invalid credentials.");
  const token = await new SignJWT({ sub: admin.id, role: admin.role, kind: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);
  const jar = await cookies();
  jar.set("bb_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return admin;
}

export async function getAdmin() {
  const jar = await cookies();
  const token = jar.get("bb_admin")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.kind !== "admin" || !payload.sub) return null;
    return prisma.adminUser.findUnique({ where: { id: payload.sub } });
  } catch {
    return null;
  }
}

export async function requireAdmin(roles?: AdminRole[]) {
  const admin = await getAdmin();
  if (!admin) throw new Error("UNAUTHORIZED");
  if (roles && !roles.includes(admin.role)) throw new Error("FORBIDDEN");
  return admin;
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete("bb_admin");
}

export function randomSessionId() {
  return randomBytes(16).toString("hex");
}
