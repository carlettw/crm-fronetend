import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { StatCard } from "@/components/StatCard";
import { listAdminTours, fetchPendingBonusReviews } from "@/api/adminTours";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function AdminDashboardPage() {
  const toursQuery = useQuery({ queryKey: ["admin-tours", "all-for-dashboard"], queryFn: () => listAdminTours() });
  const pendingQuery = useQuery({ queryKey: ["pending-bonus-reviews"], queryFn: fetchPendingBonusReviews });

  const todaysTours = toursQuery.data?.filter((t) => t.tour_date === today()).length ?? null;
  const unpaidCount =
    toursQuery.data?.reduce((sum, t) => sum + t.assignments.filter((a) => a.fee_status === "unpaid").length, 0) ?? null;

  return (
    <div>
      <h1 className="font-display text-2xl">Bosh sahifa</h1>
      <p className="mt-1 text-sm text-muted">Bugungi turlar va kutilayotgan ishlar.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Bugungi turlar" value={todaysTours === null ? "—" : String(todaysTours)} />
        <StatCard label="To'lanmagan haqlar" value={unpaidCount === null ? "—" : String(unpaidCount)} tone={unpaidCount ? "expense" : "default"} />
        <StatCard label="Bonus/jarima kutilmoqda" value={pendingQuery.data ? String(pendingQuery.data.length) : "—"} tone={pendingQuery.data?.length ? "gold" : "default"} />
      </div>
      {!!pendingQuery.data?.length && (
        <p className="mt-4 text-sm">
          <Link to="/admin/pending-bonus" className="text-primary-bright">
            {pendingQuery.data.length} ta turga bonus/jarima kiritish kutilmoqda →
          </Link>
        </p>
      )}
    </div>
  );
}
