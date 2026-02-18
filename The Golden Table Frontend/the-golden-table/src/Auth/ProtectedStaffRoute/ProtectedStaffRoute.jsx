import { Navigate, Outlet } from "react-router-dom";
import { useStaffAuth } from "../../Context/StaffAuthContext/StaffAuthContext";

function ProtectedStaffRoute() {
  const { isAuthenticated, loading } = useStaffAuth();

  // ⏳ Wait until auth check completes
  if (loading) {
    return <p>Checking staff authentication...</p>;
  }

  // 🔒 Not logged in → redirect
  if (!isAuthenticated) {
    return <Navigate to="/staff/login" replace />;
  }

  // ✅ Authenticated → allow access
  return <Outlet />;
}

export default ProtectedStaffRoute;
