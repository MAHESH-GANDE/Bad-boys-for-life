import { AdminRole } from "@prisma/client";

const ALL: AdminRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "CATALOG_MANAGER",
  "ORDER_MANAGER",
  "MARKETING_MANAGER",
  "SUPPORT_AGENT",
];

export const permissions: Record<string, AdminRole[]> = {
  dashboard: ALL,
  products: ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER"],
  inventory: ["SUPER_ADMIN", "ADMIN", "CATALOG_MANAGER", "ORDER_MANAGER"],
  orders: ["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER", "SUPPORT_AGENT"],
  customers: ["SUPER_ADMIN", "ADMIN", "SUPPORT_AGENT", "MARKETING_MANAGER"],
  coupons: ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER"],
  cms: ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER"],
  settings: ["SUPER_ADMIN", "ADMIN"],
  analytics: ["SUPER_ADMIN", "ADMIN", "MARKETING_MANAGER"],
  support: ["SUPER_ADMIN", "ADMIN", "SUPPORT_AGENT"],
};

export function can(role: AdminRole, resource: keyof typeof permissions) {
  return permissions[resource].includes(role);
}
