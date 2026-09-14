import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { toISODate } from "@/lib/booking";

type Props = {
  selected: string | null;
  onSelect: (iso: string) => void;
  blockedDays?: string[];
  markedDays?: string[];
  allowPast?: boolean;
};

export function MonthCalendar({
  selected,
  onSelect,
  blockedDays = [],
  markedDays = [],
  allowPast = false,
}: Props) {
  const { locale, dir } = useI18n();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(cursor);

  const weekdayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // Monday-first week
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)));
  }, [locale]);

  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1),
    ),
  ];

  const shiftMonth = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const prevArrow = dir === "rtl" ? "›" : "‹";
  const nextArrow = dir === "rtl" ? "‹" : "›";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="h-9 w-9 rounded-full border border-border text-lg leading-none text-muted-foreground transition-colors hover:border-walnut hover:text-walnut"
          aria-label="previous month"
        >
          {prevArrow}
        </button>
        <span className="font-display text-lg capitalize">{monthLabel}</span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="h-9 w-9 rounded-full border border-border text-lg leading-none text-muted-foreground transition-colors hover:border-walnut hover:text-walnut"
          aria-label="next month"
        >
          {nextArrow}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekdayNames.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((date, idx) => {
          if (!date) return <div key={`e-${idx}`} />;
          const iso = toISODate(date);
          const isPast = !allowPast && date < today;
          const isBlocked = blockedDays.includes(iso);
          const isSelected = selected === iso;
          const hasMark = markedDays.includes(iso);
          const disabled = isPast || isBlocked;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(iso)}
              className={[
                "relative aspect-square rounded-lg text-sm transition-colors",
                isSelected
                  ? "bg-walnut text-[#f7f2e7]"
                  : disabled
                    ? "text-muted-foreground/45"
                    : "hover:bg-muted",
                isBlocked ? "line-through decoration-rust decoration-2" : "",
              ].join(" ")}
            >
              {date.getDate()}
              {hasMark && !isSelected ? (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-mustard" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
