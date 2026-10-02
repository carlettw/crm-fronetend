export type Role = "super_admin" | "boss" | "admin" | "guide" | "driver";
export type Currency = "UZS" | "USD";
export type TourStatus = "draft" | "assigned" | "in_progress" | "completed" | "cancelled";
export type AssignmentRole = "guide" | "driver" | "guide_trainee";
export type FeeStatus = "unpaid" | "paid";
export type OfferStatus = "pending" | "filled" | "cancelled";

export interface GuideProfile {
  level: number;
  tours_completed: number;
  did_apprentice: boolean;
}

export interface User {
  id: number;
  full_name: string;
  phone: string;
  role: Role;
  boss_id: number | null;
  commission_percent: string | null;
  is_active: boolean;
  created_at: string;
  guide_profile?: GuideProfile | null;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface Stop {
  id?: number;
  type: "pickup" | "dropoff";
  name: string;
  map_url?: string | null;
  order_no: number;
  planned_time?: string | null;
}

export interface Tourist {
  id?: number;
  full_name: string;
  phone: string;
  note?: string | null;
}

export interface Assignment {
  id: number;
  user_id: number;
  full_name: string;
  role: AssignmentRole;
  fee_amount: string;
  fee_status: FeeStatus;
}

export interface GuideOffer {
  id: number;
  target_level: number;
  status: OfferStatus;
  filled_by: number | null;
}

export interface AdminTour {
  id: number;
  title: string;
  description: string;
  tour_date: string;
  start_time: string;
  tourists_count: number;
  total_price: string;
  currency: Currency;
  status: TourStatus;
  boss_id: number;
  stops: Stop[];
  tourists: Tourist[];
  assignments: Assignment[];
  guide_offers: GuideOffer[];
}

export interface GuideTour {
  id: number;
  title: string;
  description: string;
  tour_date: string;
  start_time: string;
  status: TourStatus;
  tourists_count: number;
  tourists: Tourist[];
  my_fee: string;
  currency: Currency;
  my_role: "guide" | "guide_trainee";
}

export interface DriverTour {
  id: number;
  title: string;
  tour_date: string;
  start_time: string;
  status: TourStatus;
  stops: Stop[];
  my_fee: string;
  currency: Currency;
}

export interface GuideLevel {
  level: number;
  tours_completed: number;
  did_apprentice: boolean;
  next_level_in: number;
}

export interface GuideOfferListItem {
  id: number;
  tour_id: number;
  title: string;
  tour_date: string;
  start_time: string;
}

export interface ApprenticeOpportunity {
  tour_id: number;
  title: string;
  tour_date: string;
  host_guide_name: string;
}

export interface PendingBonusReview {
  tour_id: number;
  title: string;
  tour_date: string;
  guide: Assignment | null;
  driver: Assignment | null;
  days_since_completed: number;
}

export interface Earnings {
  role: Role;
  level: number | null;
  tours_completed: number | null;
  total_fees: string;
  total_adjustments: string;
  total_paid: string;
  total_unpaid: string;
  currency: Currency;
}

export interface BossAdmin {
  id: number;
  full_name: string;
  phone: string;
  is_active: boolean;
}

export interface BossTourRow {
  id: number;
  title: string;
  tour_date: string;
  status: TourStatus;
  total_price: string;
  total_expenses: string;
  profit: string;
  currency: Currency;
}

export interface PeriodReport {
  period: string;
  tours_count: number;
  total_revenue: string;
  total_expenses: string;
  profit: string;
  currency: Currency;
}

export interface LevelFee {
  level: number;
  fee_amount: string;
  currency: Currency;
}

export interface SuperAdminOverviewRow {
  boss_id: number;
  boss_name: string;
  commission_percent: string;
  tours_count: number;
  total_revenue: string;
  total_expenses: string;
  profit: string;
  platform_fee: string;
  currency?: Currency;
}

export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string }[];
}
