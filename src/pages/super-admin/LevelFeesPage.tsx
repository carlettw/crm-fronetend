import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { listLevelFees, setLevelFee } from "@/api/superAdmin";
import { Spinner } from "@/components/Spinner";
import { formatMoney } from "@/utils/format";

const levels = [1, 2, 3, 4, 5, 6, 7];

export function LevelFeesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["level-fees"], queryFn: listLevelFees });

  return (
    <div>
      <h1 className="font-display text-2xl">Daraja haqlari</h1>
      <p className="mt-1 text-sm text-muted">Har bir git darajasi uchun tur boshiga to'lanadigan haq.</p>

      {isLoading && <Spinner />}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {levels.map((level) => {
          const existing = data?.find((f) => f.level === level);
          return (
            <LevelRow
              key={level}
              level={level}
              fee={existing}
              onSaved={() => queryClient.invalidateQueries({ queryKey: ["level-fees"] })}
            />
          );
        })}
      </div>
    </div>
  );
}

function LevelRow({
  level,
  fee,
  onSaved,
}: {
  level: number;
  fee?: { fee_amount: string; currency: "UZS" | "USD" };
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(fee?.fee_amount ?? "");
  const [currency, setCurrency] = useState<"UZS" | "USD">(fee?.currency ?? "UZS");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await setLevelFee(level, Number(amount), currency);
      setEditing(false);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
    >
      <div>
        <p className="font-display text-lg">{level}-daraja</p>
        {!editing && (
          <p className="tnum mt-1 text-sm text-muted">{fee ? formatMoney(fee.fee_amount, fee.currency) : "Belgilanmagan"}</p>
        )}
      </div>
      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-28 rounded-md border border-border bg-paper px-2 py-1 text-sm outline-none focus:border-primary"
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value as "UZS" | "USD")} className="rounded-md border border-border bg-paper px-2 py-1 text-sm">
            <option value="UZS">UZS</option>
            <option value="USD">USD</option>
          </select>
          <button disabled={saving} onClick={save} className="rounded-md bg-primary px-3 py-1 text-xs text-white hover:brightness-110 disabled:opacity-60">
            Saqlash
          </button>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-paper">
          Tahrirlash
        </button>
      )}
    </motion.div>
  );
}
