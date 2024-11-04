import React, { createContext, useCallback, useEffect, useState } from "react";

const AuthContext = createContext<ReturnType<typeof useAuthContext>>(
  null as any
);

function useAuthContext() {
  const [user, setUser] = useState<null | { username: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const login = useCallback(
    async (data: { username: string; password: string }) => {
      try {
        const response = await fetch("http://3.223.4.249/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Failed to login");
        }

        setUser({ username: data.username });
        setError(null); // Clear any previous errors
      } catch (err: any) {
        setError(err.message);
      }
    },
    []
  );

  const register = useCallback(
    async (data: { username: string; password: string; role: string }) => {
      try {
        // Sanitize username
        const sanitizedUsername = data.username.replace(/[^a-z0-9]/g, "");
        if (sanitizedUsername !== data.username) {
          throw new Error(
            "O nome de usuário deve conter apenas letras minúsculas e números"
          );
        }

        // Check if the username is already in use
        const usersResponse = await fetch("http://3.223.4.249/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!usersResponse.ok) {
          const errorData = await usersResponse.text();
          throw new Error(errorData || "Falha ao buscar usuários");
        }

        const users = await usersResponse.json();
        const isUsernameTaken = users.some(
          (user: { username: string }) => user.username === sanitizedUsername
        );

        if (isUsernameTaken) {
          throw new Error("Nome de usuário já está em uso");
        }

        // Proceed with registration if username is not taken
        const response = await fetch("http://3.223.4.249/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, username: sanitizedUsername }),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || "Falha ao registrar");
        }

        setUser({ username: sanitizedUsername });
        setError(null); // Clear any previous errors
      } catch (err: any) {
        setError(err.message);
      }
    },
    []
  );

  return { register, user, login, isAuthenticated, error };
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthContext();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const auth = React.useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return auth;
};

export { AuthContext, useAuthContext, AuthProvider, useAuth };
