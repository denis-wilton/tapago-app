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

function RedirectToLogin() {
  return <Navigate to="/login" />;
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/index.html" element={<RedirectToLogin />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<Home />} />
              <Route
                path="/cliente"
                element={<>Oi, eu sou exemplo de uma rota Cliente</>}
              />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
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
