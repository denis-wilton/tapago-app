import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { AuthProvider } from "./context/Auth.context";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CustomersProvider } from "./context/Customers.context";
import Customer from "./pages/customer/Customer";
import AddCustomer from "./pages/addCustomer/AddCustomer";
import About from "./pages/about/About";
import { BatteryProvider } from "./context/Battery.context";

function RedirectToLogin() {
  return <Navigate to="/login" />;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BatteryProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/index.html" element={<RedirectToLogin />} />
              <Route path="/" element={<ProtectedRoute />}>
                <Route index element={<Home />} />
                <Route path="/cliente/:cpf" element={<Customer />} />
                <Route path="/add-customer" element={<AddCustomer />} />
                <Route path="/about" element={<About />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </AuthProvider>
      </BatteryProvider>
    </QueryClientProvider>
  );
}

const container = document.getElementById("app");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
