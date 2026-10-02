import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "profit" | "expense" | "gold";
}) {
  const valueColor =
    tone === "profit" ? "text-profit" : tone === "expense" ? "text-expense" : tone === "gold" ? "text-gold" : "text-ink";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-border bg-surface p-4"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className={`tnum mt-1 font-display text-2xl ${valueColor}`}>{value}</p>
    </motion.div>
  );
}
