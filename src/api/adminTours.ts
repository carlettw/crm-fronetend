import { api } from "@/api/client";
import type { AdminTour, Currency, PendingBonusReview, Stop, TourStatus, Tourist } from "@/types";

export interface TourCreateInput {
  title: string;
  description: string;
  tour_date: string;
  start_time: string;
  tourists_count: number;
  total_price: number;
  currency: Currency;
  stops: Omit<Stop, "id">[];
  tourists: Omit<Tourist, "id">[];
  driver?: { user_id: number; fee_amount: number };
  guide?: { user_id: number; fee_amount: number };
  guide_offer_level?: number | null;
}

export async function listAdminTours(status?: TourStatus) {
  const { data } = await api.get<AdminTour[]>("/admin/tours", { params: status ? { status } : undefined });
  return data;
}
export async function getAdminTour(id: number) {
  const { data } = await api.get<AdminTour>(`/admin/tours/${id}`);
  return data;
}
export async function createTour(input: TourCreateInput) {
  const { data } = await api.post<AdminTour>("/admin/tours", input);
  return data;
}
export async function updateTourStatus(id: number, status: TourStatus) {
  const { data } = await api.patch<AdminTour>(`/admin/tours/${id}/status`, { status });
  return data;
}
export async function addStop(id: number, stop: Omit<Stop, "id">) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${id}/stops`, stop);
  return data;
}
export async function addTourist(id: number, tourist: Omit<Tourist, "id">) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${id}/tourists`, tourist);
  return data;
}
export async function assignDriver(id: number, userId: number, feeAmount: number) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${id}/assign-driver`, { user_id: userId, fee_amount: feeAmount });
  return data;
}
export async function assignGuide(id: number, userId: number, feeAmount: number) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${id}/assign-guide`, { user_id: userId, fee_amount: feeAmount });
  return data;
}
export async function sendGuideOffer(id: number, targetLevel: number) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${id}/guide-offer`, { target_level: targetLevel });
  return data;
}
export async function markAssignmentPaid(tourId: number, assignmentId: number) {
  const { data } = await api.patch<AdminTour>(`/admin/tours/${tourId}/assignments/${assignmentId}/pay`);
  return data;
}
export async function fetchPendingBonusReviews() {
  const { data } = await api.get<PendingBonusReview[]>("/admin/pending-bonus-reviews");
  return data;
}
export async function submitAdjustment(tourId: number, userId: number, amount: number, reason: string) {
  const { data } = await api.post<AdminTour>(`/admin/tours/${tourId}/adjustments`, { user_id: userId, amount, reason });
  return data;
}
