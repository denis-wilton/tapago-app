import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
}
