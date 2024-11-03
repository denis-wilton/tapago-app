import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import { useEffect } from "react";
import { CustomersProvider } from "../../context/Customers.context";
import { TransactionsProvider } from "../../context/Transactions.context";

export default function ProtectedRoute() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Salva a rota atual como um parâmetro de consulta antes de redirecionar para login
      const currentPath = location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CustomersProvider>
      <TransactionsProvider>
        <Outlet />
      </TransactionsProvider>
    </CustomersProvider>
  );
}
