import { Navigate, Outlet } from "react-router-dom";
import { getRoleDashboardPath } from "../../config/demoAuth.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate replace to={getRoleDashboardPath(user.role)} />;
  }

  return children || <Outlet />;
}
