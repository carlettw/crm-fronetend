import { useQuery } from "@tanstack/react-query";
import { fetchDailyReport, listMyAdmins } from "@/api/boss";
import { StatCard } from "@/components/StatCard";
import { Spinner } from "@/components/Spinner";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function BossDashboardPage() {
  const dailyQuery = useQuery({ queryKey: ["boss-daily", today()], queryFn: () => fetchDailyReport(today()) });
  const adminsQuery = useQuery({ queryKey: ["boss-admins"], queryFn: listMyAdmins });

  return (
    <div>
      <h1 className="font-display text-2xl">Umumiy ko'rinish</h1>
      <p className="mt-1 text-sm text-muted">Bugungi holat.</p>
      <div className="mt-6">
        {(dailyQuery.isLoading || adminsQuery.isLoading) && <Spinner />}
        {dailyQuery.data && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <StatCard label="Bugungi turlar" value={String(dailyQuery.data.tours_count)} />
            <StatCard label="Aylanma" value={fmt(dailyQuery.data.total_revenue, dailyQuery.data.currency)} />
            <StatCard label="Foyda" value={fmt(dailyQuery.data.profit, dailyQuery.data.currency)} tone="profit" />
            <StatCard label="Adminlar" value={String(adminsQuery.data?.length ?? "—")} />
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(v: string, c: "UZS" | "USD") {
  const n = new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 0 }).format(Number(v));
  return c === "USD" ? `$${n}` : `${n} so'm`;
}
