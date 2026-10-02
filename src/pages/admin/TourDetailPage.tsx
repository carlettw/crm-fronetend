import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  addStop,
  addTourist,
  assignDriver,
  assignGuide,
  getAdminTour,
  markAssignmentPaid,
  sendGuideOffer,
  submitAdjustment,
  updateTourStatus,
} from "@/api/adminTours";
import { Spinner } from "@/components/Spinner";
import type { AssignmentRole, Stop, TourStatus } from "@/types";
import { formatDate, formatMoney, formatTime } from "@/utils/format";

const statusLabel: Record<TourStatus, string> = {
  draft: "Qoralama",
  assigned: "Biriktirilgan",
  in_progress: "Jarayonda",
  completed: "Yakunlangan",
  cancelled: "Bekor qilingan",
};
const roleLabel: Record<AssignmentRole, string> = { guide: "Git", driver: "Haydovchi", guide_trainee: "Hamroh" };
const allStatuses: TourStatus[] = ["draft", "assigned", "in_progress", "completed", "cancelled"];
const inputClass = "rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary";

export function TourDetailPage() {
  const { id } = useParams();
  const tourId = Number(id);
  const queryClient = useQueryClient();

  const tourQuery = useQuery({
    queryKey: ["admin-tour", tourId],
    queryFn: () => getAdminTour(tourId),
    enabled: Number.isFinite(tourId),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["admin-tour", tourId] });
    queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
  }

  if (tourQuery.isLoading) return <Spinner label="Yuklanmoqda" />;
  if (tourQuery.isError || !tourQuery.data) return <p className="text-sm text-expense">Tur topilmadi.</p>;
  const tour = tourQuery.data;
  const hasGuide = tour.assignments.some((a) => a.role === "guide");

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl">{tour.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {formatDate(tour.tour_date)} · {formatTime(tour.start_time)} · {tour.tourists_count} turist
          </p>
        </div>
        <select
          value={tour.status}
          onChange={async (e) => {
            await updateTourStatus(tour.id, e.target.value as TourStatus);
            refresh();
          }}
          className={inputClass}
        >
          {allStatuses.map((s) => (
            <option key={s} value={s}>{statusLabel[s]}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm">{tour.description}</p>
      <p className="tnum mt-2 text-lg font-medium">{formatMoney(tour.total_price, tour.currency)}</p>

      <section className="mt-8">
        <h2 className="font-display text-lg">Biriktirilganlar</h2>
        <div className="mt-3 flex flex-col gap-2">
          {tour.assignments.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
              <div>
                <p className="text-sm font-medium">{a.full_name}</p>
                <p className="text-xs text-muted">{roleLabel[a.role]}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="tnum text-sm">{formatMoney(a.fee_amount, tour.currency)}</span>
                {a.fee_status === "paid" ? (
                  <span className="text-xs text-profit">To'langan</span>
                ) : (
                  <button onClick={async () => { await markAssignmentPaid(tour.id, a.id); refresh(); }} className="rounded-md border border-border px-3 py-1 text-xs hover:bg-paper">
                    To'landi deb belgilash
                  </button>
                )}
              </div>
            </div>
          ))}
          {tour.assignments.length === 0 && <p className="text-sm text-muted">Hali hech kim biriktirilmagan.</p>}
        </div>

        {!tour.assignments.some((a) => a.role === "driver") && <AssignDriverForm tourId={tour.id} onDone={refresh} />}
        {!hasGuide && (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <AssignGuideForm tourId={tour.id} onDone={refresh} />
            <SendOfferForm tourId={tour.id} onDone={refresh} />
          </div>
        )}

        {tour.guide_offers.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium">Darajaga yuborilgan takliflar</p>
            <div className="mt-2 flex flex-col gap-1">
              {tour.guide_offers.map((o) => (
                <p key={o.id} className="text-sm text-muted">
                  {o.target_level}-daraja — {o.status === "pending" ? "kutilmoqda" : o.status === "filled" ? "qabul qilindi" : "bekor qilingan"}
                </p>
              ))}
            </div>
          </div>
        )}

        <AdjustmentForm tourId={tour.id} assignments={tour.assignments} onDone={refresh} />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg">To'xtash nuqtalari</h2>
        <ol className="mt-3 flex flex-col gap-2">
          {[...tour.stops].sort((a, b) => a.order_no - b.order_no).map((s) => (
            <li key={s.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <span className="text-xs text-muted">{s.type === "pickup" ? "Olib ketish" : "Tushirish"}</span>
              <p className="font-medium">{s.name}</p>
              {s.planned_time && <p className="text-xs text-muted">{formatTime(s.planned_time)}</p>}
            </li>
          ))}
          {tour.stops.length === 0 && <p className="text-sm text-muted">Hali nuqta yo'q.</p>}
        </ol>
        <AddStopForm tourId={tour.id} nextOrder={tour.stops.length + 1} onAdded={refresh} />
      </section>

      <section className="mt-8 mb-12">
        <h2 className="font-display text-lg">Turistlar</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {tour.tourists.map((t) => (
            <li key={t.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <p className="font-medium">{t.full_name}</p>
              <p className="text-xs text-muted">{t.phone}</p>
              {t.note && <p className="mt-1 text-xs text-muted">{t.note}</p>}
            </li>
          ))}
          {tour.tourists.length === 0 && <p className="text-sm text-muted">Hali turist yo'q.</p>}
        </ul>
        <AddTouristForm tourId={tour.id} onAdded={refresh} />
      </section>
    </div>
  );
}

function AssignDriverForm({ tourId, onDone }: { tourId: number; onDone: () => void }) {
  const [userId, setUserId] = useState("");
  const [fee, setFee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await assignDriver(tourId, Number(userId), Number(fee));
      setUserId("");
      setFee("");
      onDone();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2">
      <input required placeholder="Haydovchi user_id" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} w-44`} />
      <input required type="number" min={0} placeholder="Haq" value={fee} onChange={(e) => setFee(e.target.value)} className={`${inputClass} w-32`} />
      <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:brightness-110 disabled:opacity-60">
        Haydovchi biriktirish
      </button>
    </form>
  );
}

function AssignGuideForm({ tourId, onDone }: { tourId: number; onDone: () => void }) {
  const [userId, setUserId] = useState("");
  const [fee, setFee] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await assignGuide(tourId, Number(userId), Number(fee));
      setUserId("");
      setFee("");
      onDone();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input required placeholder="Git user_id" value={userId} onChange={(e) => setUserId(e.target.value)} className={`${inputClass} w-36`} />
      <input required type="number" min={0} placeholder="Haq" value={fee} onChange={(e) => setFee(e.target.value)} className={`${inputClass} w-28`} />
      <button type="submit" disabled={submitting} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-paper disabled:opacity-60">
        Aniq git biriktirish
      </button>
    </form>
  );
}

function SendOfferForm({ tourId, onDone }: { tourId: number; onDone: () => void }) {
  const [level, setLevel] = useState("3");
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendGuideOffer(tourId, Number(level));
      onDone();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select value={level} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
        {[1, 2, 3, 4, 5, 6, 7].map((l) => <option key={l} value={l}>{l}-daraja</option>)}
      </select>
      <button type="submit" disabled={submitting} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-paper disabled:opacity-60">
        Darajaga taklif yuborish
      </button>
    </form>
  );
}

function AdjustmentForm({ tourId, assignments, onDone }: { tourId: number; assignments: { id: number; user_id: number; full_name: string }[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return assignments.length > 0 ? (
      <button onClick={() => setOpen(true)} className="mt-3 text-sm text-primary-bright">+ Bonus/jarima kiritish</button>
    ) : null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAdjustment(tourId, Number(userId), Number(amount), reason);
      setOpen(false);
      setUserId("");
      setAmount("");
      setReason("");
      onDone();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
      <select required value={userId} onChange={(e) => setUserId(e.target.value)} className={inputClass}>
        <option value="">Kimga</option>
        {assignments.map((a) => (
          <option key={a.id} value={a.user_id}>{a.full_name}</option>
        ))}
      </select>
      <input required type="number" placeholder="Summa (jarima uchun manfiy)" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputClass} w-56`} />
      <input required placeholder="Sabab" value={reason} onChange={(e) => setReason(e.target.value)} className={`${inputClass} flex-1`} />
      <button type="submit" disabled={submitting} className="rounded-md bg-gold px-4 py-2 text-sm text-white hover:brightness-110 disabled:opacity-60">
        Kiritish
      </button>
    </motion.form>
  );
}

