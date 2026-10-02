import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "@/auth/tokenStore";
import type { LoginResponse } from "@/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One shared in-flight refresh promise so parallel 401s don't each
// trigger their own /auth/refresh call.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post<LoginResponse>(`${BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    });
    tokenStore.setAccessToken(data.access_token);
    tokenStore.setRefreshToken(data.refresh_token);
    return data.access_token;
  } catch {
    tokenStore.clear();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retried) {
      original._retried = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
      // refresh failed: send the app back to login
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);
