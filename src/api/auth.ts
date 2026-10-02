import { api } from "@/api/client";
import type { LoginResponse, User } from "@/types";

export async function login(phone: string, password: string) {
  const { data } = await api.post<LoginResponse>("/auth/login", { phone, password });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  await api.patch("/auth/me/password", { old_password: oldPassword, new_password: newPassword });
}
