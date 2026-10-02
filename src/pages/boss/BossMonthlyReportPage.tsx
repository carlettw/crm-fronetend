import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMonthlyReport } from "@/api/boss";
import { Spinner } from "@/components/Spinner";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/utils/format";

const now = new Date();

export function BossMonthlyReportPage() {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["boss-monthly-report", year, month],
    queryFn: () => fetchMonthlyReport(year, month),
  });

  return (
    <div>
      <h1 className="font-display text-2xl">Oylik hisobot</h1>
      <div className="mt-4 flex gap-2">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}-oy
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-28 rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>
      <div className="mt-6">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Yuklab bo'lmadi.</p>}
        {data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <StatCard label="Turlar soni" value={String(data.tours_count)} />
            <StatCard label="Daromad" value={formatMoney(data.total_revenue, data.currency)} />
            <StatCard label="Xarajat" value={formatMoney(data.total_expenses, data.currency)} tone="expense" />
            <StatCard label="Foyda" value={formatMoney(data.profit, data.currency)} tone="profit" />
          </div>
        )}
      </div>
    </div>
  );
}
