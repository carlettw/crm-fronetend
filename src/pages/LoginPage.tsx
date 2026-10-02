import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthContext";
import { homePathForRole } from "@/auth/roleHome";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { ApiError } from "@/types";
import type { AxiosError } from "axios";

export function LoginPage() {
  const { signIn, user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (status === "signed-in" && user) {
    const from = (location.state as { from?: Location })?.from?.pathname;
    return <Navigate to={from ?? homePathForRole(user.role)} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const me = await signIn(phone, password);
      navigate(homePathForRole(me.role), { replace: true });
    } catch (err) {
      const detail = (err as AxiosError<ApiError>).response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Telefon yoki parol noto'g'ri");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4 text-ink">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <p className="mb-8 text-center font-display text-2xl">Turfirma boshqaruvi</p>
        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <label className="mb-1 block text-sm text-muted" htmlFor="phone">
            Telefon raqam
          </label>
          <input
            id="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+998901234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-4 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          <label className="mb-1 block text-sm text-muted" htmlFor="password">
            Parol
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-sm text-expense"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={submitting}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition-colors hover:brightness-110 disabled:opacity-60"
          >
            {submitting ? "Kirilmoqda..." : "Kirish"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
