import { api } from "@/api/client";
import type { BossAdmin, BossTourRow, PeriodReport } from "@/types";

export async function listMyAdmins() {
  const { data } = await api.get<BossAdmin[]>("/boss/admins");
  return data;
}
export async function createAdmin(full_name: string, phone: string, password: string) {
  const { data } = await api.post<BossAdmin>("/boss/admins", { full_name, phone, password });
  return data;
}
export async function updateAdmin(id: number, input: { full_name?: string; is_active?: boolean; password?: string }) {
  const { data } = await api.patch<BossAdmin>(`/boss/admins/${id}`, input);
  return data;
}

export async function fetchMyTours() {
  const { data } = await api.get<BossTourRow[]>("/boss/tours");
  return data;
}

export async function fetchDailyReport(reportDate: string) {
  const { data } = await api.get<PeriodReport>("/boss/reports/daily", { params: { report_date: reportDate } });
  return data;
}
export async function fetchMonthlyReport(year: number, month: number) {
  const { data } = await api.get<PeriodReport>("/boss/reports/monthly", { params: { year, month } });
  return data;
}
