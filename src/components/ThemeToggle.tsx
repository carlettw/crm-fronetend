import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/theme/ThemeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Mavzuni almashtirish"
      className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-border text-ink transition-colors hover:bg-paper"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Moon size={16} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex"
          >
            <Sun size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
