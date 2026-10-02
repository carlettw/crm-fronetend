import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { login as loginRequest, fetchMe } from "@/api/auth";
import { api } from "@/api/client";
import { tokenStore } from "@/auth/tokenStore";
import type { LoginResponse, User } from "@/types";

interface AuthState {
  user: User | null;
  status: "loading" | "signed-in" | "signed-out";
  signIn: (phone: string, password: string) => Promise<User>;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>("loading");

  // On first load, if a refresh token survived a reload, silently
  // exchange it for a fresh access token and restore the session.
  useEffect(() => {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) {
      setStatus("signed-out");
      return;
    }
    api
      .post<LoginResponse>("/auth/refresh", { refresh_token: refreshToken })
      .then(({ data }) => {
        tokenStore.setAccessToken(data.access_token);
        tokenStore.setRefreshToken(data.refresh_token);
        return fetchMe();
      })
      .then((me) => {
        setUser(me);
        setStatus("signed-in");
      })
      .catch(() => {
        tokenStore.clear();
        setStatus("signed-out");
      });
  }, []);

  async function signIn(phone: string, password: string) {
    const tokens = await loginRequest(phone, password);
    tokenStore.setAccessToken(tokens.access_token);
    tokenStore.setRefreshToken(tokens.refresh_token);
    const me = await fetchMe();
    setUser(me);
    setStatus("signed-in");
    return me;
  }

  function signOut() {
    tokenStore.clear();
    setUser(null);
    setStatus("signed-out");
  }

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
