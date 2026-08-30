import { cookies } from "next/headers";

export async function getAnonSessionId() {
  const jar = await cookies();
  return jar.get("bb_sid")?.value ?? "anonymous";
}
