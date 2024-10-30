import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import { useEffect } from "react";
import { CustomersProvider } from "../../context/Customers.context";
import { TransactionsProvider } from "../../context/Transactions.context";

export default function ProtectedRoute() {
  const { isAuthenticated, login } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
