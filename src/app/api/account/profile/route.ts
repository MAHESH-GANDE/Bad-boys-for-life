import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  dateOfBirth: z.string().optional(),
});

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input." }, { status: 400 });
  }

  const data: { name?: string; email?: string | null; dateOfBirth?: Date | null } = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.email !== undefined) data.email = parsed.data.email || null;
  if (parsed.data.dateOfBirth !== undefined) {
    data.dateOfBirth = parsed.data.dateOfBirth ? new Date(parsed.data.dateOfBirth) : null;
  }

  if (data.email) {
    const taken = await prisma.user.findFirst({ where: { email: data.email, NOT: { id: user.id } } });
    if (taken) return NextResponse.json({ error: "That email is already in use." }, { status: 409 });
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return NextResponse.json({
    ok: true,
    user: {
      name: updated.name,
      email: updated.email,
      dateOfBirth: updated.dateOfBirth?.toISOString() ?? null,
    },
  });
}
