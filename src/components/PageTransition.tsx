import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageTransition({ children, pageKey }: { children: ReactNode; pageKey: string }) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
