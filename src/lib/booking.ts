import { supabase } from "@/integrations/supabase/client";

export const WHATSAPP_NUMBER = "212649412642";
export const PRICE_PER_HOUR = 350;
export const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00 → 20:00

export type Level = "beginner" | "intermediate";

export type Booking = {
  id: string;
  full_name: string;
  phone: string;
  level: string;
  booking_date: string;
  hours: number[];
  price_per_hour: number;
  total_price: number;
  created_at: string;
};

export const toISODate = (d: Date) => {
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export const formatHour = (h: number) => `${`${h}`.padStart(2, "0")}:00`;

export async function fetchBlockedDays(): Promise<string[]> {
  const { data } = await supabase.from("blocked_days").select("day");
  return (data ?? []).map((r) => r.day as string);
}

export async function fetchBlockedHours(day: string): Promise<number[]> {
  const { data } = await supabase.from("blocked_hours").select("hour").eq("day", day);
  return (data ?? []).map((r) => r.hour as number);
}

export async function fetchTakenHours(day: string): Promise<number[]> {
  const { data } = await supabase.rpc("taken_hours", { d: day });
  return ((data ?? []) as { hour: number }[] | number[]).map((r) =>
    typeof r === "number" ? r : r.hour,
  );
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function bookingMessage(input: {
  name: string;
  phone: string;
  levelLabel: string;
  date: string;
  hours: number[];
  total: number;
}) {
  return [
    "Nouvelle réservation — Zakariae AHAJI",
    `Nom : ${input.name}`,
    `Téléphone : ${input.phone}`,
    `Niveau : ${input.levelLabel}`,
    `Date : ${input.date}`,
    `Heures : ${input.hours.map(formatHour).join(", ")}`,
    `Total : ${input.total} DH`,
  ].join("\n");
}
