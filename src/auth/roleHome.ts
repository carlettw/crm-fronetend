import type { Role } from "@/types";

export function homePathForRole(role: Role): string {
  switch (role) {
    case "super_admin":
      return "/super-admin";
    case "boss":
      return "/boss";
    case "admin":
      return "/admin";
    case "guide":
      return "/guide/tours";
    case "driver":
      return "/driver/tours";
  }
}
