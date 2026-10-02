import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAllTours } from "@/api/superAdmin";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import type { AdminTour, TourStatus } from "@/types";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

const statusLabel: Record<TourStatus, string> = {
  draft: "Qoralama",
  assigned: "Biriktirilgan",
  in_progress: "Jarayonda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};
const statusFilters: (TourStatus | "all")[] = ["all", "draft", "assigned", "in_progress", "completed", "cancelled"];

export function SuperAdminToursPage() {
  const [filter, setFilter] = useState<TourStatus | "all">("all");
  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-tours", filter],
    queryFn: () => listAllTours(filter === "all" ? undefined : { status: filter }) as Promise<AdminTour[]>,
  });

  return (
    <div>
      <h1 className="font-display text-2xl">Barcha turlar</h1>
      <p className="mt-1 text-sm text-muted">Barcha mijozlarning turlari — faqat ko'rish uchun.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filter === s ? "bg-primary text-white" : "border border-border text-muted hover:bg-paper"
            }`}
          >
            {s === "all" ? "Hammasi" : statusLabel[s]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {isLoading && <Spinner />}
        <StaggerList className="flex flex-col gap-2">
          {data?.map((tour) => (
            <StaggerItem key={tour.id}>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                <div>
                  <p className="font-medium">{tour.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(tour.tour_date)} · {formatTime(tour.start_time)} · mijoz #{tour.boss_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-medium">{formatMoney(tour.total_price, tour.currency)}</p>
                  <p className="mt-1 text-xs text-muted">{statusLabel[tour.status]}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerList>
      </div>
    </div>
  );
}
