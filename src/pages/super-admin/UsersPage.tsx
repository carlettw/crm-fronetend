import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { createAnyUser, listAllUsers, updateAnyUser } from "@/api/superAdmin";
import { Spinner } from "@/components/Spinner";
import type { ApiError, Role, User } from "@/types";
import type { AxiosError } from "axios";

const roleLabel: Record<Role, string> = {
  super_admin: "Super admin",
  boss: "Boshliq",
  admin: "Admin",
  guide: "Git",
  driver: "Haydovchi",
};
const roleFilters: (Role | "all")[] = ["all", "boss", "admin", "guide", "driver", "super_admin"];
const inputClass = "rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary";

export function SuperAdminUsersPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Role | "all">("all");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["super-admin-users", filter],
    queryFn: () => listAllUsers(filter === "all" ? undefined : { role: filter }),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["super-admin-users"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Foydalanuvchilar</h1>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:brightness-110"
        >
          {showForm ? "Bekor qilish" : "+ Yangi foydalanuvchi"}
        </motion.button>
      </div>

      {showForm && <CreateForm onCreated={() => { invalidate(); setShowForm(false); }} />}

      <div className="mt-6 flex flex-wrap gap-2">
        {roleFilters.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filter === r ? "bg-primary text-white" : "border border-border text-muted hover:bg-paper"
            }`}
          >
            {r === "all" ? "Hammasi" : roleLabel[r]}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {isLoading && <Spinner />}
        {isError && <p className="text-sm text-expense">Yuklab bo'lmadi.</p>}
        {data && data.length === 0 && <p className="text-sm text-muted">Bu rolda foydalanuvchi yo'q.</p>}
        {data && data.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="bg-paper text-left text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Ism</th>
                  <th className="px-4 py-2 font-medium">Telefon</th>
                  <th className="px-4 py-2 font-medium">Rol</th>
                  <th className="px-4 py-2 font-medium">Holat</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <Row key={u.id} user={u} onUpdated={invalidate} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ user, onUpdated }: { user: User; onUpdated: () => void }) {
  const [busy, setBusy] = useState(false);
  async function toggleActive() {
    setBusy(true);
    try {
      await updateAnyUser(user.id, { is_active: !user.is_active });
      onUpdated();
    } finally {
      setBusy(false);
    }
  }
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-2">{user.full_name}</td>
      <td className="px-4 py-2 text-muted">{user.phone}</td>
      <td className="px-4 py-2">{roleLabel[user.role]}</td>
      <td className="px-4 py-2">
        <span className={user.is_active ? "text-profit" : "text-expense"}>{user.is_active ? "Faol" : "O'chirilgan"}</span>
      </td>
      <td className="px-4 py-2 text-right">
        <button disabled={busy} onClick={toggleActive} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-paper disabled:opacity-50">
          {user.is_active ? "O'chirish" : "Yoqish"}
        </button>
      </td>
    </tr>
  );
}

function CreateForm({ onCreated }: { onCreated: () => void }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("guide");
  const [bossId, setBossId] = useState("");
  const [commission, setCommission] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createAnyUser({
        full_name: fullName,
        phone,
        password,
        role,
        boss_id: role === "admin" && bossId ? Number(bossId) : undefined,
        commission_percent: role === "boss" && commission ? Number(commission) : undefined,
      });
      setFullName("");
      setPhone("");
      setPassword("");
      setBossId("");
      setCommission("");
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
      className="mt-4 grid grid-cols-1 gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-6"
    >
      <input required placeholder="To'liq ism" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`${inputClass} sm:col-span-2`} />
      <input required placeholder="+998901234567" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <input required minLength={6} type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputClass}>
        <option value="guide">Git</option>
        <option value="driver">Haydovchi</option>
        <option value="boss">Boshliq</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super admin</option>
      </select>
      {role === "admin" && (
        <input placeholder="Boss ID" value={bossId} onChange={(e) => setBossId(e.target.value)} className={inputClass} />
      )}
      {role === "boss" && (
        <input placeholder="Komissiya %" type="number" min={0} max={100} value={commission} onChange={(e) => setCommission(e.target.value)} className={inputClass} />
      )}
      <div className="sm:col-span-6">
        {error && <p className="mb-2 text-sm text-expense">{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60">
          {submitting ? "Saqlanmoqda..." : "Saqlash"}
        </motion.button>
      </div>
    </motion.form>
  );
}
