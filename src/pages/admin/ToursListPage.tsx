import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listAdminTours } from "@/api/adminTours";
import { Spinner } from "@/components/Spinner";
import type { TourStatus } from "@/types";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

const statusLabel: Record<TourStatus, string> = {
  draft: "Qoralama",
  assigned: "Biriktirilgan",
  in_progress: "Jarayonda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};
const statusFilters: (TourStatus | "all")[] = ["all", "draft", "assigned", "in_progress", "completed", "cancelled"];

export function ToursListPage() {
  const [filter, setFilter] = useState<TourStatus | "all">("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-tours", filter],
    queryFn: () => listAdminTours(filter === "all" ? undefined : filter),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Turlar</h1>
        <Link
          to="/admin/tours/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          + Yangi tur
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === s ? "bg-primary text-white" : "border border-border text-muted hover:bg-paper"
            }`}
          >
            {s === "all" ? "Hammasi" : statusLabel[s]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Turlarni yuklab bo'lmadi.</p>}
        {data && data.length === 0 && <p className="text-sm text-muted">Bu statusda tur yo'q.</p>}
        <ul className="mt-2 flex flex-col gap-2">
          {data?.map((tour) => (
            <li key={tour.id}>
              <Link
                to={`/admin/tours/${tour.id}`}
                className="flex items-center justify-between rounded-lg border border-border bg-surface p-4 hover:border-primary"
              >
                <div>
                  <p className="font-medium">{tour.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(tour.tour_date)} · {formatTime(tour.start_time)} · {tour.tourists_count} turist
                  </p>
                </div>
                <div className="text-right">
                  <p className="tnum text-sm font-medium">{formatMoney(tour.total_price, tour.currency)}</p>
                  <p className="mt-1 text-xs text-muted">{statusLabel[tour.status]}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
