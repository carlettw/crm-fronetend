import { useQuery } from "@tanstack/react-query";
import { fetchMyEarnings } from "@/api/me";
import { Spinner } from "@/components/Spinner";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/utils/format";

export function MeEarningsPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["my-earnings"], queryFn: fetchMyEarnings });

  if (isLoading) return <Spinner />;
  if (isError || !data) return <p className="text-sm text-expense">Yuklab bo'lmadi.</p>;

  return (
    <div>
      <h1 className="font-display text-xl">Daromadim</h1>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="Jami haq" value={formatMoney(data.total_fees, data.currency)} />
        <StatCard label="Bonus/jarima" value={formatMoney(data.total_adjustments, data.currency)} tone="gold" />
        <StatCard label="To'langan" value={formatMoney(data.total_paid, data.currency)} tone="profit" />
        <StatCard label="To'lanmagan" value={formatMoney(data.total_unpaid, data.currency)} tone="expense" />
      </div>
      {data.level !== null && (
        <p className="mt-4 text-sm text-muted">Daraja: <span className="font-medium text-gold">{data.level}</span> · {data.tours_completed} tur tugallangan</p>
      )}
    </div>
  );
}
