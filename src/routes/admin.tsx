import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { MonthCalendar } from "@/components/MonthCalendar";
import { HourGrid } from "@/components/HourGrid";
import { HOURS, PRICE_PER_HOUR, formatHour, toISODate, type Booking } from "@/lib/booking";

const ADMIN_EMAIL = "ahajizakariae2@gmail.com";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Administration — Zakariae AHAJI" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Espace privé de gestion des réservations." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="min-h-screen bg-background" />;
  if (!email) return <SignIn />;
  return <Dashboard email={email} />;
}

function SignIn() {
  const { t } = useI18n();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (mode: "in" | "up") => {
    setMsg(null);
    setBusy(true);
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) setMsg(error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6">
        <h1 className="font-display text-2xl">{t("admin.title")}</h1>
        <div className="mt-5 grid gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("admin.email")}
            autoComplete="email"
            className="rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-walnut"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("admin.password")}
            autoComplete="current-password"
            className="rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:border-walnut"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => run("in")}
            className="rounded-full bg-walnut px-5 py-2.5 text-sm font-semibold text-[#f7f2e7] hover:bg-walnut-deep disabled:opacity-60"
          >
            {t("admin.signin")}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run("up")}
            className="text-xs text-muted-foreground underline hover:text-walnut"
          >
            {t("admin.signup")}
          </button>
        </div>
        {msg ? <p className="mt-3 text-sm text-rust">{msg}</p> : null}
      </div>
    </div>
  );
}

type Draft = {
  id: string | null;
  full_name: string;
  phone: string;
  level: string;
  hours: number[];
};

