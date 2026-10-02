import { useQuery } from "@tanstack/react-query";
import { fetchOverview } from "@/api/superAdmin";
import { Spinner } from "@/components/Spinner";
import { StatCard } from "@/components/StatCard";
import { formatMoney } from "@/utils/format";

export function OverviewPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["super-admin-overview"], queryFn: fetchOverview });

  const totals = data?.reduce(
    (acc, row) => ({
      revenue: acc.revenue + Number(row.total_revenue),
      profit: acc.profit + Number(row.profit),
      platformFee: acc.platformFee + Number(row.platform_fee),
    }),
    { revenue: 0, profit: 0, platformFee: 0 }
  );

  return (
    <div>
      <h1 className="font-display text-2xl">Umumiy ko'rinish</h1>
      <p className="mt-1 text-sm text-muted">Barcha mijozlar bo'yicha daromad, foyda va platforma ulushi.</p>

      {isLoading && <Spinner />}
      {isError && <p className="mt-4 text-sm text-expense">Ma'lumotni yuklab bo'lmadi.</p>}

      {totals && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Jami daromad" value={formatMoney(totals.revenue, "UZS")} />
          <StatCard label="Jami foyda" value={formatMoney(totals.profit, "UZS")} tone="profit" />
          <StatCard label="Platforma ulushi" value={formatMoney(totals.platformFee, "UZS")} tone="gold" />
        </div>
      )}

      {data && data.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-paper text-left text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Mijoz</th>
                <th className="px-4 py-2 font-medium">Komissiya</th>
                <th className="px-4 py-2 font-medium">Turlar</th>
                <th className="px-4 py-2 font-medium text-right">Daromad</th>
                <th className="px-4 py-2 font-medium text-right">Foyda</th>
                <th className="px-4 py-2 font-medium text-right">Platforma ulushi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.boss_id} className="border-t border-border">
                  <td className="px-4 py-2 font-medium">{row.boss_name}</td>
                  <td className="px-4 py-2 text-muted">{row.commission_percent}%</td>
                  <td className="px-4 py-2">{row.tours_count}</td>
                  <td className="tnum px-4 py-2 text-right">{formatMoney(row.total_revenue, "UZS")}</td>
                  <td className="tnum px-4 py-2 text-right text-profit">{formatMoney(row.profit, "UZS")}</td>
                  <td className="tnum px-4 py-2 text-right text-gold">{formatMoney(row.platform_fee, "UZS")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
