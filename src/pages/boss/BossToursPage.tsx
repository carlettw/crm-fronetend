import { useQuery } from "@tanstack/react-query";
import { fetchMyTours } from "@/api/boss";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import type { TourStatus } from "@/types";
import { formatDate, formatMoney } from "@/utils/format";

const statusLabel: Record<TourStatus, string> = {
  draft: "Qoralama",
  assigned: "Biriktirilgan",
  in_progress: "Jarayonda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};

export function BossToursPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["boss-tours"], queryFn: fetchMyTours });

  return (
    <div>
      <h1 className="font-display text-2xl">Turlar (moliya)</h1>
      <p className="mt-1 text-sm text-muted">Narx, xarajat va foyda — kim nechchi haq olgani ko'rinmaydi.</p>

      <div className="mt-6">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Yuklab bo'lmadi.</p>}
        <StaggerList className="flex flex-col gap-2">
          {data?.map((tour) => (
            <StaggerItem key={tour.id}>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                <div>
                  <p className="font-medium">{tour.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(tour.tour_date)} · {statusLabel[tour.status]}
                  </p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <p className="text-xs text-muted">Narx</p>
                    <p className="tnum text-sm font-medium">{formatMoney(tour.total_price, tour.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Xarajat</p>
                    <p className="tnum text-sm font-medium text-expense">{formatMoney(tour.total_expenses, tour.currency)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Foyda</p>
                    <p className="tnum text-sm font-medium text-profit">{formatMoney(tour.profit, tour.currency)}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </div>
  );
}
