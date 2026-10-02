import { api } from "@/api/client";
import type { DriverTour } from "@/types";

export async function fetchDriverTours() {
  const { data } = await api.get<DriverTour[]>("/driver/tours");
  return data;
}
export async function fetchDriverTour(id: number) {
  const { data } = await api.get<DriverTour>(`/driver/tours/${id}`);
  return data;
}
export function mapLinkFor(stop: { map_url?: string | null; name: string }) {
  return stop.map_url || `https://www.google.com/maps?q=${encodeURIComponent(stop.name)}`;
}
