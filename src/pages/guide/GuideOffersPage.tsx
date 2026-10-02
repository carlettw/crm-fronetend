import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { acceptOffer, fetchGuideOffers } from "@/api/guide";
import { Spinner } from "@/components/Spinner";
import { StaggerItem, StaggerList } from "@/components/StaggerList";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";
import { formatDate, formatTime } from "@/utils/format";

export function GuideOffersPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["guide-offers"], queryFn: fetchGuideOffers });
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAccept(offerId: number) {
    setBusyId(offerId);
    setMessage(null);
    try {
      await acceptOffer(offerId);
      setMessage("Tur sizga biriktirildi!");
      queryClient.invalidateQueries({ queryKey: ["guide-offers"] });
      queryClient.invalidateQueries({ queryKey: ["guide-tours"] });
    } catch (err) {
      const detail = (err as AxiosError<ApiError>).response?.data?.detail;
      setMessage(typeof detail === "string" ? detail : "Qabul qilib bo'lmadi.");
    } finally {
      setBusyId(null);
    }
  }

  if (isLoading) return <Spinner />;
  if (isError) return <p className="text-sm text-expense">Yuklab bo'lmadi.</p>;

  return (
    <div>
      <h1 className="font-display text-xl">Ochiq takliflar</h1>
      <p className="mt-1 text-sm text-muted">Darajangizga mos turlar — kim birinchi qabul qilsa, o'shaniki.</p>
      {message && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-primary-bright">
          {message}
        </motion.p>
      )}
      {!data?.length && <p className="mt-4 text-sm text-muted">Hozircha taklif yo'q.</p>}
      <StaggerList className="mt-4 flex flex-col gap-3">
        {data?.map((offer) => (
          <StaggerItem key={offer.id}>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="font-medium">{offer.title}</p>
              <p className="mt-1 text-sm text-muted">{formatDate(offer.tour_date)} · {formatTime(offer.start_time)}</p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                disabled={busyId === offer.id}
                onClick={() => handleAccept(offer.id)}
                className="mt-3 w-full rounded-md bg-primary py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
              >
                {busyId === offer.id ? "Yuborilmoqda..." : "Qabul qilish"}
              </motion.button>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>
    </div>
  );
}
