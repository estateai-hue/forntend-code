import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;