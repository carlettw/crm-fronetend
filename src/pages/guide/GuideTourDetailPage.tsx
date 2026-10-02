import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchGuideTour } from "@/api/guide";
import { Spinner } from "@/components/Spinner";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

export function GuideTourDetailPage() {
  const { id } = useParams();
  const tourId = Number(id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["guide-tour", tourId],
    queryFn: () => fetchGuideTour(tourId),
    enabled: Number.isFinite(tourId),
  });

  if (isLoading) return <Spinner label="Yuklanmoqda" />;
  if (isError || !data) return <p className="text-sm text-expense">Bu tur topilmadi.</p>;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-display text-xl">{data.title}</p>
        <p className="mt-1 text-sm text-muted">{formatDate(data.tour_date)} · {formatTime(data.start_time)}</p>
      </div>
      <p className="text-sm">{data.description}</p>
      <div className="rounded-lg border border-border bg-surface p-4">
        <p className="text-sm text-muted">{data.my_role === "guide_trainee" ? "Holat" : "Sizning haqingiz"}</p>
        <p className="tnum font-display text-xl text-profit">
          {data.my_role === "guide_trainee" ? "Amaliyot (pulsiz)" : formatMoney(data.my_fee, data.currency)}
        </p>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Turistlar ({data.tourists_count})</p>
        <ul className="flex flex-col gap-2">
          {data.tourists.map((t) => (
            <li key={t.id} className="rounded-lg border border-border bg-surface p-3">
              <p className="text-sm font-medium">{t.full_name}</p>
              <a href={`tel:${t.phone}`} className="text-sm text-primary-bright">{t.phone}</a>
              {t.note && <p className="mt-1 text-xs text-muted">{t.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