function AddStopForm({ tourId, nextOrder, onAdded }: { tourId: number; nextOrder: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<Stop["type"]>("pickup");
  const [name, setName] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!open) return <button onClick={() => setOpen(true)} className="mt-3 text-sm text-primary-bright">+ Nuqta qo'shish</button>;
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addStop(tourId, { type, name, map_url: mapUrl || null, order_no: nextOrder });
      setName("");
      setMapUrl("");
      setOpen(false);
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2">
      <select value={type} onChange={(e) => setType(e.target.value as Stop["type"])} className={inputClass}>
        <option value="pickup">Olib ketish</option>
        <option value="dropoff">Tushirish</option>
      </select>
      <input required placeholder="Nomi" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      <input type="url" placeholder="Xarita havolasi (ixtiyoriy)" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className={inputClass} />
      <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-60">Qo'shish</button>
    </form>
  );
}

function AddTouristForm({ tourId, onAdded }: { tourId: number; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  if (!open) return <button onClick={() => setOpen(true)} className="mt-3 text-sm text-primary-bright">+ Turist qo'shish</button>;
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addTourist(tourId, { full_name: fullName, phone });
      setFullName("");
      setPhone("");
      setOpen(false);
      onAdded();
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-center gap-2">
      <input required placeholder="To'liq ism" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
      <input required placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <button type="submit" disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm text-white disabled:opacity-60">Qo'shish</button>
    </form>
  );
}