function Dashboard({ email }: { email: string }) {
  const { t, locale } = useI18n();
  const [day, setDay] = useState<string>(() => toISODate(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [markedDays, setMarkedDays] = useState<string[]>([]);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [blockedHours, setBlockedHours] = useState<number[]>([]);
  const [pickedHours, setPickedHours] = useState<number[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isAdmin = email === ADMIN_EMAIL;

  const flash = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(null), 3000);
  };

  const load = useCallback(async () => {
    const [{ data: all }, { data: bd }, { data: bh }] = await Promise.all([
      supabase.from("bookings").select("*").order("booking_date"),
      supabase.from("blocked_days").select("day"),
      supabase.from("blocked_hours").select("hour").eq("day", day),
    ]);
    const rows = (all ?? []) as Booking[];
    setBookings(rows.filter((b) => b.booking_date === day));
    setMarkedDays([...new Set(rows.map((b) => b.booking_date))]);
    setBlockedDays((bd ?? []).map((r) => r.day as string));
    setBlockedHours((bh ?? []).map((r) => r.hour as number));
    setPickedHours([]);
  }, [day]);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
        <p className="text-rust">{t("admin.denied")}</p>
        <button type="button" onClick={signOut} className="text-sm underline">
          {t("admin.signout")}
        </button>
      </div>
    );
  }

  const dayIsBlocked = blockedDays.includes(day);
  const bookedHours = bookings.flatMap((b) => b.hours);

  const toggleDayBlock = async () => {
    if (dayIsBlocked) await supabase.from("blocked_days").delete().eq("day", day);
    else await supabase.from("blocked_days").insert({ day });
    await load();
    flash(t("admin.saved"));
  };

  const blockPicked = async () => {
    if (pickedHours.length === 0) return;
    await supabase.from("blocked_hours").insert(pickedHours.map((hour) => ({ day, hour })));
    await load();
    flash(t("admin.saved"));
  };

  const unblockPicked = async () => {
    if (pickedHours.length === 0) return;
    await supabase.from("blocked_hours").delete().eq("day", day).in("hour", pickedHours);
    await load();
    flash(t("admin.saved"));
  };

  const removeBooking = async (id: string) => {
    await supabase.from("bookings").delete().eq("id", id);
    await load();
    flash(t("admin.deleted"));
  };

  const saveDraft = async () => {
    if (!draft || draft.hours.length === 0 || !draft.full_name.trim() || !draft.phone.trim()) return;
    const payload = {
      full_name: draft.full_name.trim(),
      phone: draft.phone.trim(),
      level: draft.level,
      booking_date: day,
      hours: draft.hours,
      price_per_hour: PRICE_PER_HOUR,
      total_price: draft.hours.length * PRICE_PER_HOUR,
    };
    if (draft.id) await supabase.from("bookings").update(payload).eq("id", draft.id);
    else await supabase.from("bookings").insert(payload);
    setDraft(null);
    await load();
    flash(t("admin.saved"));
  };

  const readableDay = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(`${day}T12:00:00`),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="font-display text-xl">{t("admin.title")}</h1>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-border px-4 py-1.5 text-sm hover:border-walnut hover:text-walnut"
          >
            {t("admin.signout")}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <div>
          <MonthCalendar
            selected={day}
            onSelect={setDay}
            markedDays={markedDays}
            allowPast
          />
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={toggleDayBlock}
              className={[
                "rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                dayIsBlocked
                  ? "border border-olive text-olive hover:bg-olive hover:text-[#f7f2e7]"
                  : "bg-rust text-[#f7f2e7] hover:opacity-90",
              ].join(" ")}
            >
              {dayIsBlocked ? t("admin.unblockDay") : t("admin.blockDay")}
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft({ id: null, full_name: "", phone: "", level: t("booking.beginner"), hours: [] })
              }
              className="rounded-full border border-walnut px-4 py-2.5 text-sm font-semibold text-walnut hover:bg-walnut hover:text-[#f7f2e7]"
            >
              {t("admin.new")}
            </button>
          </div>
          {notice ? <p className="mt-3 text-sm text-olive">{notice}</p> : null}
        </div>

        <div>
          <h2 className="font-display text-lg">
            {t("admin.bookingsOn")} {readableDay}
          </h2>

          <div className="mt-4 grid gap-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("admin.none")}</p>
            ) : (
              bookings.map((b) => (
                <div key={b.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display">{b.full_name}</p>
                      <p className="text-sm text-muted-foreground">{b.phone}</p>
                      <p className="mt-1 text-sm">
                        {b.hours.map(formatHour).join(", ")} — {b.level}
                      </p>
                      <p className="text-sm text-walnut">{b.total_price} DH</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            id: b.id,
                            full_name: b.full_name,
                            phone: b.phone,
                            level: b.level,
                            hours: b.hours,
                          })
                        }
                        className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-walnut hover:text-walnut"
                      >
                        {t("admin.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBooking(b.id)}
                        className="rounded-full border border-rust px-3 py-1.5 text-xs text-rust hover:bg-rust hover:text-[#f7f2e7]"
                      >
                        {t("admin.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {draft ? (
            <div className="mt-6 rounded-xl border border-walnut/50 bg-card p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={draft.full_name}
                  onChange={(e) => setDraft({ ...draft, full_name: e.target.value })}
                  placeholder={t("booking.name")}
                  className="rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-walnut"
                />
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder={t("booking.phone")}
                  className="rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-walnut"
                />
                <select
                  value={draft.level}
                  onChange={(e) => setDraft({ ...draft, level: e.target.value })}
                  className="rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-walnut sm:col-span-2"
                >
                  <option value={t("booking.beginner")}>{t("booking.beginner")}</option>
                  <option value={t("booking.intermediate")}>{t("booking.intermediate")}</option>
                </select>
              </div>
              <div className="mt-4">
                <HourGrid
                  selected={draft.hours}
                  onToggle={(h) =>
                    setDraft({
                      ...draft,
                      hours: draft.hours.includes(h)
                        ? draft.hours.filter((x) => x !== h)
                        : [...draft.hours, h].sort((a, b) => a - b),
                    })
                  }
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="rounded-full bg-walnut px-5 py-2 text-sm font-semibold text-[#f7f2e7] hover:bg-walnut-deep"
                >
                  {t("admin.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setDraft(null)}
                  className="text-sm text-muted-foreground underline"
                >
                  {t("admin.cancel")}
                </button>
                <span className="ms-auto font-display text-walnut">
                  {draft.hours.length * PRICE_PER_HOUR} DH
                </span>
              </div>
            </div>
          ) : null}

          <div className="mt-8">
            <h3 className="font-display text-lg">{t("booking.pickHours")}</h3>
            <div className="mt-3">
              <HourGrid
                selected={pickedHours}
                onToggle={(h) =>
                  setPickedHours((prev) =>
                    prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
                  )
                }
                unavailable={bookedHours.filter((h) => HOURS.includes(h))}
                labelUnavailable={t("booking.taken")}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {blockedHours.length > 0
                ? `${t("booking.taken")}: ${blockedHours.map(formatHour).join(", ")}`
                : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={blockPicked}
                className="rounded-full bg-rust px-4 py-2 text-sm font-semibold text-[#f7f2e7] hover:opacity-90"
              >
                {t("admin.blockHours")}
              </button>
              <button
                type="button"
                onClick={unblockPicked}
                className="rounded-full border border-olive px-4 py-2 text-sm font-semibold text-olive hover:bg-olive hover:text-[#f7f2e7]"
              >
                {t("admin.unblockHours")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
