import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthContext";
import { Spinner } from "@/components/Spinner";

export function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status === "signed-out") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
