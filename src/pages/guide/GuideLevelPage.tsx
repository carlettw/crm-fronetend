import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchGuideLevel } from "@/api/guide";
import { Spinner } from "@/components/Spinner";

export function GuideLevelPage() {
  const { data, isLoading } = useQuery({ queryKey: ["guide-level"], queryFn: fetchGuideLevel });

  if (isLoading) return <Spinner />;
  if (!data) return null;

  const progress = Math.min(1, (10 - data.next_level_in) / 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-surface p-5 text-center">
        <p className="text-sm text-muted">Joriy darajangiz</p>
        <p className="font-display text-4xl text-gold">{data.level}</p>
        <p className="mt-1 text-sm text-muted">{data.tours_completed} ta tur tugallangan</p>
      </div>
      {data.level < 7 && (
        <div>
          <div className="flex justify-between text-xs text-muted">
            <span>Keyingi darajagacha</span>
            <span>{data.next_level_in} ta tur qoldi</span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gold"
            />
          </div>
        </div>
      )}
      <div className="rounded-lg border border-border bg-surface p-4 text-sm">
        <p className="text-muted">Hamrohlik (amaliyot)</p>
        <p className="mt-1 font-medium">{data.did_apprentice ? "Bajarilgan" : "Hali bajarilmagan"}</p>
      </div>
    </div>
  );
}
