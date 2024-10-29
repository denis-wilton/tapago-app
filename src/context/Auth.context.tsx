import React, { createContext, useCallback, useState } from "react";

const AuthContext = createContext<ReturnType<typeof useAuthContext>>(
  null as any
);

function useAuthContext() {
  const [user, setUser] = useState<null | { username: string }>(null);
  const isAuthenticated = !!user;

  const login = useCallback(() => {
    setUser({ username: "admin" });
  }, []);

  return { user, login, isAuthenticated };
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
