import { api } from "@/api/client";
import type { LevelFee, Role, SuperAdminOverviewRow, User } from "@/types";

export interface SuperAdminCreateUserInput {
  full_name: string;
  phone: string;
  password: string;
  role: Role;
  boss_id?: number;
  commission_percent?: number;
}
export interface SuperAdminUpdateUserInput {
  full_name?: string;
  is_active?: boolean;
  password?: string;
  commission_percent?: number;
}

export async function listAllUsers(params?: { role?: Role; boss_id?: number }) {
  const { data } = await api.get<User[]>("/super-admin/users", { params });
  return data;
}
export async function createAnyUser(input: SuperAdminCreateUserInput) {
  const { data } = await api.post<User>("/super-admin/users", input);
  return data;
}
export async function updateAnyUser(id: number, input: SuperAdminUpdateUserInput) {
  const { data } = await api.patch<User>(`/super-admin/users/${id}`, input);
  return data;
}

export async function listLevelFees() {
  const { data } = await api.get<LevelFee[]>("/super-admin/level-fees");
  return data;
}
export async function setLevelFee(level: number, feeAmount: number, currency: string) {
  const { data } = await api.put<LevelFee>(`/super-admin/level-fees/${level}`, {
    fee_amount: feeAmount,
    currency,
  });
  return data;
}

export async function listAllTours(params?: { status?: string; boss_id?: number }) {
  const { data } = await api.get("/super-admin/tours", { params });
  return data;
}

export async function fetchOverview() {
  const { data } = await api.get<SuperAdminOverviewRow[]>("/super-admin/reports/overview");
  return data;
}
