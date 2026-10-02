import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDailyReport } from "@/api/boss";
import { Spinner } from "@/components/Spinner";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/utils/format";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function BossDailyReportPage() {
  const [date, setDate] = useState(today());
  const { data, isLoading, isError } = useQuery({ queryKey: ["boss-daily-report", date], queryFn: () => fetchDailyReport(date) });

  return (
    <div>
      <h1 className="font-display text-2xl">Kunlik hisobot</h1>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mt-4 rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary"
      />
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
