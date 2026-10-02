import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listAdminTours } from "@/api/adminTours";
import { markAssignmentPaid } from "@/api/adminTours";
import { Spinner } from "@/components/Spinner";
import { formatDate, formatMoney } from "@/utils/format";
import type { AssignmentRole } from "@/types";

const roleLabel: Record<AssignmentRole, string> = { guide: "Git", driver: "Haydovchi", guide_trainee: "Hamroh" };

export function PayoutsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-tours", "all-for-payouts"], queryFn: () => listAdminTours() });

  const unpaidRows =
    data?.flatMap((tour) =>
      tour.assignments
        .filter((a) => a.fee_status === "unpaid")
        .map((a) => ({ tour, assignment: a }))
    ) ?? [];

  async function pay(tourId: number, assignmentId: number) {
    await markAssignmentPaid(tourId, assignmentId);
    queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl">To'lanmagan haqlar</h1>
      <p className="mt-1 text-sm text-muted">Barcha turlar bo'yicha git va haydovchilarning hali to'lanmagan haqi.</p>

      <div className="mt-6">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Ma'lumotni yuklab bo'lmadi.</p>}
        {!isLoading && unpaidRows.length === 0 && <p className="text-sm text-muted">To'lanmagan haq yo'q — hammasi tekis.</p>}
        <div className="flex flex-col gap-2">
          {unpaidRows.map(({ tour, assignment }) => (
            <div key={assignment.id} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
              <div>
                <Link to={`/admin/tours/${tour.id}`} className="text-sm font-medium text-primary-bright">
                  {tour.title}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {formatDate(tour.tour_date)} · {assignment.full_name} ({roleLabel[assignment.role]})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="tnum text-sm font-medium text-expense">{formatMoney(assignment.fee_amount, tour.currency)}</span>
                <button
                  onClick={() => pay(tour.id, assignment.id)}
                  className="rounded-md border border-border px-3 py-1 text-xs hover:bg-paper"
                >
                  To'landi deb belgilash
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
