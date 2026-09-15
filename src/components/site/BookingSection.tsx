import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MonthCalendar } from "@/components/MonthCalendar";
import { HourGrid } from "@/components/HourGrid";
import {
  PRICE_PER_HOUR,
  bookingMessage,
  fetchBlockedDays,
  fetchBlockedHours,
  fetchTakenHours,
  whatsappUrl,
  type Level,
} from "@/lib/booking";
import { supabase } from "@/integrations/supabase/client";

export function BookingSection() {
  const { t, locale } = useI18n();
  const [level, setLevel] = useState<Level>("beginner");
  const [date, setDate] = useState<string | null>(null);
  const [hours, setHours] = useState<number[]>([]);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [unavailable, setUnavailable] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlockedDays().then(setBlockedDays);
  }, []);

  useEffect(() => {
    if (!date) return;
    setHours([]);
    Promise.all([fetchBlockedHours(date), fetchTakenHours(date)]).then(([b, taken]) =>
      setUnavailable([...new Set([...b, ...taken])]),
    );
  }, [date]);

  const total = hours.length * PRICE_PER_HOUR;
  const levelLabel = level === "beginner" ? t("booking.beginner") : t("booking.intermediate");

  const toggleHour = (h: number) =>
    setHours((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h].sort((a, b) => a - b)));

  const submit = async () => {
    setStatus(null);
    if (!date || hours.length === 0 || !name.trim() || !phone.trim()) {
      setStatus({ kind: "error", text: t("booking.errorFields") });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      full_name: name.trim(),
      phone: phone.trim(),
      level: levelLabel,
      booking_date: date,
      hours,
      price_per_hour: PRICE_PER_HOUR,
      total_price: total,
    });
    setSaving(false);
    if (error) {
      setStatus({ kind: "error", text: t("booking.errorSave") });
      return;
    }
    const readableDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(
      new Date(`${date}T12:00:00`),
    );
    setStatus({ kind: "ok", text: t("booking.success") });
    window.open(
      whatsappUrl(
        bookingMessage({ name: name.trim(), phone: phone.trim(), levelLabel, date: readableDate, hours, total }),
      ),
      "_blank",
    );
    setHours([]);
    setName("");
    setPhone("");
    if (date) {
      const [b, taken] = await Promise.all([fetchBlockedHours(date), fetchTakenHours(date)]);
      setUnavailable([...new Set([...b, ...taken])]);
    }
  };

  return (
    <section id="booking" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="text-3xl sm:text-4xl">{t("booking.title")}</h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="font-display text-sm text-muted-foreground">{t("booking.level")}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(["beginner", "intermediate"] as Level[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={[
                  "rounded-xl border p-4 text-start transition-colors",
                  level === l ? "border-walnut bg-walnut/10" : "border-border hover:border-walnut",
                ].join(" ")}
              >
                <span className="block font-display">
                  {l === "beginner" ? t("booking.beginner") : t("booking.intermediate")}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {PRICE_PER_HOUR} {t("booking.perHour")}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-8 font-display text-sm text-muted-foreground">{t("booking.pickDate")}</p>
          <div className="mt-3">
            <MonthCalendar selected={date} onSelect={setDate} blockedDays={blockedDays} />
          </div>
        </div>

        <div>
          <p className="font-display text-sm text-muted-foreground">{t("booking.pickHours")}</p>
          <div className="mt-3">
            {date ? (
              <HourGrid
                selected={hours}
                onToggle={toggleHour}
                unavailable={unavailable}
                labelUnavailable={t("booking.taken")}
              />
            ) : (
              <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                {t("booking.pickDateFirst")}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              placeholder={t("booking.name")}
              className="rounded-lg border border-input bg-card px-3 py-2.5 outline-none focus:border-walnut"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
              inputMode="tel"
              placeholder={t("booking.phone")}
              className="rounded-lg border border-input bg-card px-3 py-2.5 outline-none focus:border-walnut"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <span className="text-sm text-muted-foreground">{t("booking.total")}</span>
              <p className="font-display text-2xl text-walnut">{total} DH</p>
              <span className="text-xs text-muted-foreground">
                {hours.length} {t("booking.hours")} × {PRICE_PER_HOUR} DH
              </span>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="rounded-full bg-walnut px-6 py-3 text-sm font-semibold text-[#f7f2e7] transition-colors hover:bg-walnut-deep disabled:opacity-60"
            >
              {saving ? t("booking.sending") : t("booking.confirm")}
            </button>
          </div>

          {status ? (
            <p className={`mt-3 text-sm ${status.kind === "ok" ? "text-olive" : "text-rust"}`}>
              {status.text}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
