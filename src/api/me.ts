import { api } from "@/api/client";
import type { Earnings } from "@/types";

export async function fetchMyEarnings() {
  const { data } = await api.get<Earnings>("/me/earnings");
  return data;
}
