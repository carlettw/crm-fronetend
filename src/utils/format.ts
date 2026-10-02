import type { Currency } from "@/types";

const symbolFor: Record<Currency, string> = { UZS: "so'm", USD: "$" };

export function formatMoney(amount: string | number, currency: Currency): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const formatted = new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(value);
  return currency === "USD" ? `$${formatted}` : `${formatted} ${symbolFor.UZS}`;
}

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

export function formatTime(time: string): string {
  return time.slice(0, 5);
}
