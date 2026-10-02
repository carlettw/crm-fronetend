import { motion } from "framer-motion";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return <motion.li variants={item}>{children}</motion.li>;
}
