import { api } from "@/api/client";
import type { ApprenticeOpportunity, GuideLevel, GuideOfferListItem, GuideTour } from "@/types";

export async function fetchGuideTours() {
  const { data } = await api.get<GuideTour[]>("/guide/tours");
  return data;
}
export async function fetchGuideTour(id: number) {
  const { data } = await api.get<GuideTour>(`/guide/tours/${id}`);
  return data;
}
export async function fetchGuideLevel() {
  const { data } = await api.get<GuideLevel>("/guide/me/level");
  return data;
}
export async function fetchGuideOffers() {
  const { data } = await api.get<GuideOfferListItem[]>("/guide/offers");
  return data;
}
export async function acceptOffer(offerId: number) {
  const { data } = await api.post<{ ok: boolean; tour_id: number }>(`/guide/offers/${offerId}/accept`);
  return data;
}
export async function fetchApprenticeOpportunities() {
  const { data } = await api.get<ApprenticeOpportunity[]>("/guide/apprentice-opportunities");
  return data;
}
export async function applyApprentice(tourId: number) {
  const { data } = await api.post<{ ok: boolean; tour_id: number }>(`/guide/apprentice-opportunities/${tourId}/apply`);
  return data;
}
