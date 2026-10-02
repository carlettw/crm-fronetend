import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchGuideTours } from "@/api/guide";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

export function GuideToursPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["guide-tours"], queryFn: fetchGuideTours });

  if (isLoading) return <Spinner label="Turlar yuklanmoqda" />;
  if (isError) return <p className="text-sm text-expense">Turlarni yuklab bo'lmadi.</p>;
  if (!data?.length) return <p className="text-sm text-muted">Hozircha sizga biriktirilgan tur yo'q.</p>;

  return (
    <StaggerList className="flex flex-col gap-3">
      {data.map((tour) => (
        <StaggerItem key={tour.id}>
          <Link to={`/guide/tours/${tour.id}`} className="block rounded-lg border border-border bg-surface p-4 transition-colors active:bg-paper">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg">{tour.title}</p>
              {tour.my_role === "guide_trainee" && (
                <span className="rounded-full bg-violet/10 px-2 py-0.5 text-xs text-violet">Hamroh</span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatDate(tour.tour_date)} · {formatTime(tour.start_time)} · {tour.tourists_count} turist
            </p>
            <p className="tnum mt-2 text-sm font-medium text-profit">
              {tour.my_role === "guide_trainee" ? "Amaliyot (pulsiz)" : `Sizning haqingiz: ${formatMoney(tour.my_fee, tour.currency)}`}
            </p>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
