import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import type { Role } from "@/types";
import { homePathForRole } from "@/auth/roleHome";

/**
 * Convenience-only: hides pages that don't match the signed-in role
 * so people don't land on a screen meant for someone else. This is
 * NOT the real access boundary — the backend enforces that per
 * turfirma-platforma-plan.md §2 (role-specific DTOs, row-level checks).
 */
export function RoleRoute({ allow }: { allow: Role[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) {
    return <Navigate to={homePathForRole(user.role)} replace />;
  }
  return <Outlet />;
}
