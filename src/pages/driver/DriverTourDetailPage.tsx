import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchDriverTour, mapLinkFor } from "@/api/driver";
import { Spinner } from "@/components/Spinner";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

export function DriverTourDetailPage() {
  const { id } = useParams();
  const tourId = Number(id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["driver-tour", tourId],
    queryFn: () => fetchDriverTour(tourId),
    enabled: Number.isFinite(tourId),
  });

  if (isLoading) return <Spinner label="Yuklanmoqda" />;
  if (isError || !data) return <p className="text-sm text-expense">Bu tur topilmadi.</p>;

  const stopLabel: Record<string, string> = { pickup: "Olib ketish", dropoff: "Tushirish" };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-display text-xl">{data.title}</p>
        <p className="mt-1 text-sm text-muted">{formatDate(data.tour_date)} · {formatTime(data.start_time)}</p>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-muted">Sizning haqingiz</p>
        <p className="tnum font-display text-xl text-profit">{formatMoney(data.my_fee, data.currency)}</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Yo'nalish</p>
        <ol className="flex flex-col gap-2">
          {[...data.stops].sort((a, b) => a.order_no - b.order_no).map((stop) => (
            <li key={stop.order_no} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-xs text-muted">{stopLabel[stop.type] ?? stop.type}</p>
              <p className="text-sm font-medium">{stop.name}</p>
              {stop.planned_time && <p className="text-xs text-muted">{formatTime(stop.planned_time)}</p>}
              <a href={mapLinkFor(stop)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sm text-primary-bright">
                Xaritada ko'rish
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
