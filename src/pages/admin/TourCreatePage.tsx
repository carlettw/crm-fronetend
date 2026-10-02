import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createTour } from "@/api/adminTours";
import type { Currency, Stop, Tourist } from "@/types";
import type { AxiosError } from "axios";
import type { ApiError } from "@/types";

let tempId = 0;
function nextId() {
  tempId += 1;
  return tempId;
}

interface DraftStop extends Omit<Stop, "id"> {
  _key: number;
}
interface DraftTourist extends Omit<Tourist, "id"> {
  _key: number;
}

const inputClass = "rounded-md border border-border bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-primary";

export function TourCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tourDate, setTourDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [touristsCount, setTouristsCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState("");
  const [currency, setCurrency] = useState<Currency>("UZS");
  const [stops, setStops] = useState<DraftStop[]>([]);
  const [tourists, setTourists] = useState<DraftTourist[]>([]);

  const [driverUserId, setDriverUserId] = useState("");
  const [driverFee, setDriverFee] = useState("");
  const [guideMode, setGuideMode] = useState<"none" | "direct" | "offer">("offer");
  const [guideUserId, setGuideUserId] = useState("");
  const [guideFee, setGuideFee] = useState("");
  const [offerLevel, setOfferLevel] = useState("3");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addStop() {
    setStops((s) => [...s, { _key: nextId(), type: "pickup", name: "", order_no: s.length + 1 }]);
  }
  function updateStop(key: number, patch: Partial<DraftStop>) {
    setStops((s) => s.map((st) => (st._key === key ? { ...st, ...patch } : st)));
  }
  function removeStop(key: number) {
    setStops((s) => s.filter((st) => st._key !== key));
  }
  function addTourist() {
    setTourists((t) => [...t, { _key: nextId(), full_name: "", phone: "" }]);
  }
  function updateTourist(key: number, patch: Partial<DraftTourist>) {
    setTourists((t) => t.map((tr) => (tr._key === key ? { ...tr, ...patch } : tr)));
  }
  function removeTourist(key: number) {
    setTourists((t) => t.filter((tr) => tr._key !== key));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const tour = await createTour({
        title,
        description,
        tour_date: tourDate,
        start_time: startTime,
        tourists_count: touristsCount,
        total_price: Number(totalPrice),
        currency,
        stops: stops.map(({ _key, ...s }) => s),
        tourists: tourists.map(({ _key, ...t }) => t),
        driver: driverUserId ? { user_id: Number(driverUserId), fee_amount: Number(driverFee || 0) } : undefined,
        guide: guideMode === "direct" && guideUserId ? { user_id: Number(guideUserId), fee_amount: Number(guideFee || 0) } : undefined,
        guide_offer_level: guideMode === "offer" ? Number(offerLevel) : null,
      });
      navigate(`/admin/tours/${tour.id}`);
    } catch (err) {
      const detail = (err as AxiosError<ApiError>).response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Turni saqlab bo'lmadi. Maydonlarni tekshiring.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <h1 className="font-display text-2xl">Yangi tur</h1>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input required placeholder="Tur nomi" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} sm:col-span-2`} />
        <textarea required placeholder="Tavsif" value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} sm:col-span-2`} rows={3} />
        <input required type="date" value={tourDate} onChange={(e) => setTourDate(e.target.value)} className={inputClass} />
        <input required type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
        <input required type="number" min={1} placeholder="Turistlar soni" value={touristsCount} onChange={(e) => setTouristsCount(Number(e.target.value))} className={inputClass} />
        <div className="flex gap-2">
          <input required type="number" min={0} placeholder="Umumiy narx" value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className={`${inputClass} flex-1`} />
          <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={inputClass}>
            <option value="UZS">UZS</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">To'xtash nuqtalari</h2>
          <button type="button" onClick={addStop} className="text-sm text-primary-bright">+ Qo'shish</button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {stops.map((stop) => (
            <motion.div key={stop._key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-5">
              <select value={stop.type} onChange={(e) => updateStop(stop._key, { type: e.target.value as Stop["type"] })} className={inputClass}>
                <option value="pickup">Olib ketish</option>
                <option value="dropoff">Tushirish</option>
              </select>
              <input required placeholder="Nomi" value={stop.name} onChange={(e) => updateStop(stop._key, { name: e.target.value })} className={`${inputClass} sm:col-span-2`} />
              <input type="url" placeholder="Xarita havolasi (ixtiyoriy)" value={stop.map_url ?? ""} onChange={(e) => updateStop(stop._key, { map_url: e.target.value })} className={inputClass} />
              <div className="flex items-center gap-2">
                <input type="time" value={stop.planned_time ?? ""} onChange={(e) => updateStop(stop._key, { planned_time: e.target.value })} className={`${inputClass} flex-1`} />
                <button type="button" onClick={() => removeStop(stop._key)} className="text-sm text-expense">O'chirish</button>
              </div>
            </motion.div>
          ))}
          {stops.length === 0 && <p className="text-sm text-muted">Hozircha nuqta yo'q.</p>}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Turistlar</h2>
          <button type="button" onClick={addTourist} className="text-sm text-primary-bright">+ Qo'shish</button>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {tourists.map((t) => (
            <motion.div key={t._key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-4">
              <input required placeholder="To'liq ism" value={t.full_name} onChange={(e) => updateTourist(t._key, { full_name: e.target.value })} className={`${inputClass} sm:col-span-2`} />
              <input required placeholder="Telefon" value={t.phone} onChange={(e) => updateTourist(t._key, { phone: e.target.value })} className={inputClass} />
              <div className="flex items-center gap-2">
                <input placeholder="Izoh" value={t.note ?? ""} onChange={(e) => updateTourist(t._key, { note: e.target.value })} className={`${inputClass} flex-1`} />
                <button type="button" onClick={() => removeTourist(t._key)} className="text-sm text-expense">O'chirish</button>
              </div>
            </motion.div>
          ))}
          {tourists.length === 0 && <p className="text-sm text-muted">Hozircha turist yo'q.</p>}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg">Haydovchi (ixtiyoriy)</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input placeholder="Haydovchi user_id" value={driverUserId} onChange={(e) => setDriverUserId(e.target.value)} className={inputClass} />
          <input type="number" min={0} placeholder="Haq miqdori" value={driverFee} onChange={(e) => setDriverFee(e.target.value)} className={inputClass} />
        </div>
      </section>

      <section className="mt-8 mb-6">
        <h2 className="font-display text-lg">Git</h2>
        <div className="mt-3 flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input type="radio" checked={guideMode === "offer"} onChange={() => setGuideMode("offer")} /> Darajaga taklif
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={guideMode === "direct"} onChange={() => setGuideMode("direct")} /> Aniq git
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={guideMode === "none"} onChange={() => setGuideMode("none")} /> Hozircha yo'q
          </label>
        </div>
        {guideMode === "offer" && (
          <select value={offerLevel} onChange={(e) => setOfferLevel(e.target.value)} className={`${inputClass} mt-3`}>
            {[1, 2, 3, 4, 5, 6, 7].map((l) => (
              <option key={l} value={l}>{l}-daraja</option>
            ))}
          </select>
        )}
        {guideMode === "direct" && (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input placeholder="Git user_id" value={guideUserId} onChange={(e) => setGuideUserId(e.target.value)} className={inputClass} />
            <input type="number" min={0} placeholder="Haq miqdori" value={guideFee} onChange={(e) => setGuideFee(e.target.value)} className={inputClass} />
          </div>
        )}
      </section>

      {error && <p className="mt-4 text-sm text-expense">{error}</p>}
      <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={submitting} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60">
        {submitting ? "Saqlanmoqda..." : "Turni saqlash"}
      </motion.button>
    </form>
  );
}
