import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchDriverTours } from "@/api/driver";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

export function DriverToursPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["driver-tours"], queryFn: fetchDriverTours });

  if (isLoading) return <Spinner label="Turlar yuklanmoqda" />;
  if (isError) return <p className="text-sm text-expense">Turlarni yuklab bo'lmadi.</p>;
  if (!data?.length) return <p className="text-sm text-muted">Hozircha sizga biriktirilgan tur yo'q.</p>;

  return (
    <StaggerList className="flex flex-col gap-3">
      {data.map((tour) => (
        <StaggerItem key={tour.id}>
          <Link to={`/driver/tours/${tour.id}`} className="block rounded-lg border border-border bg-surface p-4 transition-colors active:bg-paper">
            <p className="font-display text-lg">{tour.title}</p>
            <p className="mt-1 text-sm text-muted">{formatDate(tour.tour_date)} · {formatTime(tour.start_time)}</p>
            <p className="tnum mt-2 text-sm font-medium text-profit">Sizning haqingiz: {formatMoney(tour.my_fee, tour.currency)}</p>
          </Link>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
