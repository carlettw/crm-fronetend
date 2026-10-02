import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchPendingBonusReviews, submitAdjustment } from "@/api/adminTours";
import { Spinner } from "@/components/Spinner";
import type { Assignment } from "@/types";
import { formatDate, formatMoney } from "@/utils/format";

export function PendingBonusPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["pending-bonus-reviews"], queryFn: fetchPendingBonusReviews });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["pending-bonus-reviews"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl">Bonus/jarima kutilayotganlar</h1>
      <p className="mt-1 text-sm text-muted">Tugaganiga 2+ kun bo'lgan, lekin hali bonus/jarima kiritilmagan turlar.</p>

      <div className="mt-6">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Yuklab bo'lmadi.</p>}
        {data && data.length === 0 && <p className="text-sm text-muted">Hozircha kutilayotgan narsa yo'q.</p>}
        <div className="flex flex-col gap-4">
          {data?.map((review) => (
            <motion.div key={review.tour_id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{review.title}</p>
                <p className="text-xs text-muted">{formatDate(review.tour_date)} · {review.days_since_completed} kun oldin tugagan</p>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                {review.guide && <PersonRow tourId={review.tour_id} label="Git" assignment={review.guide} onSaved={refresh} />}
                {review.driver && <PersonRow tourId={review.tour_id} label="Haydovchi" assignment={review.driver} onSaved={refresh} />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonRow({
  tourId,
  label,
  assignment,
  onSaved,
}: {
  tourId: number;
  label: string;
  assignment: Assignment;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAdjustment(tourId, assignment.user_id, Number(amount), reason);
      setOpen(false);
      setAmount("");
      setReason("");
      onSaved();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-md border border-border p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm">
          <span className="text-muted">{label}:</span> {assignment.full_name}
        </p>
        {!open && (
          <button onClick={() => setOpen(true)} className="text-xs text-primary-bright">
            Bonus/jarima
          </button>
        )}
      </div>
      {open && (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-2">
          <input required type="number" placeholder="Summa (jarima uchun manfiy)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-56 rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary" />
          <input required placeholder="Sabab" value={reason} onChange={(e) => setReason(e.target.value)} className="flex-1 rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary" />
          <button type="submit" disabled={submitting} className="rounded-md bg-gold px-4 py-2 text-sm text-white hover:brightness-110 disabled:opacity-60">
            Saqlash
          </button>
        </form>
      )}
    </div>
  );
}
