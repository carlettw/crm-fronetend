import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { applyApprentice, fetchApprenticeOpportunities } from "@/api/guide";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";
import { formatDate } from "@/utils/format";

export function GuideApprenticePage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["apprentice-opportunities"], queryFn: fetchApprenticeOpportunities });
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleApply(tourId: number) {
    setBusyId(tourId);
    setMessage(null);
    try {
      await applyApprentice(tourId);
      setMessage("Hamroh sifatida yozildingiz!");
      queryClient.invalidateQueries({ queryKey: ["apprentice-opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["guide-tours"] });
    } catch (err) {
      const detail = (err as AxiosError<ApiError>).response?.data?.detail;
      setMessage(typeof detail === "string" ? detail : "Yozilib bo'lmadi.");
    } finally {
      setBusyId(null);
    }
  }

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-sm text-expense">Yuklab bo'lmadi.</p>;

  return (
    <div>
      <h1 className="font-display text-xl">Hamrohlik (amaliyot)</h1>
      <p className="mt-1 text-sm text-muted">Ertangi turlardan biriga hamroh bo'lib yozilish — pulsiz, faqat amaliyot.</p>
      {message && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-primary-bright">
          {message}
        </motion.p>
      )}
      {!data?.length && <p className="mt-4 text-sm text-muted">Hozircha mos tur yo'q.</p>}
      <StaggerList className="mt-4 flex flex-col gap-3">
        {data?.map((op) => (
          <StaggerItem key={op.tour_id}>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="font-medium">{op.title}</p>
              <p className="mt-1 text-sm text-muted">{formatDate(op.tour_date)} · asosiy git: {op.host_guide_name}</p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={busyId === op.tour_id}
                onClick={() => handleApply(op.tour_id)}
                className="mt-3 w-full rounded-md border border-violet py-2 text-sm font-medium text-violet hover:bg-violet/10 disabled:opacity-60"
              >
                {busyId === op.tour_id ? "Yuborilmoqda..." : "Hamroh bo'lib yozilish"}
              </motion.button>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
