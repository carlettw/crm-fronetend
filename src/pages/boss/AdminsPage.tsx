import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createAdmin, listMyAdmins, updateAdmin } from "@/api/boss";
import { Spinner } from "@/components/Spinner";
import type { ApiError, BossAdmin } from "@/types";
import type { AxiosError } from "axios";

export function AdminsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading, isError } = useQuery({ queryKey: ["boss-admins"], queryFn: listMyAdmins });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["boss-admins"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Adminlar</h1>
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowForm((v) => !v)} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110">
          {showForm ? "Bekor qilish" : "+ Yangi admin"}
        </motion.button>
      </div>

      {showForm && <CreateForm onCreated={() => { invalidate(); setShowForm(false); }} />}

      <div className="mt-6">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Yuklab bo'lmadi.</p>}
        {data && data.length === 0 && <p className="text-sm text-muted">Hali admin qo'shilmagan.</p>}
        <div className="flex flex-col gap-2">
          {data?.map((a) => (
            <Row key={a.id} admin={a} onUpdated={invalidate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ admin, onUpdated }: { admin: BossAdmin; onUpdated: () => void }) {
  const [busy, setBusy] = useState(false);
  async function toggle() {
    setBusy(true);
    try {
      await updateAdmin(admin.id, { is_active: !admin.is_active });
      onUpdated();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      <div>
        <p className="font-medium">{admin.full_name}</p>
        <p className="text-sm text-muted">{admin.phone}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={admin.is_active ? "text-sm text-profit" : "text-sm text-expense"}>{admin.is_active ? "Faol" : "O'chirilgan"}</span>
        <button disabled={busy} onClick={toggle} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-paper disabled:opacity-50">
          {admin.is_active ? "O'chirish" : "Yoqish"}
        </button>
      </div>
    </div>
  );
}

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createAdmin(fullName, phone, password);
      setFullName("");
      setPhone("");
      setPassword("");
      onCreated();
    } catch (err) {
      const detail = (err as AxiosError<ApiError>).response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      onSubmit={handleSubmit}
      className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4"
    >
      <input required placeholder="To'liq ism" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary sm:col-span-2" />
      <input required placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary" />
      <input required minLength={6} type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-border bg-paper px-3 py-2 text-sm outline-none focus:border-primary" />
      <div className="sm:col-span-4">
        {error && <p className="mb-2 text-sm text-expense">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60">
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </div>
    </motion.form>
  );
}
